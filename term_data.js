/* term_data.js - The scenarios to play */
export const termData = [
    // --- 1. INSTALLATION ---
    {
        title: "Install CWM",
        desc: "Get started instantly via pip.",
        command: "pip install cwm-cli",
        output: `
<span class="term-dim">Collecting cwm-cli</span>
<span class="term-dim">Downloading cwm_cli-1.1.0-py3-none-any.whl (45 kB)</span>
<span class="term-dim">Installing collected packages: click, rich, pyperclip, cwm-cli</span>
<span class="term-success">Successfully installed cwm-cli-1.1.0</span>
        `
    },

    // --- 2. JUMP (Navigation) ---
    {
        title: "Project Teleporter",
        desc: "Jump to a project using fuzzy matching. Opens Editor & Terminal instantly.",
        command: "cwm jump api -t",
        output: `
<span class="term-success">✔</span> Found project: <span class="term-blue-bold">my-backend-api</span>
<span class="term-dim">@ C:\Users\Dev\work\my-backend-api</span>

<span class="term-accent">i</span> Launching Editor...
<span class="term-accent">i</span> Launching Terminal...
<span class="term-dim">Done.</span>
        `
    },

    // --- 3. SCAN (Discovery) ---
    {
        title: "Auto-Discovery",
        desc: "Scan your drive to find and register projects automatically.",
        command: "cwm project scan",
        output: `
<span class="term-bold">Starting scan in:</span> /home/user/dev
<span class="term-accent">Scanning... (42 folders)</span> <span class="term-dim">.../dev/node_modules</span>

<span class="term-dim">Scan Summary: Checked 150 folders in 0.4s.</span>
<span class="term-success">✔ Found 2 candidates.</span>

Candidate: <span class="term-accent">react-dashboard</span>
Add project? [y/n/s]: y
 <span class="term-accent">?</span> Enter Project Alias: <span class="term-white-bold">dash</span>
<span class="term-green">-> Saved as 'dash'</span>

<span class="term-success">Saved 1 new projects!</span>
        `
    },

    // --- 4. SAVE (Vault) ---
    {
        title: "Save Variables",
        desc: "Save complex commands with aliases for easy reuse.",
        command: "cwm save build=\"npm run build --prod\"",
        output: `
<span class="term-success">✔</span> Saved variable: <span class="term-accent">build</span>
<span class="term-dim">Value: "npm run build --prod"</span>

<span class="term-dim">Tip: Run it with</span> <span class="term-cmd">cwm get build</span>
        `
    },

    // --- 5. GET (Search) ---
    {
        title: "Deep History Search",
        desc: "Filter your shell history and copy commands instantly.",
        command: "cwm get --hist -f \"docker,run\" -ex \"fail\"",
        output: `
<span class="term-accent">History (3/500)</span>
<span class="term-accent">[1]</span> <span class="term-green">docker run -d -p 80:80 nginx</span>
<span class="term-accent">[2]</span> <span class="term-green">docker run --rm -it ubuntu bash</span>
<span class="term-accent">[3]</span> <span class="term-green">docker compose up --build</span>

<span class="term-dim">---</span>
Copy (ID): 1
<span class="term-success">✔ Copied command #1 -></span> <span class="term-accent">docker run -d -p 80:80 nginx</span>
        `
    },

    // --- 6. COPY (Context Packer) ---
    {
        title: "Context Packer for AI",
        desc: "Pack project files into your clipboard to paste into LLMs.",
        command: "cwm copy 1,4 --format",
        output: `
<span class="term-bold">Processing 2 files...</span>
 <span class="term-dim">Packing:</span> src/utils.py
 <span class="term-dim">Packing:</span> src/main.py

<span class="term-success">✔ Copied 2 files to clipboard. [Formatted]</span>
        `
    },

    // --- 7. RUN (Orchestrator) ---
    {
        title: "Process Orchestrator",
        desc: "Run a group of projects (microservices) in the background.",
        command: "cwm run group backend",
        output: `
<span class="term-bold">Starting group 'backend'...</span>
 <span class="term-success">✔</span> <span class="term-white-bold">api-gateway    </span>: Started (PID 1204)
 <span class="term-success">✔</span> <span class="term-white-bold">auth-service   </span>: Started (PID 1205)
 <span class="term-success">✔</span> <span class="term-white-bold">db-worker      </span>: Started (PID 1206)

        `
    },

    // --- 8. ASK (AI Assistant) ---
    {
        title: "AI Assistant",
        desc: "Ask Gemini or OpenAI coding questions directly in the terminal.",
        command: "cwm ask gemini -s \"kill port 3000\"",
        output: `
<span class="term-purple">Model:</span> gemini
<span class="term-purple">DevBot:</span> <span class="term-orange">id:1</span>
To kill the process on port 3000:

<span class="term-cmd">npx kill-port 3000</span>

Or on Windows:
<span class="term-cmd">netstat -ano | findstr :3000</span>
<span class="term-cmd">taskkill /PID &lt;PID&gt; /F</span>
        `
    },

    // --- 9. GIT (Multi-Account) ---
    {
        title: "Git Account Switcher",
        desc: "Configure local repos with specific SSH keys and user emails.",
        command: "cwm git setup",
        output: `
<span class="term-accent">? Select Account:</span>
 <span class="term-accent">1)</span> Work <span class="term-dim">(github-work)</span>
 <span class="term-accent">2)</span> Personal <span class="term-dim">(github-personal)</span>

<span class="term-dim">Enter number:</span> 1
<span class="term-accent">Configuring local repo settings...</span>
 <span class="term-success">✔ User set to John Doe &lt;john@work.com&gt;</span>
 <span class="term-success">✔ Remote updated to use alias.</span>
        `
    },

    // --- 10. CLEAN (Maintenance) ---
    {
        title: "History Cleaning",
        desc: "Deduplicate and clean up your shell history file.",
        command: "cwm clear --sys-hist --apply",
        output: `
<span class="term-accent">[1/4]</span> Locating history file...
<span class="term-accent">[3/4]</span> Deduplicating (keep newest)...
<span class="term-accent">[4/4]</span> Filtering & validating...

<span class="term-success">✔ Cleaning complete!</span>
 <span class="term-dim">Saved preview to: .bash_history_cleaned</span>
 <span class="term-dim">Removed:</span> <span class="term-error">12</span> <span class="term-dim">(invalid)</span>

<span class="term-success">✔ File .bash_history successfully updated!</span>
        `
    }
];