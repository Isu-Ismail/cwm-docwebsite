/* term_data.js - The scenarios to play */
export const termData = [

    // --- 2. VAULT SAVE ---
    {
        title: "Save Vault Commands",
        desc: "Save commands under variable names. Conflict warning protects you.",
        command: "cwm save test='pytest -vv'",
        output: `
<span class="term-success">Saved test -> pytest -vv</span>

<span class="term-dim">Hint: Run 'cwm get test' to retrieve.</span>
        `
    },

    // --- 3. CONFLICT PROTECTION & EDITING ---
    {
        title: "Conflict Protection",
        desc: "CWM prevents overwriting existing keys unless explicit flags are passed.",
        command: "cwm save test='pytest --lf'",
        output: `
<span class="term-error">Error: Variable 'test' already exists. (Use -e to edit or -ev to rename)</span>
        `
    },

    // --- 4. EXPLICIT EDIT ---
    {
        title: "Explicit Edit",
        desc: "Use the -e flag to overwrite the command alias.",
        command: "cwm save -e test='pytest --lf'",
        output: `
<span class="term-success">Updated test -> pytest --lf</span>
        `
    },

    // --- 5. SEARCH & RETRIEVAL ---
    {
        title: "Fuzzy History Search",
        desc: "Search logged executions and copy commands directly to clipboard.",
        command: "cwm get -h -f 'git,commit'",
        output: `
<span class="term-accent">History Logs (Path: c:\\Users\\ismail\\cwm)</span>
<span class="term-accent">[1]</span> git commit -m "feat: setup GoReleaser"
<span class="term-accent">[2]</span> git commit -m "fix: database schema"
<span class="term-accent">[3]</span> git add . && git commit -m "update docs"

<span class="term-dim">---</span>
Copy (ID): 1
<span class="term-success">✔ Copied command #1 -> git commit -m "feat: setup GoReleaser"</span>
        `
    },

    // --- 6. MULTI-PC SYNC ---
    {
        title: "Two-Way Multi-PC Sync",
        desc: "Setup shared path copy bank for instant two-way SQLite database merges.",
        command: "cwm config -c 'Z:/Shared/cwm.db'",
        output: `
<span class="term-success">Set copy bank path: Z:/Shared/cwm.db</span>
<span class="term-dim">Performing initial two-way SQL merge...</span>
<span class="term-success">✔ Synchronization complete! Merged 15 variables, 342 history entries.</span>
        `
    }
];