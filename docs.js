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
        flags: [],
        usage: [
            {
                title: "Run diagnostic system check",
                cmd: "cwm hello",
                expect: "CWM Command Watch Manager (v1.0.0)\nOS: windows/amd64\nHistory File: C:/Users/ismail/AppData/Roaming/Microsoft/Windows/PowerShell/PSReadLine/ConsoleHost_history.txt\nShell Hook: Active (Instant Sync)"
            }
        ]
    },
    "version": {
        title: "Version Information",
        syntax: "cwm version",
        summary: "Displays the active version of the CWM CLI tool.",
        logic: `
            <p>The <code>version</code> command (or <code>-v</code> / <code>--version</code> flags) outputs the active CWM release version string.</p>
        `,
        flags: [
            { name: "-v, --version", desc: "Print current application version and exit." }
        ],
        usage: [
            {
                title: "Check current application version",
                cmd: "cwm version",
                expect: "cwm 1.0.0"
            }
        ]
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
        ],
        usage: [
            {
                title: "Auto-configure active shell profile",
                cmd: "cwm setup",
                expect: "Detected Windows System.\nConfiguring PowerShell (Core)...\nTarget: C:/Users/ismail/Documents/PowerShell/Microsoft.PowerShell_profile.ps1\nDone! Please restart or reload your PowerShell terminal."
            },
            {
                title: "Force manual shell selection menu",
                cmd: "cwm setup --force",
                expect: "Select your shell:\n1. PowerShell (Core)\n2. WindowsPowerShell (Legacy)\n3. Git Bash\nEnter choice [1-3]:"
            }
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
            { name: "var 'cmd'", desc: "Standard format. Nickname variable to run command." },
            { name: "-d, --description <name>", desc: "<strong>Description:</strong> Assign a description to the saved command(s)." },
            { name: "-s, --script <name>", desc: "<strong>Script Mode:</strong> Open terminal multiline code editor to write/paste custom scripts saved in <code>~/.cwm/scripts/</code>." },
            { name: "-s -e <name>", desc: "<strong>Script Edit:</strong> Open existing script content in terminal editor pre-filled for interactive editing." },
            { name: "-e, --edit <name>", desc: "<strong>Edit Mode:</strong> Force update of an already existing variable name." },
            { name: "-ev <old> <new>", desc: "<strong>Rename Mode:</strong> Rename an existing variable key to a new one." }
        ],
        usage: [
            {
                title: "Save a command alias with tags and description",
                cmd: "cwm save hello \"echo Hello World\" -t util -d \"Greets user\"",
                expect: "Saved [util] hello = echo Hello World (Greets user)"
            },
            {
                title: "Create a multiline standalone script (-s)",
                cmd: "cwm save -s -t util -d \"Visual folder tree\" tree-copy",
                expect: "Opened script editor (notepad)... Edit and save your script file anytime!\nSaved [script, util] tree-copy = powershell -ExecutionPolicy Bypass -File \"~/.cwm/scripts/tree-copy.ps1\""
            },
            {
                title: "Edit an existing script in native editor (-s -e)",
                cmd: "cwm save -s -e tree-copy",
                expect: "Opened script editor (notepad)... Edit and save your script file anytime!\nUpdated [script, util] tree-copy = powershell -ExecutionPolicy Bypass -File \"~/.cwm/scripts/tree-copy.ps1\""
            },
            {
                title: "Rename an existing variable key (-ev / -r)",
                cmd: "cwm save -r old_name new_name",
                expect: "Renamed variable old_name -> new_name"
            }
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
            { name: "-x, --exec", desc: "<strong>Direct Execution:</strong> Execute the retrieved command or script directly inside the current terminal session." },
            { name: "-t, --tag <name>", desc: "<strong>Tag Filter:</strong> Retrieve saved commands filtered by a specific tag." },
            { name: "-h, --hist", desc: "<strong>Search History:</strong> Opens a paginated table of logged terminal executions." },
            { name: "-c, --copy", desc: "<strong>Copy Bank:</strong> Read configurations directly from your shared copy bank database file." },
            { name: "-f <keywords>", desc: "<strong>Include Filter:</strong> comma-separated list of words that must be present in the command." },
            { name: "-n <count>", desc: "Limit search results count (default: 10)." }
        ],
        usage: [
            {
                title: "Run saved command or script with interactive variable resolution (-x)",
                cmd: "cwm get tree-copy -x",
                expect: "Enter value for %Path%: .\nExecuting: powershell -ExecutionPolicy Bypass -File \"~/.cwm/scripts/tree-copy.ps1\" \".\"\nVisual tree for '.' copied to clipboard!"
            },
            {
                title: "Search terminal history for a keyword",
                cmd: "cwm get docker",
                expect: "ID   COMMAND                          DATE\n12   docker compose up -d             2026-07-23 14:10\n45   docker build -t app:latest .     2026-07-23 15:30"
            },
            {
                title: "Copy saved command directly to clipboard (-c)",
                cmd: "cwm get hello -c",
                expect: "Copied 'echo Hello World' to clipboard!"
            }
        ]
    },
    "kp": {
        title: "Kill Port (Process & Network Utility)",
        syntax: "cwm kp <port> [flags]",
        summary: "Inspect and kill processes holding a specific network port with interactive prompts, CWD detection, and system process safeguards.",
        logic: `
            <p>The <code>kp</code> (alias <code>kill-port</code>) command allows you to resolve processes listening on a local network port, view their working directory and command arguments, and terminate them safely.</p>
            <ul>
                <li><strong>Port Status Check:</strong> Immediately reports if the port is already free.</li>
                <li><strong>Process Visualization:</strong> Shows PID, Process Name, CWD (Working Directory), and full command string.</li>
                <li><strong>System Safeguards:</strong> Prevents killing critical OS processes (PIDs 0, 4, <code>System</code>, <code>svchost.exe</code>, <code>systemd</code>, <code>launchd</code>).</li>
            </ul>
        `,
        flags: [
            { name: "<port>", desc: "Target network port number (1-65535)." },
            { name: "-f, --force", desc: "<strong>Force Mode:</strong> Instantly terminate the process without interactive confirmation prompt." }
        ],
        usage: [
            {
                title: "Inspect process listening on port 8080 and kill interactively",
                cmd: "cwm kill 8080",
                expect: "Process listening on port 8080:\nPID: 14208 | Name: node.exe | Path: C:/Program Files/nodejs/node.exe\nKill process? (y/N): y\nSuccessfully killed PID 14208 on port 8080."
            },
            {
                title: "Force terminate process on port (-f)",
                cmd: "cwm kill 8080 -f",
                expect: "Force terminating PID 14208 on port 8080...\nProcess killed."
            }
        ]
    },
    "clear": {
        title: "Clear & Trash Restore",
        syntax: "cwm clear [query] [flags]",
        summary: "Interactively delete selected saved commands, wipe history logs, or restore deleted commands from trash.",
        logic: `
            <p>The <code>clear</code> command provides interactive selective deletion and automatic trash backups (keeping the last 100 deleted commands):</p>
            <ul>
                <li><strong>Interactive Selection:</strong> Displays a numbered list of commands (e.g. <code>1. test, 2. serve, 3. build</code>). Enter numbers like <code>1, 3</code> to delete only those specific commands.</li>
                <li><strong>Automatic Trash (Undo):</strong> All deleted saved commands are safely archived into the trash database (up to 100 items).</li>
                <li><strong>Conflict Resolution:</strong> When restoring from trash, if a command name already exists in active saved commands, the active command is preserved and the restore is safely skipped.</li>
                <li><strong>Bulk Confirmation:</strong> Bulk wipe operations require confirmation prompts unless <code>-y</code> / <code>--yes</code> is supplied.</li>
            </ul>
        `,
        flags: [
            { name: "[query]", desc: "Search pattern to filter saved commands before opening selection menu." },
            { name: "-r, --restore [name]", desc: "<strong>Restore Trash:</strong> Pass a variable name to restore it immediately, or run <code>cwm clear -r</code> to inspect trash and pick items to restore." },
            { name: "-n, --list", desc: "<strong>List Trash:</strong> View recently deleted commands in the trash buffer (last 100 items)." },
            { name: "-s, --saved", desc: "<strong>Clear Saved Commands:</strong> Bulk clear saved commands with confirmation prompt." },
            { name: "-d, --history", desc: "<strong>Clear History Logs:</strong> Bulk clear shell history logs with confirmation prompt." },
            { name: "-a <dir>", desc: "<strong>Clear Path History:</strong> Delete logged command histories for a specific context directory." },
            { name: "-y, --yes", desc: "<strong>Skip Prompts:</strong> Automatically answer yes to confirmation prompts." }
        ],
        usage: [
            {
                title: "Interactive selective command deletion",
                cmd: "cwm clear",
                expect: "1. test\n2. serve\n3. build\nEnter numbers to delete (e.g. 1, 3): 1\nDeleted 1 command."
            },
            {
                title: "Restore deleted command from trash (-r)",
                cmd: "cwm clear -r tree-copy",
                expect: "Restored command 'tree-copy' from trash."
            },
            {
                title: "List recently deleted items in trash (-n / --list)",
                cmd: "cwm clear --list",
                expect: "TRASH COMMANDS (Last 100):\n1. tree-copy (Deleted: 2026-07-23 18:00)\n2. serve-cd  (Deleted: 2026-07-23 17:30)"
            }
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
        ],
        usage: [
            {
                title: "Activate background terminal logger",
                cmd: "cwm watch start",
                expect: "Real-time background command watch started."
            },
            {
                title: "Check background logger status",
                cmd: "cwm watch status",
                expect: "Background Watch Status: ACTIVE"
            }
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
        ],
        usage: [
            {
                title: "Inspect database metrics and folder paths",
                cmd: "cwm bank info",
                expect: "Database Locations & Metrics:\n  Primary DB:   C:/Users/ismail/.cwm/cwm.db (1.2 MB)\n  Scripts Dir:  C:/Users/ismail/.cwm/scripts (4 files)\n  Trash Bank:   14 archived items"
            }
        ]
    },
    "config": {
        title: "Config (Settings)",
        syntax: "cwm config [key] [value] [flags]",
        summary: "Configure preferred script editor, copy bank mirroring, custom history file location, or wipe configurations.",
        logic: `
            <p>The <code>config</code> command handles CWM system preferences including native text editor choices (VS Code, Nano, Vim, Notepad) and copy bank paths.</p>
        `,
        flags: [
            { name: "--editor <app>", desc: "Set preferred native text editor via flag." },
            { name: "-c, --copy-bank <path>", desc: "Define a remote path (like a shared drive) for instant two-way database mirroring sync." },
            { name: "--change-history-file <path>", desc: "Set a custom terminal history file path." },
            { name: "--change-history-dir <path>", desc: "Alias for setting a custom terminal history file path." },
            { name: "--clear", desc: "Clear all saved settings and fall back to default auto-detection." }
        ],
        usage: [
            {
                title: "Set preferred native text editor for scripts (VS Code, Nano, Notepad)",
                cmd: "cwm config --editor \"code --wait\"",
                expect: "Set preferred editor: code --wait"
            },
            {
                title: "Set preferred editor to Notepad on Windows",
                cmd: "cwm config editor notepad",
                expect: "Set preferred editor: notepad"
            },
            {
                title: "Configure shared remote copy bank path (-c)",
                cmd: "cwm config -c \"D:/shared/cwm_bank.db\"",
                expect: "Set copy bank path: D:/shared/cwm_bank.db"
            },
            {
                title: "View all active system settings",
                cmd: "cwm config",
                expect: "General Settings\n  History File:     Auto-Detect\n  Preferred Editor: code --wait\n  Code Theme:       monokai\n  Copy Bank Path:   D:/shared/cwm_bank.db"
            }
        ]
    }
};