const cwmData = {
    projectInfo: {
        name: "CWM",
        fullName: "Command Watch Manager",
        version: "v1.0.0", // Updated to Go version
        package: "cwm-cli-go",
        installCommand: "cwm setup",
        description: "A lightning-fast, zero-dependency Go CLI utility to vault commands, track shell history, and sync databases.",
        old_versions: []
    },
    alerts: [
        {
            type: "news",
            title: "Go Migration Complete!",
            text: "CWM has been completely rewritten in <strong>Go</strong>! Enjoy instant execution speeds, zero Python dependencies, and a robust SQLite storage backend."
        },
        {
            type: "info",
            title: "Multi-PC Synchronization",
            text: "Sync your shell commands across multiple computers automatically using our two-way SQL merge configuration: <code>cwm config -c /shared/path</code>."
        },
        {
            type: "warning",
            title: "History Safety Checks",
            text: "Custom history file paths are automatically validated to ensure they are valid files containing 'history' in their names, with a safety limit of 100 words per line."
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
                    desc: "Displays system diagnostics, active shell info, and history log status.",
                    example: "$ cwm hello"
                },
                {
                    id: "setup",
                    name: "cwm setup",
                    desc: "Auto-configures shell profiles (Bash, Zsh, PowerShell) for instant command history sync and deduplication.",
                    example: "$ cwm setup"
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
                    desc: "Save commands under alias variables. Prevents accidental overwrites unless explicit edit (-e) or rename (-ev) mode is used.",
                    example: "$ cwm save test='pytest -vv'\n$ cwm save -e test='pytest -vv --lf'\n$ cwm save -ev test test_unit"
                },
                {
                    id: "get",
                    name: "cwm get",
                    desc: "Retrieve saved commands, search shell history (-h), or query the copy bank database (-c). Copies results to clipboard.",
                    example: "$ cwm get test\n$ cwm get -h -f 'git,commit'\n$ cwm get -c test"
                }
            ]
        },
        {
            id: "admin",
            title: "Database & Configuration",
            commands: [
                {
                    id: "clear",
                    name: "cwm clear",
                    desc: "Wipe saved commands (-s) or path-specific history logs (-a <dir>). Syncs immediately with the copy bank.",
                    example: "$ cwm clear -s\n$ cwm clear -a ."
                },
                {
                    id: "watch",
                    name: "cwm watch",
                    desc: "Start/stop real-time command logging hook in the current shell.",
                    example: "$ cwm watch start\n$ cwm watch stop\n$ cwm watch status"
                },
                {
                    id: "bank",
                    name: "cwm bank",
                    desc: "Inspect database locations, view sizes, or delete storage banks (mirrors deletion to the copy bank).",
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