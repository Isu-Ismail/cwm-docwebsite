document.addEventListener('DOMContentLoaded', () => {
    // Theme is already set in Head, just bind the button logic
    bindThemeButton();

    // Check which page we are on by looking for unique elements
    if (document.getElementById('intro-section')) {
        // === HOME PAGE LOGIC ===
        loadProjectInfo();
        renderSidebar();
        renderContent();
        setupSearch();
    } else if (document.getElementById('doc-render-area')) {
        // === DOCS PAGE LOGIC ===
        renderDocSidebar(); 
        loadDocContent();
        
        // Handle Browser Back/Forward buttons for SPA feel
        window.addEventListener('popstate', loadDocContent);
    }
});

// --- THEME TOGGLE ---
function bindThemeButton() {
    const btn = document.getElementById('themeToggle');
    if(btn) {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// --- HOME PAGE FUNCTIONS ---

function loadProjectInfo() {
    if(typeof cwmData === 'undefined') return;

    document.getElementById('project-title').textContent = cwmData.projectInfo.fullName;
    document.getElementById('project-desc').textContent = cwmData.projectInfo.description;
    document.getElementById('install-cmd').textContent = cwmData.projectInfo.installCommand;

    // Render Alerts
    const alertContainer = document.getElementById('alert-container');
    if(alertContainer) {
        alertContainer.innerHTML = '';
        cwmData.alerts.forEach(alert => {
            const div = document.createElement('div');
            div.className = `alert-box alert-${alert.type}`;
            div.innerHTML = `<span class="alert-title">${alert.title}</span>${alert.text}`;
            alertContainer.appendChild(div);
        });
    }
}

function renderSidebar() {
    if(typeof cwmData === 'undefined') return;
    const sidebar = document.getElementById('sidebar');
    
    cwmData.categories.forEach(cat => {
        const h3 = document.createElement('h3');
        h3.textContent = cat.title;
        sidebar.appendChild(h3);
        cat.commands.forEach(cmd => {
            const a = document.createElement('a');
            a.href = `docs.html?cmd=${cmd.id}`; // Standard link to docs page
            a.className = 'nav-link';
            a.textContent = cmd.name;
            sidebar.appendChild(a);
        });
    });
}

function renderContent() {
    if(typeof cwmData === 'undefined') return;
    const container = document.getElementById('docs-container');
    
    cwmData.categories.forEach(cat => {
        const sectionTitle = document.createElement('h2');
        sectionTitle.className = 'section-title';
        sectionTitle.textContent = cat.title;
        container.appendChild(sectionTitle);

        cat.commands.forEach(cmd => {
            const card = document.createElement('div');
            card.className = 'cmd-card';
            // Link entire card to Docs
            card.onclick = () => { window.location.href = `docs.html?cmd=${cmd.id}`; };
            card.style.cursor = "pointer";

            let html = `
                <div class="cmd-header">
                    <div class="cmd-name">${cmd.name}</div>
                    <span class="arrow">→</span>
                </div>
                <p class="cmd-desc">${cmd.desc}</p>
            `;
            
            // Show example code block in card if available
            if (cmd.example) {
                html += `<pre style="margin-top:1rem; font-size:0.8rem;">${cmd.example}</pre>`;
            }

            card.innerHTML = html;
            container.appendChild(card);
        });
    });
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if(!searchInput) return;
    
    searchInput.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.cmd-card');
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            // Toggle visibility based on search match
            card.style.display = text.includes(term) ? 'block' : 'none';
        });
    });
    
    // Add 'slash' shortcut to focus search
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// --- DOCS PAGE FUNCTIONS ---

function renderDocSidebar() {
    if(typeof cwmData === 'undefined') return;
    const sidebar = document.getElementById('doc-sidebar');
    const urlParams = new URLSearchParams(window.location.search);
    const currentCmd = urlParams.get('cmd');

    cwmData.categories.forEach(cat => {
        const h3 = document.createElement('h3');
        h3.textContent = cat.title;
        sidebar.appendChild(h3);
        cat.commands.forEach(cmd => {
            const a = document.createElement('a');
            const cmdUrl = `docs.html?cmd=${cmd.id}`;
            a.href = cmdUrl;
            // Highlight active link
            a.className = `nav-link ${currentCmd === cmd.id ? 'active' : ''}`;
            a.textContent = cmd.name;
            
            // SPA LINK HANDLING: Prevent full page reload
            a.onclick = (e) => {
                e.preventDefault();
                // Update URL in browser address bar without reloading
                window.history.pushState({path: cmdUrl}, '', cmdUrl);
                
                // Update active state in sidebar UI
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');

                // Load content manually
                loadDocContent();
            };

            sidebar.appendChild(a);
        });
    });
}

function loadDocContent() {
    if(typeof cwmDocs === 'undefined') return; 
    const container = document.getElementById('doc-render-area');
    const urlParams = new URLSearchParams(window.location.search);
    const cmdId = urlParams.get('cmd');
    
    // ANIMATION RESET: Remove class, trigger reflow, add back to restart animation
    container.classList.remove('fade-in');
    void container.offsetWidth; // force reflow magic
    container.classList.add('fade-in');

    const details = cwmDocs[cmdId];

    if (!details) {
        container.innerHTML = `<h1>Command Not Found</h1><p>Select a command from the sidebar.</p>`;
        return;
    }

    let flagsHtml = '';
    if (details.flags && details.flags.length > 0) {
        flagsHtml = `
        <div class="doc-section">
            <h4>Flags & Options</h4>
            <table>
                <thead><tr><th>Flag</th><th>Description</th></tr></thead>
                <tbody>
                    ${details.flags.map(f => `<tr><td class="flag">${f.name}</td><td>${f.desc}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>`;
    }

    container.innerHTML = `
        <div class="doc-header">
            <h1>${details.title}</h1>
            
            <div class="syntax-wrapper">
                <div class="syntax-text">$ ${details.syntax}</div>
                <div class="copy-group">
                    <button class="copy-icon-btn" onclick="copyDocSyntax('${details.syntax}', this)" aria-label="Copy to clipboard">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                    <span class="copy-status"></span>
                </div>
            </div>

            <p class="doc-summary">${details.summary}</p>
        </div>

        <div class="doc-section">
            <h4>How it works (Under the hood)</h4>
            <div class="logic-content">${details.logic}</div>
        </div>

        ${flagsHtml}
    `;
}

// --- UTILITIES & COPY FUNCTIONS ---

// 1. DOCS COPY FUNCTION (Icon Button)
function copyDocSyntax(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const statusSpan = btnElement.nextElementSibling;
        statusSpan.textContent = "Copied!";
        statusSpan.classList.add('visible');
        
        // Hide message after 2 seconds
        setTimeout(() => {
            statusSpan.classList.remove('visible');
            setTimeout(() => { statusSpan.textContent = ""; }, 300); 
        }, 2000);
    }).catch(err => console.error('Failed to copy:', err));
}

// 2. HOME PAGE COPY FUNCTION (Text Button)
function copyInstall(btn) {
    const text = document.getElementById('install-cmd').textContent;
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.textContent;
        
        // Visual feedback
        btn.textContent = "Copied!";
        btn.style.backgroundColor = "#27c93f"; // Optional green flash
        
        // Revert after 2 seconds
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = ""; // Revert color
        }, 2000);
    }).catch(err => console.error('Failed to copy:', err));
}

function slugify(text) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}