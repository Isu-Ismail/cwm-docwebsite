const cwmDocs = {
    "hello": {
        title: "Hello (System Diagnostics)",
        syntax: "cwm hello",
        summary: "Displays system diagnostics, CWM version, OS/Architecture, active shell history path, shell hook status, direct execution (-x) status, and database schema health.",
        logic: `
            <p>The <code>hello</code> command is your primary tool for system diagnostics. It runs a series of quick validation checks on the running environment:</p>
            <ul>
                <li><strong>System Info:</strong> Shows current Operating System (Windows, Linux, macOS) and architecture details.</li>
                <li><strong>Active History File:</strong> Displays the exact path to the active shell history file.</li>
                <li><strong>Shell Hook & Direct Execution (-x):</strong> Confirms whether instant sync and the native <code>-x</code> execution shell wrapper function are active.</li>
                <li><strong>Database Schema Health:</strong> Validates SQLite database connectivity and schema version sync (v6).</li>
            </ul>
        `,
        flags: [],
        usage: [
            {
                title: "Run diagnostic system check",
                cmd: "cwm hello",
                expect: "CWM - Command Watch Manager (v2.0.0)\n-----------------------------------------------------------------\nOS:                  windows/amd64\nHistory File:        C:/Users/ismail/AppData/Roaming/Microsoft/Windows/PowerShell/PSReadLine/ConsoleHost_history.txt\nShell Hook:          Active (Instant Sync)\nDirect Execution:    Active (-x Native Wrapper Function Installed)\nDatabase Schema:     v6 (Healthy / Synced)"
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
                expect: "cwm v2.0.0"
            }
        ]
    },
    "setup": {
        title: "Setup (Shell Integration)",
        syntax: "cwm setup [flags]",
        summary: "Auto-configure shell profiles (Bash, Zsh, PowerShell) for instant command history synchronization and native -x execution wrapper.",
        logic: `
            <p>The <code>setup</code> command is a "set-and-forget" utility that hooks into your system terminal to enable instant history recording and native execution capabilities.</p>
            <p><strong>What it configures:</strong></p>
            <ul>
                <li><strong>Instant Sync:</strong> Forces terminal shell sessions to append executed commands directly to your history file on disk after every single execution.</li>
                <li><strong>Native -x Wrapper:</strong> Installs the <code>cwm()</code> shell function wrapper so running <code>cwm get <name> -x</code> evaluates directly in your active shell environment.</li>
                <li><strong>Profile Reload Copying:</strong> Automatically copies the system-aware reload command (<code>. $PROFILE</code> or <code>source ~/.bashrc</code>) directly to your clipboard.</li>
            </ul>
        `,
        flags: [
            { name: "--force", desc: "Open manual interactive menu to select shell choice if auto-detection fails." }
        ],
        usage: [
            {
                title: "Auto-configure active shell profile",
                cmd: "cwm setup",
                expect: "Detected Windows System.\nConfiguring PowerShell (Core)...\nTarget: C:/Users/ismail/Documents/PowerShell/Microsoft.PowerShell_profile.ps1\nCopied reload command '. $PROFILE' to clipboard!\nPress Ctrl+V (or right-click) and Enter to activate your profile immediately."
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
        summary: "Save shell command strings or external standalone scripts under variable names with tags and descriptions.",
        logic: `
            <p>The <code>save</code> command acts as a vault for complex commands and reusable script files.</p>
            <p><strong>Conflict Protection & Script Features:</strong></p>
            <ul>
                <li><strong>Overwrite Safeguard:</strong> Saving an existing variable key throws an error unless explicit edit mode (<code>-e</code>) or rename mode (<code>-ev</code>) is requested.</li>
                <li><strong>Script Mode (-s):</strong> Launches your preferred native editor to write/edit multiline scripts saved inside <code>~/.cwm/scripts/</code>.</li>
            </ul>
        `,
        flags: [
            { name: "var 'cmd'", desc: "Standard format. Nickname variable to run command." },
            { name: "-d, --description <name>", desc: "<strong>Description:</strong> Assign a description to the saved command(s)." },
            { name: "-t, --tag <tag>", desc: "<strong>Tags:</strong> Assign organizational tags to saved commands." },
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
                expect: "Opened script editor (code --wait)... Edit and save your script file anytime!\nSaved [script, util] tree-copy = powershell -ExecutionPolicy Bypass -File \"~/.cwm/scripts/tree-copy.ps1\""
            },
            {
                title: "Rename an existing variable key (-ev)",
                cmd: "cwm save -ev old_name new_name",
                expect: "Renamed variable old_name -> new_name"
            }
        ]
    },
    "get": {
        title: "Get (Search & Clipboard)",
        syntax: "cwm get [name] [flags]",
        summary: "Retrieve saved variables, search global shell histories (-h), query copy bank (-c), or execute directly (-x) with placeholder resolution.",
        logic: `
            <p>The <code>get</code> command searches and executes vaulted commands:</p>
            <ul>
                <li><strong>Interactive Placeholders:</strong> Detects <code>%Variable%</code> headers and prompts for user inputs dynamically. Ignores commented lines (<code>#</code>, <code>//</code>, <code>--</code>) automatically.</li>
                <li><strong>Missing Script Handling:</strong> Prompts interactive choices (delete entry or create script template) if a referenced script file is missing from disk.</li>
            </ul>
        `,
        flags: [
            { name: "[name]", desc: "Name of the variable to retrieve and copy." },
            { name: "-x, --exec", desc: "<strong>Direct Execution:</strong> Execute the retrieved command or script directly inside the current terminal session." },
            { name: "-t, --tag <name>", desc: "<strong>Tag Filter:</strong> Retrieve saved commands filtered by a specific tag." },
            { name: "-h, --hist", desc: "<strong>Search History:</strong> Opens a paginated table of logged terminal executions." },
            { name: "-c, --copy", desc: "<strong>Copy Bank:</strong> Read configurations directly from your shared copy bank database file." },
            { name: "-f <keywords>", desc: "<strong>Include Filter:</strong> Comma-separated list of words that must be present in the command." },
            { name: "-n <count>", desc: "Limit search results count (default: 10)." }
        ],
        usage: [
            {
                title: "Run saved command or script with interactive variable resolution (-x)",
                cmd: "cwm get tree-copy -x",
                expect: "Enter value for %Path%: .\nExecuting: powershell -ExecutionPolicy Bypass -File \"~/.cwm/scripts/tree-copy.ps1\" \".\""
            },
            {
                title: "Search terminal history for keywords",
                cmd: "cwm get -h -f 'git,commit'",
                expect: "ID   COMMAND                          DATE\n12   git commit -m 'feat: initial'    2026-07-24 14:10"
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
    "tidy": {
        title: "Tidy (Optimization)",
        syntax: "cwm tidy [history|watch] [flags]",
        summary: "Deduplicate and optimize terminal history files on disk or recorded watch logs in database with path-aware context matching.",
        logic: `
            <p>The <code>tidy</code> command optimizes history logs across disk and database:</p>
            <ul>
                <li><strong>cwm tidy history:</strong> Scans the active shell history file on disk, removing duplicate command lines and filtering bloated entries exceeding character (<code>-c</code>) or word (<code>-w</code>) thresholds.</li>
                <li><strong>cwm tidy watch:</strong> Performs <strong>path-aware deduplication</strong> on recorded watch history in the SQLite database (<code>history_logs</code> table). Preserves duplicate command names across different working directories while deduplicating repeats within the same directory context.</li>
                <li><strong>cwm tidy:</strong> Runs both history and watch tidying in a single command.</li>
            </ul>
        `,
        flags: [
            { name: "history", desc: "Tidy active shell history file on disk." },
            { name: "watch", desc: "Tidy recorded watch history database logs with path-aware deduplication." },
            { name: "-c, --max-chars <int>", desc: "Filter out command lines exceeding N characters (default: 200, 0 to disable)." },
            { name: "-w, --max-words <int>", desc: "Filter out command lines exceeding N words (default: 50, 0 to disable)." },
            { name: "-n, --max-lines <int>", desc: "Filter out multiline command blocks exceeding N lines (default: 10)." },
            { name: "-y, --yes", desc: "Skip confirmation prompts." }
        ],
        usage: [
            {
                title: "Path-aware watch database history tidying (cwm tidy watch)",
                cmd: "cwm tidy watch",
                expect: "Watch History Analysis (SQLite Database):\n  • Total Log Entries:            4200\n  • Path-Aware Duplicates Found:  310\n  • Optimized Result:             4200 -> 3890 database entries\nSuccessfully tidied watch database logs (removed 310 path-aware duplicates)."
            },
            {
                title: "Disk history file tidying (cwm tidy history)",
                cmd: "cwm tidy history -c 200 -w 50",
                expect: "Shell History Analysis (File Disk):\n  Target File:         C:/Users/ismail/.../ConsoleHost_history.txt\n  • Total Raw Lines:   11711\n  • Duplicate Lines:   7780\n  • Oversized (>200 ch): 113\n  • Optimized Result:  11711 -> 3818 lines"
            },
            {
                title: "Full system history and watch tidying (cwm tidy -y)",
                cmd: "cwm tidy -y",
                expect: "Successfully tidied shell history file (11711 -> 3818 lines).\nSuccessfully tidied watch database logs (removed 310 path-aware duplicates)."
            }
        ]
    },
    "clear": {
        title: "Clear & Trash Restore",
        syntax: "cwm clear [query] [flags]",
        summary: "Interactively delete selected saved commands, wipe history logs, or manage the trash buffer.",
        logic: `
            <p>The <code>clear</code> command provides interactive selective deletion and automatic trash backups (keeping the last 100 deleted commands):</p>
            <ul>
                <li><strong>Interactive Selection:</strong> Displays a numbered list of saved commands. Enter numbers like <code>1, 3</code> to delete specific commands. Deleting script commands automatically cleans associated script files from disk.</li>
                <li><strong>Automatic Trash (Undo):</strong> All deleted saved commands are safely archived into the trash database (up to 100 items).</li>
                <li><strong>Direct Restore (-r):</strong> Pass a command variable name (<code>cwm clear -r tree-copy</code>) to restore it directly.</li>
                <li><strong>Empty Trash (--trash):</strong> Permanently empty all archived commands in the trash buffer.</li>
            </ul>
        `,
        flags: [
            { name: "[query]", desc: "Search pattern to filter saved commands before opening selection menu." },
            { name: "--trash", desc: "<strong>Clear Trash:</strong> Permanently empty all archived commands in the trash buffer." },
            { name: "-r, --restore [name]", desc: "<strong>Restore Trash:</strong> Pass a variable name to restore it immediately, or run <code>cwm clear -r</code> to inspect trash and pick items to restore." },
            { name: "-n, --list", desc: "<strong>List Trash:</strong> View recently deleted commands in the trash buffer (last 100 items)." },
            { name: "-c, --config", desc: "<strong>Clear Config:</strong> Wipe all saved system configurations (preferred editor, history file, code theme) and reset to default auto-detection." },
            { name: "-s, --saved", desc: "<strong>Clear Saved Commands:</strong> Bulk clear saved commands with confirmation prompt." },
            { name: "-d, --history", desc: "<strong>Clear History Logs:</strong> Bulk clear shell history logs with confirmation prompt." },
            { name: "-a <dir>", desc: "<strong>Clear Path History:</strong> Delete logged command histories for a specific context directory." },
            { name: "-y, --yes", desc: "<strong>Skip Prompts:</strong> Automatically answer yes to confirmation prompts." }
        ],
        usage: [
            {
                title: "Restore deleted command from trash (-r)",
                cmd: "cwm clear -r tree-copy",
                expect: "Restored command 'tree-copy' from trash."
            },
            {
                title: "Permanently empty trash buffer (--trash)",
                cmd: "cwm clear --trash",
                expect: "Are you sure you want to permanently empty ALL 15 item(s) in the trash buffer? (y/N): y\nSuccessfully emptied trash buffer (15 item(s) permanently deleted)."
            },
            {
                title: "Interactive selective command deletion",
                cmd: "cwm clear",
                expect: "1. test\n2. serve\n3. build\nEnter numbers to delete (e.g. 1, 3): 1\nNotice: Deleted associated script file for 'test': C:/Users/ismail/.cwm/scripts/test.ps1\nDeleted 1 command."
            }
        ]
    },
    "watch": {
        title: "Watch (Active Tracker)",
        syntax: "cwm watch <subcommand> [flags]",
        summary: "Toggle real-time background shell execution command logging with command exclusion filters.",
        logic: `
            <p>The <code>watch</code> command controls the background terminal execution logger. When active, every shell command is logged in SQLite along with its context directory path.</p>
            <ul>
                <li><strong>Command Exclusion (-ex):</strong> Configure a comma-separated exclusion list (e.g. <code>cwm watch start -ex cwm,python,clear</code>) to prevent specific commands from being saved in database history logs.</li>
                <li><strong>Profile Reloading:</strong> Automatically copies system-aware reload commands (<code>. $PROFILE</code> or <code>source ~/.bashrc</code>) directly to your clipboard upon starting or stopping watch hooks.</li>
            </ul>
        `,
        subcommands: [
            { name: "start", desc: "Activate real-time shell logging hooks (supports <code>-ex cwm,python,clear</code> to exclude specific commands)." },
            { name: "stop", desc: "Deactivate real-time shell logging hooks." },
            { name: "status", desc: "Displays whether active tracking is currently running and lists excluded commands." }
        ],
        flags: [
            { name: "-ex, --exclude <list>", desc: "Comma-separated list of command prefixes/names to exclude from watch logging (e.g. <code>cwm watch start -ex cwm,python,clear</code>)." }
        ],
        usage: [
            {
                title: "Activate background terminal logger with excluded commands",
                cmd: "cwm watch start -ex cwm,python,clear",
                expect: "Watch session started successfully!\n  Profile updated:   C:/Users/ismail/...\n  Excluded Commands: cwm,python,clear\n  Copied reload command '. $PROFILE' to clipboard!"
            },
            {
                title: "Check background logger status",
                cmd: "cwm watch status",
                expect: "Watch status: ACTIVE\nShell Type:        pwsh\nProfile File:      C:/Users/ismail/...\nExcluded Commands: cwm,python,clear"
            }
        ]
    },
    "bank": {
        title: "Bank (Storage & Replication)",
        syntax: "cwm bank <subcommand>",
        summary: "Inspect database metrics, view file sizes, or delete global storage banks.",
        logic: `
            <p>The <code>bank</code> command lets you monitor storage metrics and manage the local primary database or remote mirror bank.</p>
        `,
        subcommands: [
            { name: "info", desc: "Inspect database locations, storage sizes, script counts, and copy bank status." },
            { name: "delete", desc: "Delete storage banks with confirmation prompts." }
        ],
        flags: [
            { name: "--global", desc: "Target global database file for bank deletion." }
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