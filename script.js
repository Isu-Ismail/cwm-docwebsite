document.addEventListener('DOMContentLoaded', () => {
    bindThemeButton();
    setupMobileMenu();
    setupMobileSearch(); // Init mobile search logic

    // Initialize based on page
    if (document.getElementById('intro-section')) {
        // === HOME PAGE LOGIC ===
        loadProjectInfo();
        renderVersions(); // Render version buttons
        renderSidebar();
        renderContent();
        setupSearch();
    } else if (document.getElementById('doc-render-area')) {
        // === DOCS PAGE LOGIC ===
        renderDocSidebar(); 
        loadDocContent();
         window.addEventListener('popstate', loadDocContent);
    }
});
// Function to load the SVG file and inject it


function bindThemeButton() {
    const btn = document.getElementById('themeToggle');
    // Update the array to include 'forest'
    const themes = ['dark', 'light', 'retro', 'forest','cyberpunk','github-classic'];

    if(btn) {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const currentIndex = themes.indexOf(currentTheme);
            const nextIndex = (currentIndex + 1) % themes.length; // Cycles 0 -> 1 -> 2 -> 3 -> 0
            
            const newTheme = themes[nextIndex];
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// --- MOBILE MENU LOGIC ---
function setupMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar') || document.getElementById('doc-sidebar');
    const overlay = document.getElementById('mobileOverlay');

    if (menuBtn && sidebar && overlay) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
            overlay.classList.add('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
}

// --- MOBILE SEARCH TOGGLE (Updated: Auto Clear) ---
function setupMobileSearch() {
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const searchCloseBtn = document.getElementById('searchCloseBtn');
    const navbar = document.getElementById('mainNavbar');
    const searchInput = document.getElementById('searchInput');

    // Helper function to close search and reset list
    const closeAndClear = () => {
        if (navbar) navbar.classList.remove('search-active');
        if (searchInput) {
            searchInput.value = ''; // Clear text
            // Trigger the search logic to reset the list to full view
            searchInput.dispatchEvent(new Event('keyup')); 
        }
    };

    // Open Search
    if(mobileSearchBtn && navbar) {
        mobileSearchBtn.addEventListener('click', () => {
            navbar.classList.add('search-active');
            setTimeout(() => { if(searchInput) searchInput.focus(); }, 100);
        });
    }

    // Close Search (X button)
    if(searchCloseBtn) {
        searchCloseBtn.addEventListener('click', closeAndClear);
    }

    // Close if clicking content area
    const contentArea = document.querySelector('.content');
    if(contentArea) {
        contentArea.addEventListener('click', () => {
            if(navbar && navbar.classList.contains('search-active')) {
                closeAndClear();
            }
        });
    }
}

function closeMobileMenu() {
    if (window.innerWidth > 768) return;
    const sidebar = document.getElementById('sidebar') || document.getElementById('doc-sidebar');
    const overlay = document.getElementById('mobileOverlay');
    if(sidebar && overlay) {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }
}

// --- HOME PAGE FUNCTIONS ---

function loadProjectInfo() {
    if(typeof cwmData === 'undefined') return;

    document.getElementById('project-title').textContent = cwmData.projectInfo.fullName;
    document.getElementById('project-desc').textContent = cwmData.projectInfo.description;
    document.getElementById('install-cmd').textContent = cwmData.projectInfo.installCommand;

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

// --- VERSION LOGIC ---
function renderVersions() {
    if(typeof cwmData === 'undefined') return;
    const wrapper = document.getElementById('version-wrapper');
    if(!wrapper) return;

    const currentVer = cwmData.projectInfo.version;
    const pkgName = cwmData.projectInfo.package || "cwm-cli";
    const versions = [currentVer, ...(cwmData.projectInfo.old_versions || [])];

    wrapper.innerHTML = '<span class="ver-label">Versions:</span>';

    versions.forEach((v, index) => {
        const btn = document.createElement('button');
        btn.className = 'ver-btn';
        
        if (index === 0) {
            btn.classList.add('active');
            btn.textContent = `${v} (Latest)`;
            btn.onclick = () => updateInstallCmd(pkgName, null, btn);
        } else {
            btn.textContent = v;
            const cleanVer = v.startsWith('v') ? v.substring(1) : v; 
            btn.onclick = () => updateInstallCmd(pkgName, cleanVer, btn);
        }
        
        wrapper.appendChild(btn);
    });
}

function updateInstallCmd(pkg, ver, btnElement) {
    const cmdSpan = document.getElementById('install-cmd');
    
    if (ver) {
        cmdSpan.textContent = `pip install ${pkg}==${ver}`;
    } else {
        cmdSpan.textContent = `pip install ${pkg}`;
    }

    document.querySelectorAll('.ver-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
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
            a.href = `docs.html?cmd=${cmd.id}`; 
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
            card.onclick = () => { window.location.href = `docs.html?cmd=${cmd.id}`; };
            card.style.cursor = "pointer";

            let html = `
                <div class="cmd-header">
                    <div class="cmd-name">${cmd.name}</div>
                    <span class="arrow">→</span>
                </div>
                <p class="cmd-desc">${cmd.desc}</p>
            `;
            if (cmd.example) {
                html += `<pre style="margin-top:1rem; font-size:0.8rem;">${cmd.example}</pre>`;
            }

            card.innerHTML = html;
            container.appendChild(card);
        });
    });
}

// --- SEARCH WITH FIXED SCROLLING ---
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if(!searchInput) return;
    
    let scrollTimeout = null;

    searchInput.addEventListener('keyup', (e) => {
        clearTimeout(scrollTimeout);

        const term = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.cmd-card');
        const sections = document.querySelectorAll('.section-title');
        let firstVisible = null;

        // 1. Filter Cards
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            const isMatch = text.includes(term);
            card.style.display = isMatch ? 'block' : 'none';
            if (isMatch && !firstVisible) firstVisible = card;
        });

        // 2. Hide Empty Sections
        sections.forEach(h2 => {
            let next = h2.nextElementSibling;
            let hasVisibleCards = false;
            while(next && !next.classList.contains('section-title')) {
                if(next.classList.contains('cmd-card') && next.style.display !== 'none') {
                    hasVisibleCards = true;
                    break;
                }
                next = next.nextElementSibling;
            }
            h2.style.display = hasVisibleCards ? 'block' : 'none';
        });

        // 3. Auto-Scroll Logic (FIXED)
        scrollTimeout = setTimeout(() => {
            const contentContainer = document.querySelector('.content');
            
            if (term.length > 0 && firstVisible && contentContainer) {
                let scrollTarget = firstVisible;
                let prev = firstVisible.previousElementSibling;
                while(prev) {
                    if(prev.classList.contains('section-title')) {
                        scrollTarget = prev; 
                        break;
                    }
                    prev = prev.previousElementSibling;
                }

                const rect = scrollTarget.getBoundingClientRect();
                const containerRect = contentContainer.getBoundingClientRect();
                const offset = rect.top - containerRect.top;

                // Scroll the CONTAINER
                contentContainer.scrollBy({
                    top: offset - 20, // 20px buffer
                    behavior: 'smooth'
                });

            } else if (term.length === 0 && contentContainer) {
                contentContainer.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 300); 
    });
    
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
            a.className = `nav-link ${currentCmd === cmd.id ? 'active' : ''}`;
            a.textContent = cmd.name;
            
            a.onclick = (e) => {
                e.preventDefault();
                window.history.pushState({path: cmdUrl}, '', cmdUrl);
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');
                loadDocContent();
                closeMobileMenu();
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
    
    container.classList.remove('fade-in');
    void container.offsetWidth; 
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

function copyDocSyntax(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const statusSpan = btnElement.nextElementSibling;
        statusSpan.textContent = "Copied!";
        statusSpan.classList.add('visible');
        setTimeout(() => {
            statusSpan.classList.remove('visible');
            setTimeout(() => { statusSpan.textContent = ""; }, 300); 
        }, 2000);
    }).catch(err => console.error('Failed to copy:', err));
}

// HOME PAGE COPY FUNCTION (Text Button)
function copyInstall(btn) {
    const text = document.getElementById('install-cmd').textContent;

    const onSuccess = () => {
        const originalHTML = btn.innerHTML;
        // Change logic: If mobile, we might want to show a checkmark icon.
        // For simplicity and robustness, we can change color and maybe text if visible.
        
        btn.classList.add("copied");
        
        // Desktop Text Change
        const textSpan = btn.querySelector('.btn-text');
        if(textSpan) textSpan.textContent = "Copied!";
        
        // Mobile Icon Change (Optional: Make icon Green)
        btn.style.backgroundColor = "#27c93f"; 
        btn.style.color = "#fff";

        setTimeout(() => {
            btn.classList.remove("copied");
            if(textSpan) textSpan.textContent = "Copy";
            btn.style.backgroundColor = ""; 
            btn.style.color = ""; 
        }, 2000);
    };

    // Try Modern API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(onSuccess)
            .catch(() => fallbackCopyText(text, onSuccess));
    } else {
        // Fallback
        fallbackCopyText(text, onSuccess);
    }
}

function fallbackCopyText(text, callback) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) callback();
    } catch (err) {
        console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
}

function slugify(text) {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}
/* =========================================
   LOADING SCREEN LOGIC
   ========================================= */
// window.addEventListener('load', () => {
//     const loader = document.getElementById('loading-screen');
    
//     // Check if loader exists to avoid errors
//     if (loader) {
//         // Optional: Add a small delay (e.g., 500ms) so users can actually see the animation
//         // if your site loads too fast.
//         setTimeout(() => {
//             loader.classList.add('fade-out');
            
//             // Remove it from the DOM entirely after the fade transition finishes
//             setTimeout(() => {
//                 loader.style.display = 'none';
//             }, 500); // Matches the CSS transition time
//         }, 800); // The delay before hiding
//     }
// });

/* =========================================
   LOADING SCREEN LOGIC (TEST MODE)
   ========================================= */
window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    
    if (loader) {
        // CHANGE THIS NUMBER: 3000 = 3 Seconds Delay
        setTimeout(() => {
            loader.classList.add('fade-out');
            
            // Remove from DOM after fade completes
            setTimeout(() => {
                loader.style.display = 'none';
            }, ); 
        }, ); // <--- Increase this to test (e.g., 3000, 5000)
    }
}); 