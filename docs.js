const cwmDocs = {
    "hello": {
        title: "Hello (System Diagnostics)",
        syntax: "cwm hello",
        summary: "Displays welcome message, CWM version, current OS/Architecture, active shell history path, and synchronization alerts.",
        logic: `
            <p>The <code>hello</code> command is your primary tool for system diagnostics. It runs a series of quick validation checks on the running environment:</p>
            <ul>
                <li><strong>System Info:</strong> Shows current Operating System (Windows, Linux, macOS) and architecture details.</li>
                <li><strong>Active History File:</strong> Displays the path to the shell history file CWM is reading from. Useful if custom paths are misconfigured.</li>
                <li><strong>Real-time Sync Alert:</strong> Notifies you if instant shell synchronization isn't configured in the environment profile.</li>
            </ul>
        `,
        flags: []
    },
    "setup": {
        title: "Setup (Shell Integration)",
        syntax: "cwm setup [flags]",
        summary: "Auto-configure shell profiles (Bash, Zsh, PowerShell) for instant command history synchronization.",
        logic: `
            <p>The <code>setup</code> command is a "set-and-forget" utility that hooks into your system terminal to enable instant history recording.</p>
            <p><strong>What it configures:</strong></p>
            <ul>
                <li><strong>Instant Write:</strong> Forces terminal shell sessions to append executed commands directly to your history file on disk after every single execution, instead of waiting for the session to close.</li>
                <li><strong>Deduplication:</strong> Configures your shell profile to discard consecutive duplicate commands to prevent log bloating.</li>
            </ul>
        `,
        flags: [
            { name: "--force", desc: "Open manual interactive menu to select shell choice if auto-detection fails." }
        ]
    },
    "save": {
        title: "Save (Command Vault)",
        syntax: "cwm save [flags] [-t tag] [variable=command]",
        summary: "Save shell command strings under variable names with optional tags.",
        logic: `
            <p>The <code>save</code> command acts as a vault for complex commands. It supports saving multiple aliases at once and tags for organization.</p>
            <p><strong>Conflict Protection:</strong></p>
            <p>To prevent accidental overwrites, saving an already existing variable name will result in an error. You must explicitly request edit mode or rename mode.</p>
        `,
        flags: [
            { name: "var='cmd'", desc: "Standard format. Nickname variable to run command." },
            { name: "-t, --tag <name>", desc: "<strong>Tag:</strong> Assign a category/tag to the saved command(s). Can switch tags between multiple commands (e.g. <code>cwm save -t system disk_check='df -h' -t debug test='pytest'</code>)." },
            { name: "-e", desc: "<strong>Edit Mode:</strong> Force update of an already existing variable name with a new command string." },
            { name: "-ev <old> <new>", desc: "<strong>Rename Mode:</strong> Rename an existing variable key to a new one." }
        ]
    },
    "get": {
        title: "Get (Search & Clipboard)",
        syntax: "cwm get [name] [flags]",
        summary: "Retrieve saved variables, search global shell histories, or read from your shared copy bank.",
        logic: `
            <p>The <code>get</code> command is your primary search engine. When a name is matched, CWM automatically copies the command value to your system clipboard.</p>
            <p><strong>Advanced Filters:</strong></p>
            <p>You can search logged histories directly using comma-separated keywords with include (<code>-f</code>) logic without writing custom grep pipes.</p>
        `,
        flags: [
            { name: "[name]", desc: "Name of the variable to retrieve and copy." },
            { name: "-t, --tag <name>", desc: "<strong>Tag Filter:</strong> Retrieve saved commands filtered by a specific tag." },
            { name: "-h, --hist", desc: "<strong>Search History:</strong> Opens a paginated table of logged terminal executions." },
            { name: "-c, --copy", desc: "<strong>Copy Bank:</strong> Read configurations directly from your shared copy bank database file." },
            { name: "-f <keywords>", desc: "<strong>Include Filter:</strong> comma-separated list of words that must be present in the command." },
            { name: "-n <count>", desc: "Limit search results count (default: 10)." }
        ]
    },
    "clear": {
        title: "Clear (Data Purge)",
        syntax: "cwm clear [flags]",
        summary: "Wipe saved command variables or path-specific history logs.",
        logic: `
            <p>The <code>clear</code> command maintains database hygiene. Any deletion triggered here is instantly synchronized with your copy bank database.</p>
        `,
        flags: [
            { name: "-s", desc: "<strong>Wipe Variables:</strong> Deletes all saved command aliases permanently." },
            { name: "-a <dir>", desc: "<strong>Wipe Directory Logs:</strong> Deletes logged command histories registered under a specific path (use <code>.</code> for current folder)." }
        ]
    },
    "watch": {
        title: "Watch (Active Tracker)",
        syntax: "cwm watch <subcommand>",
        summary: "Toggle the real-time background shell execution command logging.",
        logic: `
            <p>The <code>watch</code> command controls the background terminal execution logger. When active, every shell command is logged in SQLite along with its context directory path.</p>
        `,
        subcommands: [
            { name: "start", desc: "Activate real-time shell logging hooks." },
            { name: "stop", desc: "Deactivate real-time shell logging hooks." },
            { name: "status", desc: "Displays whether active tracking is currently running." }
        ]
    },
    "bank": {
        title: "Bank (Storage & Reset)",
        syntax: "cwm bank <subcommand>",
        summary: "Inspect CWM database folders, file size metrics, or trigger a factory reset.",
        logic: `
            <p>The <code>bank</code> command displays database metadata. It also coordinates global database purges, ensuring any linked copy bank files are also safely removed.</p>
        `,
        subcommands: [
            { name: "info", desc: "View folder locations and file sizes of global and copy banks." },
            { name: "delete --global", desc: "<strong>Reset CWM:</strong> Completely deletes settings, saved variables, and histories on this PC and synchronized copy banks." }
        ]
    },
    "config": {
        title: "Config (Settings)",
        syntax: "cwm config [flags]",
        summary: "Set up copy bank mirroring, point to custom history files, or wipe configurations.",
        logic: `
            <p>The <code>config</code> command handles your configurations. To ensure system safety, custom history files are validated during setting to make sure they are not text files filled with continuous lines (maximum 100 words per line restriction).</p>
        `,
        flags: [
            { name: "-c, --copy-bank <path>", desc: "Define a remote path (like a shared drive) for instant two-way database mirroring sync." },
            { name: "--change-history-file <path>", desc: "Set a custom terminal history file path." },
            { name: "--change-history-dir <path>", desc: "Alias for setting a custom terminal history file path." },
            { name: "--clear", desc: "Clear all saved settings and fall back to default auto-detection." }
        ]
    }
};