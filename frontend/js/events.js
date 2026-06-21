document.addEventListener('DOMContentLoaded', () => {
    let allEvents = [];
    let filteredEvents = [];
    let currentTab = 'upcoming'; // 'upcoming' or 'past'
    let currentCategory = 'All';
    let searchQuery = '';
    const itemsPerPage = 6;
    let currentPage = 1;

    const eventsContainer = document.getElementById('events-container');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const filterChips = document.querySelectorAll('.filter-chip');
    const searchInput = document.getElementById('event-search');
    const paginationContainer = document.getElementById('pagination');

    const UPLOADS_BASE = BACKEND_BASE + '/uploads/';

    const defaultEvents = [
        { _id: 'def1', title: 'TEMSCON 2026: Global Innovation Summit', description: 'Our annual flagship conference bringing together the brightest minds in tech management.', date: '2026-10-15', location: 'The Leela Palace, Bangalore', category: 'Conferences', image: 'https://images.unsplash.com/photo-1540575861501-7c00117fb3c8?w=600&q=80' },
        { _id: 'def2', title: 'Strategic Leadership Workshop', description: 'A hands-on session for mid-level managers on agile governance and leading technical teams.', date: '2026-05-20', location: 'Online / Zoom', category: 'Workshops', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80' },
        { _id: 'def3', title: 'Project Management Proficiency', description: 'Foundational talk on managing complex technical projects and delivering results on time.', date: '2025-12-10', location: 'IISc Bangalore', category: 'Talks', image: 'https://images.unsplash.com/photo-1454165833767-131438967b21?w=600&q=80' }
    ];

    const init = async () => {
        try {
            const res = await API.getEvents();
            if (res && res.status === 'success' && res.data && res.data.length > 0) {
                allEvents = res.data.map(e => ({
                    ...e,
                    image: e.image ? (e.image.startsWith('http') || e.image.startsWith('assets') ? e.image : `${UPLOADS_BASE}${e.image}`) : null
                }));
            } else {
                allEvents = defaultEvents;
            }
        } catch (error) {
            console.error("Failed to fetch events:", error);
            allEvents = defaultEvents;
        }
        
        applyFilters();
    };

    const applyFilters = () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); 
        
        filteredEvents = allEvents.filter(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            const isUpcoming = eventDate >= now;
            
            if (currentTab === 'upcoming' && !isUpcoming) return false;
            if (currentTab === 'past' && isUpcoming) return false;
            
            if (currentCategory !== 'All') {
                const cat = (event.category || '').toLowerCase().trim();
                const target = currentCategory.toLowerCase().trim();
                if (cat !== target && cat + 's' !== target) return false;
            }
            
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!event.title.toLowerCase().includes(q) && !event.description.toLowerCase().includes(q)) return false;
            }
            return true;
        });

        currentPage = 1;
        renderEvents();
        renderPagination();
    };

    const renderEvents = () => {
        const start = (currentPage - 1) * itemsPerPage;
        const pageEvents = filteredEvents.slice(start, start + itemsPerPage);

        if (pageEvents.length === 0) {
            eventsContainer.innerHTML = `<div class="empty-state-events"><p>No ${currentTab} events found matching your criteria.</p></div>`;
            return;
        }

        eventsContainer.innerHTML = pageEvents.map((e, index) => {
            const placeholderImages = [
                'https://images.unsplash.com/photo-1511578191439-44c352392391?w=600&q=80',
                'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80',
                'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80'
            ];
            const imgSrc = e.image || placeholderImages[index % placeholderImages.length];

            const dateStr = new Date(e.date).toLocaleDateString('en-US', {month:'short', day:'2-digit', year:'numeric'});
            return `
            <div class="event-card-redesigned" onclick="openEventModal('${e._id || e.title}')">
                <div class="event-card-bg" style="background-image:url('${imgSrc}')"></div>
                <div class="event-card-shade"></div>
                <span class="event-cat-chip">${e.category || 'Event'}</span>
                <div class="event-card-glass">
                    <span class="event-date"><i class="far fa-calendar"></i> ${dateStr}</span>
                    <h3>${e.title}</h3>
                </div>
            </div>
        `}).join('');
    };
    
    window.openEventModal = (id) => {
        const e = allEvents.find(x => (x._id === id || x.title === id));
        if (!e) return;
        document.getElementById('modal-event-title').textContent = e.title;
        document.getElementById('modal-event-cat').textContent = e.category;
        document.getElementById('modal-event-date').textContent = new Date(e.date).toLocaleDateString('en-US', {month:'long', day:'numeric', year:'numeric'});
        
        const locItem = document.getElementById('modal-event-loc');
        locItem.textContent = e.location || '';
        locItem.closest('.meta-item').style.display = e.location ? 'flex' : 'none';

        const orgItem = document.getElementById('modal-event-org');
        orgItem.textContent = e.organizer || '';
        orgItem.closest('.meta-item').style.display = e.organizer ? 'flex' : 'none';
        document.getElementById('modal-event-desc').textContent = e.description;
        
        const img = document.getElementById('modal-event-img');
        if (e.image) { img.src = e.image; img.parentElement.style.display = 'block'; }
        else { img.parentElement.style.display = 'none'; }

        const regBtn = document.getElementById('modal-event-reg');
        const moreBtn = document.getElementById('modal-event-more');
        
        if (e.registerLink) {
            regBtn.href = e.registerLink;
            regBtn.style.display = 'inline-block';
        } else {
            regBtn.style.display = 'none';
        }

        if (e.moreInfoLink) {
            moreBtn.href = e.moreInfoLink;
            moreBtn.style.display = 'inline-block';
        } else {
            moreBtn.style.display = 'none';
        }

        document.getElementById('event-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    document.getElementById('close-event-modal').addEventListener('click', () => {
        document.getElementById('event-modal').classList.remove('active');
        document.body.style.overflow = '';
    });

    document.getElementById('event-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('event-modal')) {
            document.getElementById('event-modal').classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.getElementById('event-modal').classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
        if (totalPages <= 1) { paginationContainer.innerHTML = ''; return; }
        let html = '';
        for (let i = 1; i <= totalPages; i++) html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        paginationContainer.innerHTML = html;
        paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.dataset.page);
                renderEvents();
                renderPagination();
                window.scrollTo({ top: eventsContainer.offsetTop - 150, behavior: 'smooth' });
            });
        });
    };

    tabBtns.forEach(btn => btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active');
        currentTab = btn.dataset.tab; applyFilters();
    }));

    filterChips.forEach(chip => chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active')); chip.classList.add('active');
        currentCategory = chip.dataset.category; applyFilters();
    }));

    searchInput.addEventListener('input', (e) => { searchQuery = e.target.value; applyFilters(); });

    const handleDeepLinking = () => {
        const params = new URLSearchParams(window.location.search);
        const eventId = params.get('id');
        if (eventId) {
            setTimeout(() => window.openEventModal(eventId), 500);
        }
    };

    init().then(handleDeepLinking);
});