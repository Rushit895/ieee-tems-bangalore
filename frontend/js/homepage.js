/* --- HIGH-END HOMEPAGE LOGIC --- */

function initSlider() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    // Initialize first slide
    slides[0].classList.add('active');

    const nextSlide = () => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    };

    // Auto-advance
    let slideInterval = setInterval(nextSlide, 6000);

    // Optional: Add manual controls logic here if buttons exist
}

function initCounters() {
    const counters = document.querySelectorAll('.count');
    const speed = 100;

    const startCounter = (counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    // Use Intersection Observer for Counters
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

function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing after reveal
                // revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    reveals.forEach(reveal => revealObserver.observe(reveal));
}

function initTicker() {
    const wrapper = document.querySelector('.ticker-wrapper');
    if (!wrapper) return;

    // Clone ticker content for seamless loop
    const clone = wrapper.innerHTML;
    wrapper.innerHTML += clone;

    // Adjust animation speed based on content width
    const width = wrapper.scrollWidth / 2;
    wrapper.style.setProperty('--ticker-width', `${width}px`);
}

// Export for main.js
window.initHomePageFeatures = () => {
    initSlider();
    initCounters();
    initScrollReveal();
    initTicker();
};