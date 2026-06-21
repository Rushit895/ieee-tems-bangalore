// Page Loader
function initPageLoader() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 500);
        }, 300);
    });
}

// Animated Counters
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    const speed = 200;

    const startCounter = (counter) => {
        const targetAttr = counter.getAttribute('data-target');
        const target = +targetAttr;
        const count = +counter.innerText;
        const inc = Math.max(1, target / speed);

        const updateCount = () => {
            const currentCount = +counter.innerText;
            if (currentCount < target) {
                counter.innerText = Math.ceil(currentCount + inc);
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = targetAttr.includes('+') ? target + '+' : target;
            }
        };
        updateCount();
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// Scroll Reveal Animation
function scrollReveal() {
    const reveals = document.querySelectorAll('.reveal:not(.active)');
    if (reveals.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => observer.observe(reveal));
}

// Global Empty State Generator
function createEmptyState(message, icon = 'fas fa-info-circle') {
    return `
        <div class="empty-state reveal" style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
            <div class="empty-icon" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.2;">
                <i class="${icon}"></i>
            </div>
            <h3 style="font-size: 1.25rem; color: var(--ieee-navy); margin-bottom: 8px;">No Information Available</h3>
            <p style="font-size: 0.95rem; max-width: 400px; margin: 0 auto;">${message}</p>
        </div>
    `;
}

// Back to Top Button
function initBackToTop() {
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initPageLoader();
    animateCounters();
    scrollReveal();
    initBackToTop();
});

// Export for dynamic content
window.animateCounters = animateCounters;
window.scrollReveal = scrollReveal;

// Styles for loader and back-to-top (injected via JS)
const extraStyles = `
#page-loader {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: #ffffff; display: flex; align-items: center; justify-content: center;
    z-index: 9999; transition: opacity 0.5s ease;
}
#page-loader.fade-out { opacity: 0; pointer-events: none; }
.loader-spinner {
    width: 50px; height: 50px; border: 4px solid var(--ieee-grey);
    border-top: 4px solid var(--ieee-blue); border-radius: 50%;
    animation: spin 1s linear infinite;
}
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

#back-to-top {
    position: fixed; bottom: 130px; right: 28px; width: 50px; height: 50px;
    background: var(--ieee-blue); color: white; border: none; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; opacity: 0; visibility: hidden; transition: 0.3s;
    z-index: 1000; box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
#back-to-top.visible { opacity: 1; visibility: visible; }
#back-to-top:hover { transform: translateY(-5px); background: var(--ieee-royal-blue); }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = extraStyles;
document.head.appendChild(styleSheet);
