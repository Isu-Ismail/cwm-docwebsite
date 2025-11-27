const cwmDocs = {
    "jump": {
        title: "Jump (Project Teleporter)",
        syntax: "cwm jump [name|id] [flags]",
        summary: "Instantly open your projects in VS Code, Terminal, or Jupyter without navigating folders.",
        logic: `
            <p>The <code>jump</code> command uses a <strong>Detached Process</strong> model. unlike aliases that change your current directory, CWM spawns a new independent window for your project.</p>
            <p><strong>How it works:</strong></p>
            <ul>
                <li><strong>Smart Launch:</strong> If the target app is a console tool (like <code>jupyter</code> or <code>cmd</code>), CWM opens a new console window that <em>inherits</em> your current Virtual Environment (venv). If it's a GUI tool (like VS Code), it launches silently in the background.</li>
                <li><strong>Fuzzy Matching:</strong> You don't need the exact name. If you have a project <code>my-awesome-api</code>, typing <code>cwm jump api</code> will likely find it.</li>
                <li><strong>Usage Ranking:</strong> CWM tracks "Hits". Frequently accessed projects bubble to the top of the list automatically.</li>
            </ul>
        `,
        flags: [
            { name: "name", desc: "The project Alias or ID. Can be comma-separated (e.g., <code>1,2</code>)." },
            { name: "-t, --terminal", desc: "Also open a new detached terminal window at the project location." },
            // { name: "-x, --exec <cmd>", desc: "Batch Execute: Opens terminals for all selected projects and auto-runs a command (e.g., 'npm run dev')." },
            { name: "-n <count>", desc: "Limit the list view. Use <code>-n all</code> to see everything." }
        ]
    },
    "project": {
        title: "Project Manager",
        syntax: "cwm project [scan|add|remove|list]",
        summary: "Auto-detects codebases on your machine and manages the Jump database.",
        logic: `
            <p><strong>The Smart Scan Engine:</strong></p>
            <p>Instead of blindly scanning every file (which takes forever), CWM uses a targeted approach:</p>
            <ol>
                <li>It scans your <strong>User Home</strong> directory recursively.</li>
                <li>It ignores heavy system folders defined in <code>.cwmignore</code> (e.g., <code>node_modules</code>, <code>AppData</code>, <code>Downloads</code>). These defaults are OS-aware (Windows vs Linux).</li>
                <li>It looks for <strong>Markers</strong> defined in your config (default: <code>.git</code>, <code>.cwm</code>).</li>
                <li>Once a marker is found, it flags that folder as a Project and <strong>stops scanning deeper</strong> into that tree to prevent nested duplication.</li>
            </ol>
        `,
        flags: [
            { name: "scan", desc: "Runs the Smart Scan. Features a visual progress bar and interactive prompts." },
            { name: "add <path>", desc: "Manually add a folder. Prompts for alias if not provided." },
            { name: "remove", desc: "Interactive cleanup mode. Shows least-used projects first." }
        ]
    },
    "config": {
        title: "Configuration",
        syntax: "cwm config [flags]",
        summary: "Manage global settings, editors, and detection rules.",
        logic: `
            <p>Stores settings in <code>config.json</code> inside the Global Bank. CWM automatically migrates older configs to the newest version.</p>
            <p><strong>Settings Hierarchy:</strong> Global settings (Editors, Markers) are applied system-wide. Local settings (History Source) override globals only when inside a specific project.</p>
            <p><strong>Editor Configuration:</strong></p>
            <ul>
                <li><strong>Jupyter:</strong> <code>cwm config --editor "jupyter notebook"</code></li>
                <li><strong>PowerShell:</strong> <code>cwm config --editor "start powershell"</code></li>
            </ul>
        `,
        flags: [
            { name: "--editor <cmd>", desc: "Set default editor command (e.g., 'code', 'notepad', 'jupyter notebook')." },
            { name: "--add-marker <file>", desc: "Add a file to detect projects (e.g., 'go.mod', 'cargo.toml')." },
            { name: "--shell", desc: "Select history file manually from detected candidates." },
            { name: "--global", desc: "Target global config specifically." }
        ]
    },
    "save": {
        title: "Save Command",
        syntax: "cwm save [flags] [payload]",
        summary: "The Swiss Army knife of CWM. Handles local variables, raw commands, and the Smart Archive system.",
        logic: `
            <p>The <code>save</code> command operates on three distinct layers based on the flags provided:</p>
            <ol>
                <li><strong>Variable Mode (<code>var="cmd"</code>):</strong> Saves a command with a short alias. CWM checks for duplicates and prevents overwriting unless <code>-e</code> (edit) is used.</li>
                <li><strong>History Cache (<code>--hist</code>):</strong> Reads your shell's history file, filters out CWM's own commands, and appends new unique commands to <code>history.json</code>.</li>
                <li><strong>Smart Archive (<code>--archive</code>):</strong> Implements a <strong>"Fill & Spill" algorithm</strong>. It reads live history, deduplicates it, and fills an archive file up to 10,000 lines. Once full, it spills over to a new archive file.</li>
            </ol>
        `,
        flags: [
            { name: "var=\"cmd\"", desc: "Saves a variable. Example: <code>cwm save build=\"npm run build\"</code>" },
            { name: "-e", desc: "Edit mode. Required to change an existing variable." },
            { name: "-b <var>", desc: "Save 'Before'. Grabs the last command run in terminal." },
            { name: "--archive", desc: "Triggers the Smart Archive process (Live History -> Static File)." }
        ]
    },
    "get": {
        title: "Get Command",
        syntax: "cwm get [name|id] [flags]",
        summary: "Retrieves commands from Local Bank, Global Bank, or Live History.",
        logic: `
            <p><code>cwm get</code> first looks for a <strong>Local Bank</strong>. If none is found, it defaults to the <strong>Global Bank</strong>.</p>
            <p><strong>Filtering Logic:</strong></p>
            <ul>
                <li><strong>History Mode (<code>--hist</code>):</strong> Reads raw shell history, reverses it (newest first), and applies filters (<code>-ex</code>, <code>-f</code>).</li>
                <li><strong>Archive Mode (<code>--arch</code>):</strong> Reads from static text files generated by the save command.</li>
            </ul>
        `,
        flags: [
            { name: "--id <n>", desc: "Fetch command by ID." },
            { name: "-s", desc: "Show only (no clipboard copy)." },
            { name: "--hist", desc: "Search Live Shell History." },
            { name: "--cached", desc: "Search CWM's history.json cache." }
        ]
    },
    "copy": {
        title: "Copy (Context Packer)",
        syntax: "cwm copy [flags] [ids]",
        summary: "Scans your project and packs code for AI/LLMs.",
        logic: `
            <p>Uses a custom <code>FileMapper</code> engine designed for LLM context windows.</p>
            <ul>
                <li><strong>Smart Ignore:</strong> Automatically detects project type (Python, Node, Flutter) and generates a <code>.cwmignore</code>.</li>
                <li><strong>Condense Mode:</strong> Removes comments (<code>//</code>, <code>#</code>) and excessive whitespace to save tokens without breaking logic.</li>
                <li><strong>Tree Mode:</strong> Generates a clean ASCII representation of your project structure.</li>
            </ul>
        `,
        flags: [
            { name: "--tree", desc: "Copy visual directory tree only." },
            { name: "--condense", desc: "Minify code content." },
            { name: "--init", desc: "Generate config files." }
        ]
    },
    "watch": {
        title: "Watch Session",
        syntax: "cwm watch [start|stop|status]",
        summary: "Track a specific segment of work without background processes.",
        logic: `
            <p>CWM Watch does not run a background daemon. It simply records the <strong>Line Number</strong> of your history file when you run <code>start</code>.</p>
            <p>When you run <code>stop</code>, it grabs every line after that start index. This makes it lightweight and completely crash-proof.</p>
        `,
        flags: [
            { name: "start", desc: "Mark current history line." },
            { name: "stop --save", desc: "Save captured commands to history cache." }
        ]
    },
    "backup": {
        title: "Backup System",
        syntax: "cwm backup [list|show|merge]",
        summary: "Versioning system for saved commands.",
        logic: `
            <p>Backups are created automatically on every save in <code>.cwm/data/backup/</code>.</p>
            <p><strong>Auto-Versioning:</strong> CWM keeps the last 10 versions of your <code>saved_cmds.json</code> file.</p>
            <p><strong>Smart Merge:</strong> The merge command detects duplicates and prompts for conflicts. It supports chain-merging multiple backups at once by passing IDs (e.g. <code>1,2,3</code>).</p>
        `,
        flags: [
            { name: "list", desc: "Show available backups." },
            { name: "show <id>", desc: "View the contents of a backup." },
            { name: "merge [ids]", desc: "Merge backup(s) into current data. Supports comma-separated IDs." }
        ]
    },
    "hello": {
        title: "Hello & Info",
        syntax: "cwm hello",
        summary: "System diagnostics command.",
        logic: "<p>Detects OS (Windows/Linux/Mac) and identifies the active Shell History file path. Useful for debugging if CWM isn't finding your history.</p>",
        flags: []
    },
    "init": {
        title: "Initialize",
        syntax: "cwm init",
        summary: "Creates a Local Bank.",
        logic: "<p>Creates <code>.cwm/</code> folder structure in current directory. Prevents creation if you are already inside a CWM bank (nested banks are not allowed).</p>",
        flags: []
    },
    "setup": {
        title: "Shell Setup",
        syntax: "cwm setup",
        summary: "Hooks CWM into Bash/Zsh (Linux/Mac/GitBash).",
        logic: "<p>Appends <code>history -a</code> to <code>.bashrc</code> via <code>PROMPT_COMMAND</code>. This forces the shell to write history to disk instantly, allowing CWM to see commands in real-time.</p>",
        flags: [{name: "--force", desc: "Manual shell selection (Bash/Zsh/PowerShell)."}]
    },
    "bank": {
        title: "Bank Manager",
        syntax: "cwm bank [info|delete]",
        summary: "Manage storage locations.",
        logic: "<p>Displays paths for Local (Project) and Global (AppData/roaming/cwm) banks. Use delete with caution as it wipes data.</p>",
        flags: [
            { name: "info", desc: "Show current bank paths." },
            { name: "delete --local", desc: "Delete the current project's .cwm bank." },
            { name: "delete --global", desc: "Delete the global cwm bank." }
        ]
    },
    "clear": {
        title: "Clear Data",
        syntax: "cwm clear [flags]",
        summary: "Prune data.",
        logic: "<p>Can target Saved Commands OR History Cache. <strong>Re-indexing:</strong> After clearing, IDs are recalculated (e.g., if you delete ID 2, ID 3 becomes ID 2).</p>",
        flags: [
            {name: "-n <count>", desc: "Clear oldest N items."},
            {name: "--saved", desc: "Target saved commands."},
            {name: "--hist", desc: "Target history cache."}
        ]
    },
    "git": {
        title: "Git Account Manager",
        syntax: "cwm git [add|list|setup]",
        summary: "Manage multiple GitHub accounts and automate repo setup.",
        logic: `
            <p><strong>SSH Management:</strong> Generates secure ED25519 keys and modifies <code>~/.ssh/config</code> to handle aliases (e.g., <code>git@github.com-work</code>).</p>
            <p><strong>Repo Automation (setup):</strong></p>
            <ul>
                <li>Detects OS and sets <code>core.autocrlf</code> to prevent line-ending warnings.</li>
                <li>Detects project type (Node, Python, etc.) and auto-generates a <code>.gitignore</code>.</li>
                <li>Rewrites the remote URL to use the correct SSH Identity.</li>
                <li><strong>Auto-Push:</strong> Can optionally perform the full <code>git add .</code> -> <code>git commit</code> -> <code>git push</code> workflow for you.</li>
            </ul>
        `,
        flags: [
            { name: "add", desc: "Wizard: Generates SSH key, adds to config, and copies public key to clipboard." },
            { name: "list", desc: "Displays all CWM-managed accounts." },
            { name: "setup", desc: "Links folder to an account, creates .gitignore, and pushes initial code." }
        ]
    }
};