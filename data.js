const cwmData = {
    projectInfo: {
        name: "CWM",
        fullName: "Command Watch Manager",
        version: "v2.0.0",
        package: "cwm-cli-go",
        description: "A lightning-fast, zero-dependency Go CLI utility to vault commands, track shell history, perform path-aware deduplication, and execute script automations seamlessly.",
        old_versions: ["v1.0.0"]
    },
    alerts: [
        {
            type: "news",
            title: "CWM v2.0.0 Release!",
            text: "Features top-level <code>cwm tidy</code> with <strong>path-aware watch database deduplication</strong>, command exclusion filtering (<code>cwm watch start -ex cwm,python,clear</code>), interactive script management, and permanent trash purging."
        },
        {
            type: "info",
            title: "Multi-PC Synchronization",
            text: "Sync your shell commands across multiple computers automatically using our two-way SQL merge configuration: <code>cwm config -c /shared/path</code>."
        },
        {
            type: "warning",
            title: "History Safety Checks",
            text: "Custom history file paths are automatically validated to ensure they are valid files containing 'history' in their names, with configurable character and word limit checks."
        }
    ],
    categories: [
        {
            id: "start",
            title: "Getting Started",
            commands: [
                {
                    id: "hello",
                    name: "cwm hello",
                    desc: "Displays system diagnostics including OS/Arch, history file location, shell hook status, direct execution (-x) status, and database schema health.",
                    example: "$ cwm hello"
                },
                {
                    id: "setup",
                    name: "cwm setup",
                    desc: "Auto-configures shell profiles (Bash, Zsh, PowerShell) for instant command history sync and native -x execution wrapper.",
                    example: "$ cwm setup"
                },
                {
                    id: "version",
                    name: "cwm version",
                    desc: "Displays the current CWM CLI version.",
                    example: "$ cwm version\n$ cwm -v\n$ cwm --version"
                }
            ]
        },
        {
            id: "core",
            title: "Command Vault",
            commands: [
                {
                    id: "save",
                    name: "cwm save",
                    desc: "Save commands or external scripts (-s) under alias variables. Prevents accidental overwrites unless explicit edit (-e) or rename (-ev) mode is used.",
                    example: "$ cwm save test 'pytest -vv' -t test -d 'Run all tests with verbose output'\n$ cwm save deploy -s ./deploy.ps1 -t release -d 'Deployment script'"
                },
                {
                    id: "get",
                    name: "cwm get",
                    desc: "Retrieve saved commands, search shell history (-h), query copy bank (-c), or execute directly (-x) with interactive script placeholder resolution.",
                    example: "$ cwm get test\n$ cwm get deploy -x\n$ cwm get -h -f 'git,commit'\n$ cwm get -c test"
                },
                {
                    id: "kp",
                    name: "cwm kp",
                    desc: "Inspect and terminate processes listening on a target network port with CWD detection and safety checks.",
                    example: "$ cwm kp 8080\n$ cwm kp 8080 -f"
                }
            ]
        },
        {
            id: "admin",
            title: "Database & Optimization",
            commands: [
                {
                    id: "tidy",
                    name: "cwm tidy",
                    desc: "Deduplicate disk history file (history) or perform path-aware watch database deduplication (watch) per working directory context.",
                    example: "$ cwm tidy\n$ cwm tidy history -c 200 -w 50\n$ cwm tidy watch"
                },
                {
                    id: "clear",
                    name: "cwm clear",
                    desc: "Interactively delete selected saved commands (1, 3, 5), restore trashed items (-r), or empty the trash buffer (--trash).",
                    example: "$ cwm clear\n$ cwm clear -r\n$ cwm clear -r my_var\n$ cwm clear --trash"
                },
                {
                    id: "watch",
                    name: "cwm watch",
                    desc: "Start/stop real-time command logging hook with command exclusion list filtering (-ex).",
                    example: "$ cwm watch start -ex cwm,python,clear\n$ cwm watch stop\n$ cwm watch status"
                },
                {
                    id: "bank",
                    name: "cwm bank",
                    desc: "Inspect database locations, view storage sizes, or delete storage banks.",
                    example: "$ cwm bank info\n$ cwm bank delete --global"
                },
                {
                    id: "config",
                    name: "cwm config",
                    desc: "Set copy bank path (-c), set custom history file path (--change-history-file), or reset all configs.",
                    example: "$ cwm config -c /mnt/nfs/cwm.db\n$ cwm config --change-history-file ~/.zsh_history\n$ cwm config --clear"
                }
            ]
        }
    ]
};