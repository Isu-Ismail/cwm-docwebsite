const cwmData = {
    projectInfo: {
        name: "CWM",
        fullName: "Command Watch Manager (●'◡'●)",
        version: "v1.1.0", // Updated to Latest
        package: "cwm-cli", // Package name for pip install
        installCommand: "pip install cwm-cli", // Default command
        description: "A command-line tool designed to bring powerful history, saving, and session management features to your terminal commands without complex external dependencies.",
        old_versions: ["v1.0.0"] // List of older versions
    },
    alerts: [
        {
            type: "news",
            title: "╰(*°▽°*)╯ Whats New !!!",
            text: "v1.1.0 released ,check it out. jump and project commands added,ease the navigation between your porject form any path"
        },
        {
            type: "upcoming",
            title: " (⓿_⓿) Meet Your New CLI Assistant Description (stay tuned for updates)",
            text: "cwm ask gemini,openai,local - these commands will allow you to use ai in your terminal with your own API keys and if you have a local ollama models you can use  them too"
        },

        {
            type: "warning",
            title: " X_X Windows Limit",
            text: "Standard cmd.exe does not save history to file. Use PowerShell or Git Bash for history features."
        },
        {
            type: "info",
            title: " ^_____^ Linux/Mac Users",
            text: "Linux: Run 'cwm setup'. <br> macOS: to enable instant sync Run <br> `echo 'setopt INC_APPEND_HISTORY' >> ~/.zshrc` ."
        },
        
    ],
    categories: [
       
        {
            id: "core",
            title: "Initialization & Core",
            commands: [
                { id: "hello", name: "cwm hello", desc: "Displays welcome message, version, and system info.", example: "$ cwm hello" },
                { id: "init", name: "cwm init", desc: "Initializes a new Local Bank (.cwm folder).", example: "$ cwm init" },
                { id: "setup", name: "cwm setup", desc: "Configures shell for instant history sync.", example: "$ cwm setup\n$ cwm setup --force" },
                { id: "config", name: "cwm config", desc: "Manage settings (Editors, Markers, History Source).", example: "$ cwm config --editor 'code'\n$ cwm config --add-marker 'go.mod'" }
            ]
        },
        {
            id: "saving",
            title: "Saving & Managing",
            commands: [
                { id: "save", name: "cwm save", desc: "Handles saving variables, raw commands, and archives.", example: "$ cwm save my-var='cwm hello' \n$ cwm save -b my-var \n$ cwm save --arch" },
                { id: "bank", name: "cwm bank", desc: "Manage the storage banks (Local vs Global).", example: "$ cwm bank info\n$ cwm bank delete --global | --local" },
                { id: "clear", name: "cwm clear", desc: "Clean up saved commands or history.", example: "$ cwm clear --saved -f 'cwm' \n$ cwm clear --hist --all" },
                { id: "backup", name: "cwm backup", desc: "Manage backups of your saved commands.", example: "$ cwm backup list\n$ cwm backup merge -l | -cl " }
            ]
        },
        {
            id: "retrieving",
            title: "Retrieving Data",
            commands: [
                { id: "get", name: "cwm get", desc: "Get commands from Bank, History, or Archives.", example: "$ cwm get my-var\n$ cwm get --hist -f 'pip' -n 10\n$ cwm get --cached [filters]" }
            ]
        },
         {
            id: "workspace",
            title: "Workspace Management",
            commands: [
                { id: "jump", name: "cwm jump", desc: "Instantly open project folders in your editor or terminal.", example: "$ cwm jump my-api\n$ cwm jump 1,2 -t" },
                { id: "project", name: "cwm project", desc: "Manage your project database (Scan, Add, Remove).", example: "$ cwm project scan\n$ cwm project add .\n$ cwm project remove -n all" },
                { id: "watch", name: "cwm watch", desc: "Session management to track specific workflows.", example: "$ cwm watch start \n$ cwm watch stop --save" },
                { id: "copy", name: "cwm copy", desc: "Context Packer for LLMs (File Tree & Content).", example: "$ cwm copy\n$ cwm copy --tree" },
                {
                    id: "git",
                    name: "cwm git",
                    desc: "Manage multiple GitHub accounts (SSH keys) and auto-configure local repos.",
                    example: "$ cwm git add\n$ cwm git setup"
                }
            ]
        },
        // {
        //     id: "utils",
        //     title: "Utilities",
        //     commands: [
        //         { id: "watch", name: "cwm watch", desc: "Session management to track specific workflows.", example: "$ cwm watch start \n$ cwm watch stop --save" },
        //         { id: "copy", name: "cwm copy", desc: "Context Packer for LLMs (File Tree & Content).", example: "$ cwm copy\n$ cwm copy --tree" },
        //         {
        //             id: "git",
        //             name: "cwm git",
        //             desc: "Manage multiple GitHub accounts (SSH keys) and auto-configure local repos.",
        //             example: "$ cwm git add\n$ cwm git setup"
        //         }
        //     ]
        // }
    ]
};
