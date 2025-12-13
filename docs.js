const cwmDocs = {
    "jump": {
    "title": "Jump (Project Teleporter)",
    "syntax": "cwm jump [name|id] [flags]",
    "summary": "Instantly open your projects in VS Code, Terminal, or your preferred editor without navigating folders.",
    "logic": `
        <p>The <code>jump</code> command uses a <strong>Detached Process</strong> model. Unlike aliases that change your current directory, CWM spawns a new independent window for your project.</p>
        <p><strong>Key Features:</strong></p>
        <ul>
            <li><strong>Smart Launch:</strong> Opens your configured editor (e.g., VS Code, PyCharm). If no editor is set, it falls back to the system terminal automatically.</li>
            <li><strong>Fuzzy Matching:</strong> You don't need the exact name. If you have a project <code>my-awesome-api</code>, typing <code>cwm jump api</code> will find it.</li>
            <li><strong>Usage Ranking:</strong> CWM tracks "Hits". Frequently accessed projects bubble to the top of the list automatically.</li>
            <li><strong>Bulk Open:</strong> You can open multiple projects at once using comma separators (e.g., <code>cwm jump 1,3</code>).</li>
        </ul>
        <p><strong>Supported Terminals (for -t flag):</strong></p>
        <ul>
            <li><strong>Windows:</strong> Windows Terminal (wt), PowerShell</li>
            <li><strong>Mac:</strong> iTerm, Terminal.app</li>
            <li><strong>Linux:</strong> GNOME, Konsole, XFCE, Terminator, Alacritty</li>
        </ul>
    `,
    "flags": [
        { 
            "name": "[name|id]", 
            "desc": "The project Alias, ID, or a comma-separated list (e.g., <code>api</code> or <code>1,2</code>). If omitted, opens interactive mode." 
        },
        { 
            "name": "-t, --terminal", 
            "desc": "Also open a new detached terminal window at the project path alongside the editor." 
        },
        { 
            "name": "-l, --list", 
            "desc": "Force the table view to display projects, even if a name is provided." 
        },
        { 
            "name": "-n <count>", 
            "desc": "Limit the number of projects displayed in the list (default: 10). Use <code>-n all</code> to see everything." 
        }
    ]
},
    "project": {
    title: "Project (Workspace Manager)",
    syntax: "cwm project <subcommand> [flags]",
    summary: "Manage your project database: Scan for new projects, configure startup automation, or edit existing entries.",
    logic: `
        <p>The <code>project</code> command is the central database manager for CWM. It handles how your CLI knows where your code lives.</p>
        <p><strong>Key Capabilities:</strong></p>
        <ul>
            <li><strong>Auto-Discovery (Scan):</strong> Instead of adding paths manually, CWM can crawl your home or work directory to find projects. It is interactive—you can "Add", "Skip", or permanently "Ignore" folders.</li>
            <li><strong>Startup Automation:</strong> You can attach commands to a project (e.g., <code>npm run dev</code>, <code>source venv/bin/activate</code>). These are sanitized for security (blocking unsafe commands like <code>rm</code>).</li>
            <li><strong>Smart ID Management:</strong> When you <code>remove</code> a project, CWM automatically <strong>re-indexes</strong> the remaining project IDs to close the gap (e.g., if you remove ID 2, ID 3 becomes 2).</li>
        </ul>
       
    `,
    subcommands: [
        { 
            name: "scan", 
            desc: "Recursively scan a directory to auto-discover projects." 
        },
        { 
            name: "add <path>", 
            desc: "Manually register a specific folder as a project." 
        },
        { 
            name: "list", 
            desc: "Display the full database table of projects, groups, and hit counts." 
        },
        { 
            name: "edit", 
            desc: "Modify a project's alias, path, or startup commands." 
        },
        { 
            name: "remove [id]", 
            desc: "Delete a project from the database. If ID is omitted, opens an interactive selection list." 
        }
    ],
    flags: [
        { 
            name: "--root <path>", 
            desc: "<strong>(scan only)</strong> Start the auto-discovery from a specific folder instead of User Home." 
        },
        { 
            name: "-n, --name <alias>", 
            desc: "Set the project alias (used with <code>add</code> or <code>edit</code>)." 
        },
        { 
            name: "-s, --startup <cmd>", 
            desc: "Define startup commands (used with <code>add</code>)." 
        },
        { 
            name: "-p, --path <dir>", 
            desc: "Update the filesystem path for an existing project (used with <code>edit</code>)." 
        },
        { 
            name: "-a / -r <cmd>", 
            desc: "<strong>Add / Remove:</strong> Append or delete specific startup commands without rewriting the whole list (used with <code>edit</code>)." 
        },
        { 
            name: "-n <count>", 
            desc: "Limit the number of items displayed in lists (default: 10)." 
        }
    ]
},
    "config": {
    title: "Config (Settings & Setup)",
    syntax: "cwm config [flags]",
    summary: "Central dashboard for customizing CWM behavior, AI keys, default editors, and history sources.",
    logic: `
        <p>The <code>config</code> command manages the global settings file stored in your Local Bank. It handles three main areas:</p>
        <ul>
            <li><strong>Environment:</strong> Tells CWM which Editor to use (e.g., VS Code, Vim) and where to read your shell history from.</li>
            <li><strong>AI Integration:</strong> Interactive wizards to securely store API keys for Gemini, OpenAI, or Local models (Ollama).</li>
            <li><strong>Project Detection:</strong> Customizes the "Markers" used by the <code>scan</code> command (e.g., you can add <code>go.mod</code> or <code>cargo.toml</code> to detect specific project types).</li>
        </ul>
        <p><strong>Smart Features:</strong></p>
        <ul>
            <li><strong>File-Based Instructions:</strong> When setting the AI System Instruction (<code>--instruction</code>), you can pass a direct string <em>OR</em> a file path (e.g., <code>C:/prompts/coder.txt</code>). CWM detects the file and uses its content.</li>
            <li><strong>History Auto-Detect:</strong> The <code>--shell</code> flag scans your system for valid history files (Zsh, Bash, PowerShell) and lets you select the active source via a menu.</li>
        </ul>
    `,
    flags: [
        { name: "--show", desc: "Display the current configuration status (Editor, Active AI, Markers)." },
        { name: "--editor <cmd>", desc: "Set the command used to open projects (e.g., <code>code</code>, <code>nvim</code>, <code>subl</code>)." },
        { name: "--shell", desc: "Open an interactive menu to select your Shell History source file." },
        { name: "--gemini | --openai | --local-ai", desc: "Launch an interactive wizard to configure specific AI providers and models." },
        { name: "--instruction", desc: "Set the System Prompt for AI. accepts text or a file path." },
        { name: "--add-marker <file>", desc: "Add a new filename marker for project scanning (e.g., <code>requirements.txt</code>)." },
        { name: "--code-theme <name>", desc: "Change the syntax highlighting theme for code snippets (default: monokai)." },
        { name: "--clear-config", desc: "Reset all configuration to defaults." }
    ]
},
    "save": {
    title: "Save (Command Vault)",
    syntax: "cwm save [flags] [payload]",
    summary: "Save complex commands as variables, capture your last run command, or archive your entire shell history.",
    logic: `
        <p>The <code>save</code> command turns your terminal into a permanent knowledge base. It handles three types of data:</p>
        <ul>
            <li><strong>Variables:</strong> Save commands with a nickname (e.g., <code>deploy=npm run build && docker push</code>). You can run these later using <code>cwm get deploy</code>.</li>
            <li><strong>Raw Commands:</strong> If you just paste a command without a name, CWM saves it as a "Raw Entry" with a unique ID.</li>
            <li><strong>History Capture:</strong> The <code>-b</code> (Back) flag is a lifesaver. It grabs the <em>last command you executed</em> in your terminal (ignoring CWM commands) and saves it instantly.</li>
        </ul>
        <p><strong>Editing Mode:</strong></p>
        <p>You can modify saved items without opening a config file using the <code>-e</code> (edit value) or <code>-ev</code> (rename variable) flags.</p>
    `,
    flags: [
        { 
            name: "key=value", 
            desc: "Standard usage. Saves 'value' under the alias 'key' (e.g., <code>cwm save test='pytest -vv'</code>)." 
        },
        { 
            name: "-b <name>", 
            desc: "<strong>Back Capture:</strong> Grabs the immediate last command from your shell history and saves it as <code>name</code>." 
        },
        { 
            name: "--hist", 
            desc: "<strong>History Sync:</strong> Archives your shell history into CWM's local database for permanent storage." 
        },
        { 
            name: "-n <count>", 
            desc: "Used with <code>--hist</code>. Limits how many recent history lines to sync (default: all)." 
        },
        { 
            name: "-e <key=new_val>", 
            desc: "<strong>Edit Value:</strong> Updates the command string for an existing variable." 
        },
        { 
            name: "-ev <old> <new>", 
            desc: "<strong>Edit Variable:</strong> Renames a variable key (e.g., rename 'test' to 'test-unit')." 
        },
        { 
            name: "-l", 
            desc: "List all currently saved variables and raw commands." 
        }
    ]
},
    "get": {
    title: "Get (Retrieve & Search)",
    syntax: "cwm get [name|id] [flags]",
    summary: "Retrieve saved commands or search through your shell history with powerful filters. Copies results to clipboard automatically.",
    logic: `
        <p>The <code>get</code> command is your retrieval engine. It operates in two modes:</p>
        <ul>
            <li><strong>Direct Fetch:</strong> If you provide a Name or ID (e.g., <code>cwm get deploy</code>), it finds the command and <strong>immediately copies it</strong> to your clipboard.</li>
            <li><strong>Search Mode:</strong> If you use history flags (<code>--hist</code> or <code>--active</code>), it opens a searchable table of your past commands. You can select an ID from the list to copy it.</li>
        </ul>
        <p><strong>Power Filters:</strong></p>
        <p>You can pipe your history through filters without using grep. For example, <code>cwm get --hist -f "docker,build" -ex "fail"</code> will find commands containing "docker" AND "build" but NOT "fail".</p>
    `,
    flags: [
        { 
            name: "[name|id]", 
            desc: "The variable alias or database ID to retrieve. Defaults to 'Search Mode' if omitted." 
        },
        { 
            name: "-s, --show", 
            desc: "Print the command to the terminal standard output instead of copying it to the clipboard." 
        },
        { 
            name: "-h, --hist", 
            desc: "<strong>System History:</strong> Search through your global shell history (Bash/Zsh/PowerShell)." 
        },
        { 
            name: "-a, --active", 
            desc: "<strong>Project History:</strong> Search the local history file stored in the current project's <code>.cwm</code> bank." 
        },
        { 
            name: "-f <text>", 
            desc: "<strong>Filter (Include):</strong> Comma-separated text to search for (e.g., <code>git,commit</code>)." 
        },
        { 
            name: "-ex <text>", 
            desc: "<strong>Exclude:</strong> Comma-separated text to hide from results (e.g., <code>error,temp</code>)." 
        },
        { 
            name: "-n <count>", 
            desc: "Limit the number of results shown (default: 10). Use <code>all</code> for everything." 
        }
    ]
},
   "copy": {
    title: "Copy (Context Packer)",
    syntax: "cwm copy [ids] [flags]",
    summary: "Pack your project files and folders into a single clipboard payload, optimized for pasting into AI Chatbots (Gemini, ChatGPT).",
    logic: `
        <p>The <code>copy</code> command is the ultimate tool for "Context Injection." It scans your project and assigns a unique <strong>ID</strong> to every file and folder.</p>
        <p><strong>Workflow:</strong></p>
        <ol>
            <li><strong>Scan:</strong> Run <code>cwm copy</code> to see a visual tree of your project.</li>
            <li><strong>Select:</strong> Enter the IDs of the files you want (e.g., <code>1,4,10</code>). You can also select a <strong>Folder ID</strong> to automatically include all files inside it.</li>
            <li><strong>Paste:</strong> CWM bundles the file paths and their contents into your clipboard, ready to be pasted into an AI prompt.</li>
        </ol>
        <p><strong>Token Optimization:</strong></p>
        <p>To save context window space, you can use <code>--condense</code> (removes whitespace/newlines) or <code>--format</code> (removes comments and standardizes code).</p>
        <p><strong>Configuration:</strong></p>
        <p>Run <code>--init</code> first to create a <code>.cwmignore</code> file. This works exactly like <code>.gitignore</code>, letting you hide <code>node_modules</code>, <code>venv</code>, or secrets from the scan.</p>
    `,
    flags: [
        { 
            name: "[ids]", 
            desc: "Skip the interactive menu and immediately copy specific file IDs (e.g., <code>cwm copy 1,2,5</code>)." 
        },
        { 
            name: "--init", 
            desc: "Initialize the <code>.cwmignore</code> and <code>.cwminclude</code> configuration files in the current folder." 
        },
        { 
            name: "--tree", 
            desc: "Copy <strong>only</strong> the project file tree structure to the clipboard (useful for explaining architecture to AI)." 
        },
        { 
            name: "--condense", 
            desc: "<strong>Minify Mode:</strong> Removes comments and extra whitespace from code to save LLM tokens." 
        },
        { 
            name: "--format", 
            desc: "<strong>Clean Mode:</strong> auto-formats code (e.g., autopep8) and strips comments before copying." 
        },
        { 
            name: "-f <text>", 
            desc: "Filter the interactive tree view to only show matching files/folders." 
        }
    ]
},
    "watch": {
    title: "Watch (Project Monitoring)",
    syntax: "cwm watch <command>",
    summary: "Start or stop local, project-specific history recording by injecting a temporary shell hook.",
    logic: `
        <p>The <code>watch</code> command enables per-project history monitoring. Instead of logging all your shell activity globally, CWM creates a temporary 'hook' in your current shell profile (like <code>.bashrc</code> or <code>$PROFILE</code>) that directs all commands run in that session to the local project history file (<code>.cwm/project_history.txt</code>).</p>
        <p>This is crucial for isolating project context: the commands you run for 'Project A' will not mix with the commands for 'Project B'.</p>
        <p><strong>Mechanism:</strong></p>
        <ul>
            <li><strong>Start:</strong> CWM detects your shell (Bash, Zsh, PowerShell) and generates a small script (the hook) inside your <code>.cwm/</code> folder. It then appends a <code>source</code> or <code>.</code> command to your shell's profile to load this hook, starting the monitoring.</li>
            <li><strong>Stop:</strong> CWM removes the reference to the hook from your profile and deletes the local hook script, ensuring a clean system reset.</li>
        </ul>
    `,
    subcommands: [
        {
            name: "start",
            desc: "Begins the watch session. Injects a shell hook and copies the terminal reload command to your clipboard."
        },
        {
            name: "stop",
            desc: "Ends the watch session. Removes the hook from your shell profile and deletes the local script file."
        },
        {
            name: "status",
            desc: "Displays the current status of the watch session (Active/Inactive, Shell Type, Hook location)."
        }
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
    title: "Setup (Shell Integration)",
    syntax: "cwm setup [flags]",
    summary: "Auto-configure your shell environment (Bash, Zsh, PowerShell) for instant history syncing and deduplication.",
    logic: `
        <p>The <code>setup</code> command is a "set it and forget it" utility that optimizes your terminal for CWM. It appends a small configuration block to your shell profile (e.g., <code>.bashrc</code>, <code>.zshrc</code>, or PowerShell Profile).</p>
        <p><strong>What it does:</strong></p>
        <ul>
            <li><strong>Instant Sync:</strong> Forces your shell to write commands to the history file <em>immediately</em> after execution (instead of waiting for the session to close). This allows CWM to see your latest commands instantly.</li>
            <li><strong>Deduplication:</strong> Configures your shell to ignore duplicate commands (e.g., running <code>ls</code> twice only saves it once), keeping your history clean.</li>
            <li><strong>Space Ignoring:</strong> Ensures commands starting with a space are not saved (useful for secrets).</li>
        </ul>
        <p><strong>Supported Shells:</strong></p>
        <ul>
            <li><strong>Bash:</strong> Adds <code>PROMPT_COMMAND</code> hooks for instant writing.</li>
            <li><strong>Zsh:</strong> Enables <code>INC_APPEND_HISTORY</code> and <code>HIST_IGNORE_ALL_DUPS</code>.</li>
            <li><strong>PowerShell:</strong> Sets <code>HistorySaveStyle</code> to Incrementally and enables <code>HistoryNoDuplicates</code>.</li>
        </ul>
    `,
    flags: [
        { 
            name: "(no flags)", 
            desc: "<strong>Auto-Detect Mode:</strong> Scans your OS and environment variables to automatically find and configure the active shell." 
        },
        { 
            name: "--force", 
            desc: "<strong>Manual Mode:</strong> Opens an interactive menu to force-install configuration for a specific shell (useful if auto-detection fails or for multi-shell setups)." 
        }
    ]
},
    "bank": {
    title: "Bank (Storage Locations)",
    syntax: "cwm bank <subcommand> [flags]",
    summary: "Manage the physical storage folders where CWM keeps your history, configuration, and project data.",
    logic: `
        <p>CWM uses a <strong>Dual-Bank Architecture</strong> to organize your data:</p>
        <ul>
            <li><strong>Global Bank:</strong> Located in your user home (usually <code>~/.cwm</code>). This stores your global settings, saved variables, and the master project database.</li>
            <li><strong>Local Bank:</strong> Located inside a specific project folder (<code>./.cwm</code>). This stores <strong>project-specific history</strong> (from <code>cwm watch</code>) and temporary session data.</li>
        </ul>
        <p>The <code>bank</code> command lets you inspect these paths to verify "Active Context" (am I in a project?) or delete them to reset data.</p>
        <p><strong>Safety:</strong> The <code>delete</code> command includes a confirmation prompt to prevent accidental data loss.</p>
    `,
    subcommands: [
        {
            name: "info",
            desc: "Display the absolute paths of the Global Bank and the current Local Bank (if detected). Shows which bank is the <strong>Active Context</strong>."
        },
        {
            name: "delete --local",
            desc: "<strong>Reset Project:</strong> Deletes the <code>.cwm</code> folder in the current directory, clearing project history and watch sessions."
        },
        {
            name: "delete --global",
            desc: "<strong>Factory Reset:</strong> Deletes the main <code>~/.cwm</code> folder, removing ALL configuration, saved commands, and project registries."
        }
    ]
},
   "clear": {
    title: "Clear (Data & History)",
    syntax: "cwm clear [flags]",
    summary: "Remove saved commands or clean up your shell history files (deduplicate, remove invalid commands).",
    logic: `
        <p>The <code>clear</code> command is your maintenance tool. It operates in two main areas:</p>
        <ul>
            <li><strong>Saved Commands:</strong> Deletes variables or raw commands from your CWM vault. You can use an <strong>Interactive Wizard</strong> (visual selection) or Direct Flags (ID/Name).</li>
            <li><strong>History Cleaning:</strong> A powerful utility to optimize your shell history files (<code>.bash_history</code>, <code>.zsh_history</code>). It removes duplicates, filters out sensitive commands, and deletes broken entries.</li>
        </ul>
        <p><strong>Safe Cleaning Workflow:</strong></p>
        <p>When cleaning history, CWM is <strong>non-destructive by default</strong>. It creates a "Preview" file first. You must run with <code>--apply</code> to commit changes. If something goes wrong, <code>--undo</code> instantly restores the backup.</p>
    `,
    flags: [
        { 
            name: "--saved", 
            desc: "<strong>Wizard Mode:</strong> Opens an interactive table to select and delete saved commands." 
        },
        { 
            name: "-id <id> | -v <name>", 
            desc: "<strong>Direct Delete:</strong> Used with <code>--saved</code> to delete specific items without the menu (e.g., <code>--saved -v 'deploy'</code>)." 
        },
        { 
            name: "--sys-hist", 
            desc: "Target the <strong>System Shell History</strong> file for cleaning." 
        },
        { 
            name: "--loc-hist", 
            desc: "Target the <strong>Local Project History</strong> file for cleaning." 
        },
        { 
            name: "--remove-invalid", 
            desc: "<strong>Filter:</strong> Detects and removes seemingly broken or corrupted characters from the history file." 
        },
        { 
            name: "-f <text>", 
            desc: "<strong>Filter:</strong> Removes specific commands containing this text (useful for cleaning secrets like 'apikey')." 
        },
        { 
            name: "--apply", 
            desc: "<strong>Commit:</strong> Overwrites the actual history file with the cleaned version." 
        },
        { 
            name: "--undo", 
            desc: "<strong>Restore:</strong> Reverts the last cleaning operation using the automatic backup file." 
        }
    ]
},
    "git": {
    title: "Git (Multi-Account Manager)",
    syntax: "cwm git <subcommand>",
    summary: "Seamlessly manage multiple GitHub accounts (Work/Personal) on one machine using SSH aliases, and automate repository initialization.",
    logic: `
        <p>The <code>git</code> command solves the headache of "Permission Denied (publickey)" errors when switching between personal and work accounts.</p>
        <p><strong>How it works:</strong></p>
        <ul>
            <li><strong>SSH Aliasing:</strong> CWM generates unique SSH keys for each account and writes specific "Host" entries to your <code>~/.ssh/config</code>.</li>
            <li><strong>Smart URL Rewriting:</strong> When you run <code>cwm git setup</code>, CWM takes a standard URL (e.g., <code>git@github.com:user/repo.git</code>) and automatically rewrites it to use your specific key (e.g., <code>git@<strong>work-alias</strong>:user/repo.git</code>).</li>
            <li><strong>Zero-Conflict Config:</strong> It configures <code>user.name</code> and <code>user.email</code> locally for <em>that specific repository</em>, ensuring you never accidentally commit work code with your personal email.</li>
        </ul>
        <p><strong>Automation:</strong> The <code>setup</code> command also detects your project type (Python, Node, etc.) to automatically generate the correct <code>.gitignore</code> file.</p>
    `,
    subcommands: [
        {
            name: "add",
            desc: "<strong>Account Wizard:</strong> Interactive prompt to generate a new SSH Key pair, ask for your email, and add a secure entry to your SSH Config."
        },
        {
            name: "setup",
            desc: "<strong>Repo Initializer:</strong> The 'Magic Button' for new projects. It performs <code>git init</code>, sets local config, generates <code>.gitignore</code>, rewrites the Remote URL to use your SSH alias, and pushes the initial commit."
        },
        {
            name: "list",
            desc: "Show all SSH accounts currently managed by CWM, including their Host aliases and key paths."
        },
        {
            name: "remove",
            desc: "Permanently delete an account's SSH keys and remove its entry from the configuration file."
        }
    ]
},
"run": {
    title: "Run (Process Orchestrator)",
    syntax: "cwm run <subcommand> [flags]",
    summary: "A built-in process manager to run projects, groups, and scripts in the background or in detached terminal windows.",
    logic: `
        <p>The <code>run</code> command transforms CWM from a passive database into an active <strong>Process Orchestrator</strong>. It manages the lifecycle of your applications.</p>
        <p><strong>Two Execution Modes:</strong></p>
        <ul>
            <li><strong>Background Mode (Default):</strong> Runs the project silently as a detached process. Logs are captured to files (viewable via <code>cwm run logs</code>). Perfect for APIs, databases, or background workers.</li>
            <li><strong>Interactive Mode (<code>-x</code>):</strong> Spawns a <strong>new, visible terminal window</strong> for the project. CWM handles the complex OS-specific logic to launch PowerShell (Windows), Terminal.app (Mac), or GNOME/Konsole (Linux) automatically.</li>
        </ul>
        <p><strong>Smart Features:</strong></p>
        <ul>
            <li><strong>Variable Injection:</strong> Automatically replaces <code>$ROOT</code> in your startup commands with the actual project path.</li>
            <li><strong>Orchestrator Dashboard:</strong> Keeps track of PIDs, uptime, and status. You can even launch a visual GUI dashboard using <code>cwm run gui</code>.</li>
        </ul>
    `,
    subcommands: [
        {
            name: "project <id>",
            desc: "Run a specific project. Use <code>-x</code> to launch it in a new visible window instead of the background."
        },
        {
            name: "group <id>",
            desc: "<strong>Bulk Launch:</strong> Start an entire group of projects at once (e.g., Frontend + Backend + DB). Supports <code>-x</code> to open multiple windows instantly."
        },
        {
            name: "list",
            desc: "Show the <strong>Orchestrator Table</strong>: A live list of all running services, their PIDs, status, and uptime."
        },
        {
            name: "stop <id>",
            desc: "Gracefully stop a running background service. Use <code>--all</code> to stop everything."
        },
        {
            name: "remove <id>",
            desc: "Remove the file from the run tracker."
        },
        {
            name: "logs <id>",
            desc: "View the output of a background process. Use <code>-f</code> (follow) to stream logs in real-time like <code>tail -f</code>."
        },
        {
            name: "launch <id>",
            desc: "<strong>Streamer:</strong> Opens a new terminal window that automatically streams the logs of an existing background process."
        },
        {
            name: "gui",
            desc: "Launches the standalone <strong>Visual Dashboard</strong> (Tkinter) to manage processes with mouse controls."
        },
        {
            name: "kill",
            desc: "<strong>Emergency:</strong> Forcefully terminates ALL CWM-managed processes immediately."
        }
    ]
},
"group": {
    title: "Group (Batch Manager)",
    syntax: "cwm group <subcommand> [flags]",
    summary: "Organize projects into logical groups (e.g., 'work', 'frontend') to perform bulk actions like starting multiple apps at once.",
    logic: `
        <p>The <code>group</code> command allows you to bundle multiple projects together. This is the foundation for the <strong>Orchestrator</strong> feature: instead of running projects one by one, you can simply run <code>cwm run group work</code> to launch your API, database, and frontend simultaneously.</p>
        <p><strong>Smart Editing:</strong></p>
        <p>The <code>edit</code> command supports advanced "Patch Logic". When modifying a group, you don't need to re-type every ID. You can use:</p>
        <ul>
            <li><code>+7</code> to ADD project #7 to the existing list.</li>
            <li><code>-3</code> to REMOVE project #3 from the list.</li>
            <li><code>1,2,5</code> to REPLACE the entire list.</li>
        </ul>
        <p><strong>Auto-Linking:</strong></p>
        <p>When you add projects to a group, CWM automatically updates the project's metadata to reflect this relationship, making it visible in the <code>project list</code> view.</p>
    `,
    subcommands: [
        {
            name: "add",
            desc: "<strong>Interactive Wizard:</strong> Opens a paginated list of all your projects. Select multiple IDs to create a new group instantly."
        },
        {
            name: "list",
            desc: "Show all existing groups, their ID, name, and a preview of the projects inside them."
        },
        {
            name: "edit -id <id>",
            desc: "<strong>Modifier:</strong> Change a group's name or member list. Supports 'Patch Mode' (e.g., <code>+5,-2</code>) for quick updates."
        },
        {
            name: "delete <id>",
            desc: "Remove a group definition. (Note: This does NOT delete the actual projects inside it, only the grouping)."
        }
    ]
},
"ask": {
    title: "Ask (AI Assistant)",
    syntax: "cwm ask <provider> [flags]",
    summary: "Launch a fully-featured AI chat session right in your terminal. Supports Google Gemini, OpenAI, and Local Models (via Ollama).",
    logic: `
        <p>The <code>ask</code> command turns your terminal into a coding assistant. It features a rich, syntax-highlighted UI with markdown support.</p>
        <p><strong>Key Features:</strong></p>
        <ul>
            <li><strong>Universal Interface:</strong> Use the same commands and shortcuts regardless of whether you are talking to GPT-4, Gemini 1.5, or a local Llama 3 model.</li>
            <li><strong>Smart Context (Instructions):</strong> CWM automatically resolves the "System Prompt" in this order of priority:
                <ol>
                    <li><code>instruction.txt</code> in the current folder (Project-specific rules).</li>
                    <li>Global Config path (e.g., <code>~/.cwm_prompts/coder.txt</code>).</li>
                    <li>Global Config string.</li>
                    <li>Default CWM Persona.</li>
                </ol>
            </li>
            <li><strong>Interactive Session:</strong> Includes slash commands like <code>/copy &lt;id&gt;</code> (to copy code blocks), <code>/hist</code> (view session history), and <code>@paste</code> (multiline input mode).</li>
        </ul>
        <p><strong>Code-First Design:</strong></p>
        <p>The UI is designed for developers. Code blocks are automatically formatted with syntax highlighting (Monokai default) and can be extracted with a single ID (e.g., <code>/copy 1</code>).</p>
    `,
    subcommands: [
        {
            name: "gemini",
            desc: "Start a chat session using Google's Gemini models. Requires API key in config."
        },
        {
            name: "openai",
            desc: "Start a chat session using OpenAI (GPT-4/3.5). Requires API key in config."
        },
        {
            name: "local",
            desc: "Start an offline chat session using Ollama. Perfect for privacy or when working without internet."
        }
    ],
    flags: [
        {
            name: "-s, --single <prompt>",
            desc: "<strong>One-Shot Mode:</strong> Send a single prompt, get the response, and exit immediately (useful for piping output)."
        }
    ]
},
};