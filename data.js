const cwmData = {
    projectInfo: {
        name: "CWM",
        fullName: "Command Watch Manager",
        version: "v1.0.0",
        installCommand: "pip install cwm-cli",
        description: "A command-line tool designed to bring powerful history, saving, and session management features to your terminal commands without complex external dependencies."
    },
    alerts: [
        {
            type: "warning",
            title: "Windows Limit",
            text: "Standard cmd.exe does not save history to file. Use PowerShell or Git Bash."
        },
        {
            type: "info",
            title: "Linux/Mac Users",
            text: "Run 'cwm setup' after installation to enable instant history syncing."
        }
    ],
    categories: [
        {
            id: "core",
            title: "Initialization & Core",
            commands: [
                { id: "hello", name: "cwm hello", desc: "Displays welcome message, version, and system info." },
                { id: "init", name: "cwm init", desc: "Initializes a new Local Bank (.cwm folder)." },
                { id: "setup", name: "cwm setup", desc: "Configures shell for instant history sync." },
                { id: "config", name: "cwm config", desc: "Manage configuration and history sources." }
            ]
        },
        {
            id: "saving",
            title: "Saving & Managing",
            commands: [
                { id: "save", name: "cwm save", desc: "Handles saving variables, raw commands, and archives." },
                { id: "bank", name: "cwm bank", desc: "Manage the storage banks (Local vs Global)." },
                { id: "clear", name: "cwm clear", desc: "Clean up saved commands or history." },
                { id: "backup", name: "cwm backup", desc: "Manage backups of your saved commands." }
            ]
        },
        {
            id: "retrieving",
            title: "Retrieving Data",
            commands: [
                { id: "get", name: "cwm get", desc: "Get commands from Bank, History, or Archives." }
            ]
        },
        {
            id: "utils",
            title: "Utilities",
            commands: [
                { id: "watch", name: "cwm watch", desc: "Session management to track specific workflows." },
                { id: "copy", name: "cwm copy", desc: "Context Packer for LLMs (File Tree & Content)." }
            ]
        }
    ]
};