const loadComponent = (id, path, callback) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    fetch(path)
        .then(res => res.text())
        .then(data => {
            element.innerHTML = data;
            if (callback) callback();
            if (id === 'navbar-placeholder') highlightActiveLink();
        })
        .catch(err => console.error(`Error loading component ${path}:`, err));
};

function setupNavbar() {
    const menuToggle = document.getElementById('mobile-toggle');
    const navBottom = document.querySelector('.nav-bottom');
    const dropdowns = document.querySelectorAll('.dropdown');
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-box button');

    const handleSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
    };

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }

    if (menuToggle && navBottom) {
        const backdrop = document.getElementById('nav-backdrop');
        const closeBtn = document.getElementById('mobile-close');

        const openMenu = () => {
            navBottom.classList.add('active');
            menuToggle.classList.add('active');
            if (backdrop) backdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
        const closeMenu = () => {
            navBottom.classList.remove('active');
            menuToggle.classList.remove('active');
            if (backdrop) backdrop.classList.remove('active');
            document.body.style.overflow = '';
        };

        menuToggle.addEventListener('click', () => {
            navBottom.classList.contains('active') ? closeMenu() : openMenu();
        });
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        if (backdrop) backdrop.addEventListener('click', closeMenu);

        // Close menu when clicking a nav link
        navBottom.querySelectorAll('.nav-links > li > a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Mobile Dropdown Toggle
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        const [path, hash] = href.split('#');
        
        // Exact path match or (index.html if path is empty)
        if (path === currentPath || (currentPath === 'index.html' && path === '')) {
            // If the link has a hash, it must match the current hash
            if (hash) {
                if ('#' + hash === currentHash) {
                    link.parentElement.classList.add('active');
                }
            } else {
                // If it's a general page link (no hash), don't highlight if we are on a specific anchor 
                // UNLESS it's the main page link itself
                if (!currentHash || link.classList.contains('dropdown-toggle')) {
                    link.parentElement.classList.add('active');
                }
            }

            // If it's a dropdown item, also highlight the parent
            const dropdownParent = link.closest('.dropdown');
            if (dropdownParent) {
                dropdownParent.classList.add('active-parent');
            }
        }
    });
}

const setupFooter = async () => {
    const socialContainer = document.getElementById('footer-social-links');
    const contactContainer = document.querySelector('.main-footer .contact-info');
    
    // 1. Render Social Links
    if (socialContainer) {
        try {
            const res = await API.getHome('social-links');
            if (res && res.status === 'success' && res.data.length > 0) {
                socialContainer.innerHTML = res.data.sort((a,b) => a.order - b.order).map(social => `
                    <a href="${social.url}" target="_blank" aria-label="${social.platform}">
                        <i class="${social.icon}"></i>
                    </a>
                `).join('');
            }
        } catch (e) { console.error(e); }
    }

    // 2. Render Contact Info
    if (contactContainer) {
        try {
            const res = await API.getHome('contact-info');
            if (res && res.status === 'success' && res.data.length > 0) {
                // We pick primary items for footer (one email, one address)
                const email = res.data.find(i => i.type === 'email');
                const address = res.data.find(i => i.type === 'address');
                
                let html = '';
                if (email) {
                    html += `
                        <li>
                            <i class="fas fa-envelope"></i>
                            <a href="mailto:${email.value}">${email.value}</a>
                        </li>
                    `;
                }
                if (address) {
                    html += `
                        <li>
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${address.value}</span>
                        </li>
                    `;
                }
                if (html) contactContainer.innerHTML = html;
            }
        } catch (e) { console.error(e); }
    }

    // 3. Dynamic Copyright Year
    const copyright = document.querySelector('.copyright');
    if (copyright) {
        copyright.innerHTML = `&copy; ${new Date().getFullYear()} IEEE TEMS Bangalore Section. All rights reserved.`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar-placeholder', 'components/navbar.html', setupNavbar);
    loadComponent('footer-placeholder', 'components/footer.html', setupFooter);
});
