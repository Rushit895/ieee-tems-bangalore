/**
 * search.js — IEEE TEMS Bangalore inline search dropdown
 * Loaded after navbar.js injects the navbar component.
 * Depends on: apiFetch() from api.js (must be loaded first).
 */
(function () {
    'use strict';

    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function initSearch() {
        const searchInput = document.getElementById('nav-search-input');
        if (!searchInput) return; // navbar not yet injected — will retry

        // Prevent the form from navigating to search.html
        const form = document.getElementById('nav-search-form');
        if (form) {
            form.addEventListener('submit', (e) => e.preventDefault());
        }

        // Build dropdown and insert after the input's parent
        const searchBox = searchInput.closest('.search-box');
        if (!searchBox) return;
        searchBox.style.position = 'relative';

        const dropdown = document.createElement('div');
        dropdown.id = 'search-results-dropdown';
        dropdown.className = 'search-dropdown hidden';
        dropdown.innerHTML = `
            <div id="search-loading" class="search-loading hidden">
                <span class="search-spinner"></span> Searching...
            </div>
            <div id="search-results-list"></div>
            <div id="search-no-results" class="search-no-results-msg hidden">
                No results found for "<span id="search-query-display"></span>"
            </div>
        `;
        searchBox.appendChild(dropdown);

        async function performSearch(query) {
            const q = query.trim();
            if (q.length < 2) {
                dropdown.classList.add('hidden');
                return;
            }

            dropdown.classList.remove('hidden');
            document.getElementById('search-loading').classList.remove('hidden');
            document.getElementById('search-results-list').innerHTML = '';
            document.getElementById('search-no-results').classList.add('hidden');

            try {
                const res = await apiFetch(`/search?q=${encodeURIComponent(q)}`);
                document.getElementById('search-loading').classList.add('hidden');

                if (!res) throw new Error('No response from search API');

                // Handle both response shapes:
                // New shape: { status:'success', data:{ results:[], total:N } }
                // Old shape: { events:[], branches:[], team:[], blogs:[], exams:[] }
                let results = [];
                if (res.status === 'success' && res.data && Array.isArray(res.data.results)) {
                    results = res.data.results;
                } else if (res.events || res.branches || res.team || res.blogs || res.exams) {
                    // Flatten old shape into normalized array
                    const UPLOADS = '/uploads/';
                    results = [
                        ...(res.events || []).map(e => ({
                            type: 'Event', icon: '📅',
                            title: e.title, description: '',
                            link: 'events.html'
                        })),
                        ...(res.branches || []).map(b => ({
                            type: 'Student Branch', icon: '🏫',
                            title: b.title, description: b.city || '',
                            link: 'branches.html'
                        })),
                        ...(res.team || []).map(t => ({
                            type: 'Team Member', icon: '👤',
                            title: t.title, description: t.role || '',
                            link: 'execom.html'
                        })),
                        ...(res.blogs || []).map(b => ({
                            type: 'Blog', icon: '📝',
                            title: b.title, description: b.category || '',
                            link: `blog-detail.html?id=${b.id}`
                        })),
                        ...(res.exams || []).map(e => ({
                            type: 'Exam', icon: '📄',
                            title: e.title, description: '',
                            link: 'past-exams.html'
                        }))
                    ];
                }

                const list = document.getElementById('search-results-list');

                if (results.length > 0) {
                    list.innerHTML = results.map(item => `
                        <div class="search-result-item" onclick="window.location.href='${item.link}'">
                            <div class="search-result-icon">${item.icon}</div>
                            <div class="search-result-text">
                                <div class="search-result-type">${item.type}</div>
                                <div class="search-result-title">${item.title || ''}</div>
                                ${item.description ? `<div class="search-result-desc">${item.description}</div>` : ''}
                            </div>
                        </div>
                    `).join('');
                } else {
                    document.getElementById('search-query-display').textContent = q;
                    document.getElementById('search-no-results').classList.remove('hidden');
                }

            } catch (err) {
                console.error('[Search]', err.message);
                document.getElementById('search-loading').classList.add('hidden');
                document.getElementById('search-query-display').textContent = q;
                document.getElementById('search-no-results').classList.remove('hidden');
            }
        }

        const debouncedSearch = debounce(function () {
            performSearch(searchInput.value);
        }, 300);

        searchInput.addEventListener('input', debouncedSearch);

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(searchInput.value);
            }
            if (e.key === 'Escape') {
                dropdown.classList.add('hidden');
            }
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length >= 2) {
                performSearch(searchInput.value);
            }
        });

        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    }

    // The navbar is injected asynchronously by navbar.js.
    // Poll until the input exists (max ~2s), then init.
    let attempts = 0;
    const poll = setInterval(() => {
        attempts++;
        if (document.getElementById('nav-search-input')) {
            clearInterval(poll);
            initSearch();
        } else if (attempts > 40) {
            clearInterval(poll);
        }
    }, 50);
})();
