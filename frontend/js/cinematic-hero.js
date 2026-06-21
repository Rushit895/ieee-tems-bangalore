/**
 * Cinematic Page Hero — shared init for all inner pages
 * (about, execom, branches, blogs, resources, contact, join-ieee, search)
 *
 * Markup contract (per page):
 * <section class="page-hero cine-hero" data-hero-page="about">
 *   <div class="cine-media">
 *     <img class="cine-bg-img" src="" alt="">
 *     <video class="cine-bg-video" autoplay muted loop playsinline></video>
 *   </div>
 *   <div class="cine-overlay"></div>
 *   <div class="hero-center-content">
 *     <span class="cine-label" data-hero-label>Fallback Label</span>
 *     <h1 data-hero-title>Fallback <span>Title</span></h1>
 *     <p data-hero-desc>Fallback description text.</p>
 *   </div>
 *   <div class="cine-scroll-indicator"><span>Scroll</span><div class="cine-scroll-line"></div></div>
 *   <div class="cine-gold-line"></div>
 * </section>
 *
 * Usage: initCinematicHero('about');
 */

function splitHeroTitleWords(el) {
    if (!el || el.dataset.split === 'true') return;
    el.dataset.split = 'true';

    // Walk child nodes, wrap text words in spans, keep existing <span> (gold) intact
    const walk = (node) => {
        Array.from(node.childNodes).forEach(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                const words = child.textContent.split(/(\s+)/).filter(w => w.length);
                const frag = document.createDocumentFragment();
                words.forEach(word => {
                    if (/^\s+$/.test(word)) {
                        frag.appendChild(document.createTextNode(word));
                    } else {
                        const span = document.createElement('span');
                        span.className = 'cine-word';
                        span.textContent = word;
                        frag.appendChild(span);
                    }
                });
                node.replaceChild(frag, child);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                walk(child);
            }
        });
    };
    walk(el);

    // Stagger animation delays
    let i = 0;
    el.querySelectorAll('.cine-word').forEach(span => {
        span.style.animationDelay = `${0.15 + i * 0.07}s`;
        i++;
    });
}

async function initCinematicHero(pageKey) {
    const section = document.querySelector(`[data-hero-page="${pageKey}"]`);
    if (!section) return;

    try {
        const res = await fetch(`${API_BASE_URL}/home/page-content?page=${pageKey}&section=hero`);
        const json = await res.json();
        const data = (json.data && json.data[0]) || null;

        if (data) {
            const titleEl = section.querySelector('[data-hero-title]');
            const labelEl = section.querySelector('[data-hero-label]');
            const descEl = section.querySelector('[data-hero-desc]');

            if (titleEl && data.title) titleEl.innerHTML = data.title;
            if (labelEl && data.subtitle) labelEl.textContent = data.subtitle;
            if (descEl && data.content) descEl.textContent = data.content;

            if (data.image) {
                const imgEl = section.querySelector('.cine-bg-img');
                const videoEl = section.querySelector('.cine-bg-video');
                const url = data.image.startsWith('http') ? data.image : `${BACKEND_BASE}${data.image}`;

                if (data.mediaType === 'video') {
                    section.classList.add('cine-video-mode');
                    if (videoEl) {
                        videoEl.src = url;
                        videoEl.load();
                    }
                } else {
                    section.classList.remove('cine-video-mode');
                    if (imgEl) imgEl.src = url;
                }
            }
        }
    } catch (err) {
        console.error(`[CinematicHero] Failed to load hero for "${pageKey}":`, err);
        // Fallback markup (set in HTML) remains visible
    }

    // Animate title words regardless of API success/failure
    const titleEl = section.querySelector('[data-hero-title]');
    splitHeroTitleWords(titleEl);
}
