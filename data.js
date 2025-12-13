const cwmData = {
    projectInfo: {
        name: "CWM",
        fullName: "Command Watch Manager (●'◡'●)",
        version: "v2.1.0", // Updated to Latest
        package: "cwm-cli", // Package name for pip install
        installCommand: "pip install cwm-cli", // Default command
        description: "A command-line tool designed to bring powerful history, saving, and session management features to your terminal commands without complex external dependencies.",
        old_versions: ["v1.0.0","v1.1.0"] // List of older versions
    },
    alerts: [
        {
            type: "news",
            title: "╰(*°▽°*)╯ Whats New !!!",
            text: "v2.1.0 released! check it out.<strong>run,project,group,ask</strong> commands are added"
        },
        {
            type: "upcoming",
            title: "(⓿_⓿) Meet Your New CLI Assistant",
            text: "Ask your assistant from your terminal <br> <code>cwm ask gemini</code>"
        },
        {
            type: "warning",
            title: "X_X Windows Limit",
            text: "Standard cmd.exe does not save history to file. Use PowerShell or Git Bash for history features."
        },
        {
            type: "info",
            title: "^_____^ Linux/Mac Users",
            text: "Linux & macOs users : To enable instant sync Run <br> <code>cwm setup</code>"
                         
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
                    desc: "Displays welcome message, version, and system info.", 
                    example: "$ cwm hello" 
                },
                { 
                    id: "init", 
                    name: "cwm init", 
                    desc: "Initializes a new Local Bank (.cwm folder) in the current directory.", 
                    example: "$ cwm init" 
                },
                { 
                    id: "bank", 
                    name: "cwm bank", 
                    desc: "Manage storage locations (Local vs Global banks).", 
                    example: "$ cwm bank info\n$ cwm bank clean\n$ cwm bank delete --local" 
                },
            ]
        },
        {
            id: "workspace",
            title: "Workspace Management",
            commands: [
                
                { 
                    id: "project", 
                    name: "cwm project", 
                    desc: "Manage your project database (Scan, Add, Remove).", 
                    example: "$ cwm project scan\n$ cwm project add . --alias main\n$ cwm project list" 
                },
                
                { 
                    id: "group", 
                    name: "cwm group", 
                    desc: "Manage project groups for bulk actions.", 
                    example: "$ cwm group add \n$ cwm group list" 
                },
                { 
                    id: "jump", 
                    name: "cwm jump", 
                    desc: "Instantly open project folders in your editor or terminal.", 
                    example: "$ cwm jump my-api\n$ cwm jump 2 -t\n$ cwm jump list" 
                },
                { 
                    id: "run", 
                    name: "cwm run", 
                    desc: "Run scripts defined in project configuration.", 
                    example: "$ cwm run project 1\n$ cwm run group\n$ cwm run gui" 
                },
            ]
        },
        {
            id: "core",
            title: "Core & Configuration",
            commands: [
                { 
                    id: "setup", 
                    name: "cwm setup", 
                    desc: "Install or verify shell hooks for history syncing.", 
                    example: "$ cwm setup\n$ cwm setup --force" 
                },
                
                { 
                    id: "save", 
                    name: "cwm save", 
                    desc: "Save commands, variables, or archives.", 
                    example: "$ cwm save my-key='value'\n$ cwm save -b before" 
                },
                { 
                    id: "watch", 
                    name: "cwm watch", 
                    desc: "Record project-specific history or workflows.", 
                    example: "$ cwm watch start \n$ cwm watch stop\n$ cwm watch status" 
                },
                { 
                    id: "get", 
                    name: "cwm get", 
                    desc: "Retrieve saved commands from Bank, History, or Archives.", 
                    example: "$ cwm get my-key\n$ cwm get --hist -n 10\n$ cwm get -ha -f pip -ex show" 
                },
                { 
                    id: "config", 
                    name: "cwm config", 
                    desc: "Manage tool configuration (Editors, Markers, etc).", 
                    example: "$ cwm config --editor code\n$ cwm config show\n$ cwm config --gemini" 
                },
                 
                
            ]
        },
        {
            id: "utils",
            title: "Utilities",
            commands: [
                { 
                    id: "ask", 
                    name: "cwm ask", 
                    desc: "Ask AI for command help (Gemini, OpenAI, Local).", 
                    example: "$ cwm ask gemini -s 'how do I undo git commit?'\n$ cwm ask "
                },
                { 
                    id: "git", 
                    name: "cwm git", 
                    desc: "Manage GitHub accounts & SSH keys.", 
                    example: "$ cwm git add\n$ cwm git setup" 
                },
                { 
                    id: "copy", 
                    name: "cwm copy", 
                    desc: "Copy file contents or file trees to clipboard (Context Packer).", 
                    example: "$ cwm copy --format\n$ cwm copy --tree\n$ cwm copy --condense" 
                },
                
                
                { 
                    id: "clear", 
                    name: "cwm clear", 
                    desc: "Clear history, cache, or saved data.", 
                    example: "$ cwm clear --sys-hist\n$ cwm clear --all" 
                },
               
                
            ]
        }
    ]
};