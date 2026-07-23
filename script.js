// Global downloads config, populated from downloads.json
let downloadsConfig = null;
// Currently selected CPU architecture: 'amd64' or 'arm64'
let selectedArch = 'amd64';
// Currently selected version tag (null = latest)
let selectedVersionTag = null;

document.addEventListener('DOMContentLoaded', () => {
    bindThemeButton();
    setupMobileMenu();
    setupMobileSearch(); // Init mobile search logic

    // Initialize based on page
    if (document.getElementById('intro-section')) {
        // === HOME PAGE LOGIC ===
        loadProjectInfo();
        loadDownloads(); // Load downloads.json then populate install section
        renderVersions(); // Render version buttons
        renderSidebar();
        renderContent();
        setupSearch();
    } else if (document.getElementById('doc-render-area')) {
        // === DOCS PAGE LOGIC ===
        renderDocSidebar(); 
        loadDocContent();
        window.addEventListener('popstate', loadDocContent);
    } else if (document.getElementById('templateContainer')) {
        // === TEMPLATES PAGE LOGIC ===
        renderSidebar();
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

    const installCmdEl = document.getElementById('install-cmd');
    if (installCmdEl) {
        installCmdEl.textContent = cwmData.projectInfo.installCommand;
    }

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

// --- DOWNLOADS CONFIG LOADER ---
async function loadDownloads() {
    try {
        const res = await fetch('downloads.json');
        if (!res.ok) throw new Error('Failed to load downloads.json');
        downloadsConfig = await res.json();
        applyDownloads(downloadsConfig.latest);
    } catch (e) {
        console.warn('downloads.json not found, skipping download config.', e);
    }
}

/**
 * Given a version tag (e.g. "v1.0.0"), build the download URL for a package file.
 */
function buildUrl(tag, file) {
    const cfg = downloadsConfig;
    // "latest" tag uses the /latest/ path alias so links always resolve to the newest release
    if (!tag || tag === cfg.latest) {
        return `${cfg.repoBase}/latest/download/${file}`;
    }
    return `${cfg.repoBase}/download/${tag}/${file}`;
}

/**
 * Apply all install commands and download button hrefs for a given version tag.
 * Uses the globally selected architecture (selectedArch).
 * Pass null/undefined to default to the latest tag from downloads.json.
 */
function applyDownloads(versionTag) {
    if (!downloadsConfig) return;
    const tag = versionTag !== undefined ? versionTag : selectedVersionTag;
    selectedVersionTag = tag; // keep in sync
    const pkgs = downloadsConfig.packages;
    const arch = selectedArch; // 'amd64' or 'arm64'

    // Windows
    const win = pkgs.windows[arch];
    if (win) {
        const winUrl = buildUrl(tag, win.file);
        const winCmdEl = document.getElementById('install-windows-cmd');
        const dlWinZip = document.getElementById('dl-win-zip');
        if (winCmdEl) winCmdEl.textContent = win.install_cmd.replace('{url}', winUrl);
        if (dlWinZip) { dlWinZip.href = winUrl; dlWinZip.textContent = win.label; }
    }

    // Linux — deb & rpm for selected arch
    const linuxDeb = pkgs.linux[arch]?.deb;
    const linuxRpm = pkgs.linux[arch]?.rpm;
    const linuxCmdEl = document.getElementById('install-linux-cmd');
    const dlLinuxDeb = document.getElementById('dl-linux-deb');
    const dlLinuxRpm = document.getElementById('dl-linux-rpm');
    if (linuxDeb) {
        const debUrl = buildUrl(tag, linuxDeb.file);
        if (linuxCmdEl) linuxCmdEl.textContent = linuxDeb.install_cmd.replace('{url}', debUrl);
        if (dlLinuxDeb) { dlLinuxDeb.href = debUrl; dlLinuxDeb.textContent = linuxDeb.label; }
    }
    if (linuxRpm) {
        const rpmUrl = buildUrl(tag, linuxRpm.file);
        if (dlLinuxRpm) { dlLinuxRpm.href = rpmUrl; dlLinuxRpm.textContent = linuxRpm.label; }
    }

    // macOS
    const mac = pkgs.macos[arch];
    if (mac) {
        const macUrl = buildUrl(tag, mac.file);
        const macosCmdEl = document.getElementById('install-macos-cmd');
        const dlMacosTar = document.getElementById('dl-macos-tar');
        if (macosCmdEl) macosCmdEl.textContent = mac.install_cmd.replace('{url}', macUrl);
        if (dlMacosTar) { dlMacosTar.href = macUrl; dlMacosTar.textContent = mac.label; }
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
    const versionTag = ver ? `v${ver}` : null; // null = latest
    applyDownloads(versionTag);
    document.querySelectorAll('.ver-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
}

/**
 * Switch selected architecture and refresh all download links.
 */
function switchArch(arch, btnElement) {
    selectedArch = arch;
    document.querySelectorAll('.arch-pill').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
    applyDownloads(selectedVersionTag); // re-apply with new arch
}

function renderSidebar() {
    if(typeof cwmData === 'undefined') return;
    const sidebar = document.getElementById('sidebar');

    const templateHeading = document.createElement('h3');
    templateHeading.textContent = 'Templates';
    sidebar.appendChild(templateHeading);

    const templateLink = document.createElement('a');
    templateLink.href = 'template.html';
    templateLink.className = 'nav-link';
    templateLink.style.color = 'var(--accent)';
    templateLink.style.fontWeight = '600';
    templateLink.textContent = 'CWM Templates';
    sidebar.appendChild(templateLink);
    
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

    const templateHeading = document.createElement('h3');
    templateHeading.textContent = 'Templates';
    sidebar.appendChild(templateHeading);

    const templateLink = document.createElement('a');
    templateLink.href = 'template.html';
    templateLink.className = 'nav-link';
    templateLink.style.color = 'var(--accent)';
    templateLink.style.fontWeight = '600';
    templateLink.textContent = 'CWM Templates';
    sidebar.appendChild(templateLink);

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

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escapeJsString(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '');
}

function scrollToUsageSection() {
    const el = document.getElementById('usage-section');
    if (!el) return;

    const contentContainer = document.querySelector('.content') || document.querySelector('main') || document.querySelector('.doc-content');
    if (contentContainer) {
        const targetPos = el.offsetTop - 30;
        contentContainer.scrollTo({
            top: targetPos,
            behavior: 'smooth'
        });
    } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function loadDocContent() {
    if(typeof cwmDocs === 'undefined') return; 
    const container = document.getElementById('doc-render-area');
    const urlParams = new URLSearchParams(window.location.search);
    let cmdId = urlParams.get('cmd');
    
    if (!cmdId || !cwmDocs[cmdId]) {
        cmdId = 'save';
    }
    
    // Animation reset
    container.classList.remove('fade-in');
    void container.offsetWidth; 
    container.classList.add('fade-in');

    const details = cwmDocs[cmdId];

    if (!details) {
        container.innerHTML = `<h1>Command Not Found</h1><p>Select a command from the sidebar.</p>`;
        return;
    }

    // --- NEW: Generate Subcommands HTML ---
    let subcommandsHtml = '';
    if (details.subcommands && details.subcommands.length > 0) {
        subcommandsHtml = `
        <div class="doc-section">
            <h4>Available Subcommands</h4>
            <table>
                <thead><tr><th>Command</th><th>Description</th></tr></thead>
                <tbody>
                    ${details.subcommands.map(s => `<tr><td class="flag">${s.name}</td><td>${s.desc}</td></tr>`).join('')}
                </tbody>
            </table>
        </div>`;
    }

    // --- Existing: Generate Flags HTML ---
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

    let usageSectionHtml = '';
    if (details.usage && details.usage.length > 0) {
        let cardsHtml = '';
        details.usage.forEach((item, idx) => {
            const escapedCmd = escapeJsString(item.cmd);
            cardsHtml += `
                <div class="tutorial-card">
                    <div class="tutorial-title">${idx + 1}. ${item.title}</div>
                    
                    <div class="tutorial-sublabel">Command (What to run)</div>
                    <div class="syntax-wrapper tutorial-syntax">
                        <div class="syntax-text">$ ${escapeHtml(item.cmd)}</div>
                        <div class="copy-group">
                            <button class="copy-icon-btn" onclick="copyDocSyntax('${escapedCmd}', this)" aria-label="Copy command">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                            <span class="copy-status"></span>
                        </div>
                    </div>

                    <div class="tutorial-sublabel">Expected Result (What to expect)</div>
                    <div class="tutorial-expect-box">${escapeHtml(item.expect)}</div>
                </div>
            `;
        });

        usageSectionHtml = `
            <div class="doc-section" id="usage-section">
                <h4>Usage & Tutorials</h4>
                <div class="tutorial-list">
                    ${cardsHtml}
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="doc-header">
            <div class="doc-header-top">
                <h1>${details.title}</h1>
                <div style="display: flex; gap: 0.6rem; align-items: center;">
                    <button class="see-usage-btn" onclick="scrollToUsageSection()" aria-label="See usage tutorials">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                            <polyline points="2 17 12 22 22 17"></polyline>
                            <polyline points="2 12 12 17 22 12"></polyline>
                        </svg>
                        <span>See Usage</span>
                    </button>
                    <button class="copy-context-btn" onclick="copyFullDocContext('${cmdId}', this)" aria-label="Copy page content">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>Copy Page</span>
                    </button>
                </div>
            </div>
            
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

        ${subcommandsHtml}
        ${flagsHtml}
        ${usageSectionHtml}
    `;
}

function copyFullDocContext(cmdId, btnElement) {
    const details = cwmDocs[cmdId];
    if (!details) return;

    let text = `CWM COMMAND: ${details.title.toUpperCase()}\n`;
    text += `${'='.repeat(70)}\n\n`;
    text += `SYNTAX:\n  $ ${details.syntax}\n\n`;
    text += `SUMMARY:\n  ${details.summary}\n\n`;

    if (details.logic) {
        let cleanLogic = details.logic
            .replace(/<p>(.*?)<\/p>/gi, "$1\n\n")
            .replace(/<ul>/gi, "")
            .replace(/<\/ul>/gi, "\n")
            .replace(/<li>(.*?)<\/li>/gi, "  • $1\n")
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<[^>]+>/g, "");

        text += `DETAILS & LOGIC:\n${cleanLogic.trim()}\n\n`;
    }

    if (details.subcommands && details.subcommands.length > 0) {
        text += `SUBCOMMANDS:\n`;
        details.subcommands.forEach(s => {
            let cleanName = s.name.padEnd(24, ' ');
            let cleanDesc = s.desc.replace(/<[^>]+>/g, "");
            text += `  ${cleanName} ${cleanDesc}\n`;
        });
        text += `\n`;
    }

    if (details.flags && details.flags.length > 0) {
        text += `FLAGS & OPTIONS:\n`;
        details.flags.forEach(f => {
            let cleanName = f.name.padEnd(24, ' ');
            let cleanDesc = f.desc.replace(/<[^>]+>/g, "");
            text += `  ${cleanName} ${cleanDesc}\n`;
        });
        text += `\n`;
    }

    const onSuccess = () => {
        const span = btnElement.querySelector('span');
        const oldText = span ? span.textContent : "Copy Page";
        btnElement.classList.add('copied');
        if (span) span.textContent = "Copied!";
        
        setTimeout(() => {
            btnElement.classList.remove('copied');
            if (span) span.textContent = oldText;
        }, 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text.trim())
            .then(onSuccess)
            .catch(() => fallbackCopyText(text.trim(), onSuccess));
    } else {
        fallbackCopyText(text.trim(), onSuccess);
    }
}

function copyDocSyntax(text, btnElement) {
    const onSuccess = () => {
        btnElement.classList.add('copied');
        btnElement.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27c93f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`;
        setTimeout(() => {
            btnElement.classList.remove('copied');
            btnElement.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>`;
        }, 2000);
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text)
            .then(onSuccess)
            .catch(() => fallbackCopyText(text, onSuccess));
    } else {
        fallbackCopyText(text, onSuccess);
    }
}

// HOME PAGE COPY FUNCTION (Text Button)
function copyCustomCmd(btn, elementId) {
    const text = document.getElementById(elementId).textContent;

    const onSuccess = () => {
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

function switchInstallTab(os) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.install-tab-content').forEach(content => content.classList.remove('active'));
    
    // Set active class on target button
    event.currentTarget.classList.add('active');
    document.getElementById(`install-${os}`).classList.add('active');
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