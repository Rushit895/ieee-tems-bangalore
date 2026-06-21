// ── Backend endpoint configuration ──────────────────────────────────────
// Single source of truth for the backend URL across the whole site.
// Local dev (localhost / 127.0.0.1) auto-targets the local backend; any other
// host uses the deployed production backend. Update PRODUCTION_BACKEND ONCE
// after the backend is deployed (e.g. the Render URL) — nothing else changes.
const PRODUCTION_BACKEND = 'https://CHANGE-ME.onrender.com'; // TODO: set to deployed backend URL
const __isLocalHost = ['localhost', '127.0.0.1', '0.0.0.0', ''].includes(location.hostname);
const BACKEND_BASE  = __isLocalHost ? 'http://localhost:5000' : PRODUCTION_BACKEND;
const API_BASE_URL  = `${BACKEND_BASE}/api`;

async function apiFetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) throw new Error(`HTTP ${response.status} on ${endpoint}`);
        const data = await response.json();
        console.log(`[API] ${endpoint}:`, data);
        return data;
    } catch (error) {
        console.error(`[API ERROR] ${endpoint}:`, error.message);
        return null;
    }
}

// Resolve any media path to a full URL
function resolveUrl(raw) {
    if (!raw) return '';
    if (raw.startsWith('http')) return raw;
    if (raw.startsWith('/uploads/')) return `${BACKEND_BASE}${raw}`;
    return `${BACKEND_BASE}/uploads/${raw}`;
}

const API = {
    getEvents: () => apiFetch('/events'),
    getTeam: () => apiFetch('/team'),
    submitContact: (data) => apiFetch('/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }),
    getHome: (section) => apiFetch(`/home/${section}`),
    getBranches: () => apiFetch('/branches'),
    getResources: () => apiFetch('/resources'),
    getGallery: () => apiFetch('/gallery'),
    getBlogs: () => apiFetch('/blogs'),
    getExams: (params) => {
        const query = params ? '?' + new URLSearchParams(params).toString() : '';
        return apiFetch(`/exams${query}`);
    },
    search: (q) => apiFetch(`/search?q=${encodeURIComponent(q)}`),
    getPageContent: (page, section) => apiFetch(`/home/page-content?page=${page}${section ? `&section=${section}` : ''}`),
    getPastExeCom: () => apiFetch('/past-execom'),
    apiFetch: (endpoint, options) => apiFetch(endpoint, options)
};