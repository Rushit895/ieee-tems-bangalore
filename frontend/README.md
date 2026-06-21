# IEEE TEMS Bangalore — Frontend

Static HTML/CSS/JS public website for IEEE TEMS Bangalore Section.

## Running Locally

```bash
npx serve . -p 8080
# Open http://localhost:8080
```

## Important: API URL

For **local development**, update `js/api.js`:
```js
const API_BASE_URL = 'http://localhost:5000/api';
const BACKEND_BASE  = 'http://localhost:5000';
```

Also update `UPLOADS_BASE` in all HTML inline scripts:
```js
const UPLOADS_BASE = 'http://localhost:5000/uploads/';
```

For **production**, set back to:
```js
const API_BASE_URL = 'https://your-render-url.onrender.com/api';
const BACKEND_BASE  = 'https://your-render-url.onrender.com';
```
And `UPLOADS_BASE = '/uploads/'` in all HTML files.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About IEEE TEMS |
| `events.html` | Events |
| `execom.html` | Executive Committee |
| `branches.html` | Student Branches |
| `gallery.html` | Gallery |
| `blogs.html` | Blogs & Updates |
| `blog-detail.html` | Single blog post |
| `resources.html` | Resources & Brand Assets |
| `contact.html` | Contact |
| `join-ieee.html` | Join IEEE |
| `search.html` | Search results |
| `ieee-75years.html` | 🎉 Easter egg — 75 Years page |

## Hybrid Content System

Every page has **default static HTML content** as a fallback. On page load, JavaScript fetches live data from the backend API and replaces the static content. If the API is unavailable, the static content is shown instead.

This means:
- Pages always display something (good UX)
- Static content should be kept reasonably up-to-date
- API data always takes priority over static content

## Shared Components

**`components/navbar.html`** and **`components/footer.html`** are loaded dynamically by `js/navbar.js` into every page's `<div id="navbar-placeholder">` and `<div id="footer-placeholder">`.

To update the navbar or footer globally, edit only these component files.

## Assets

```
assets/
├── logo.png                     # IEEE TEMS Bangalore logo
├── logo_75.png                  # 75 Years commemorative seal
├── ieee-mb-blue.png             # IEEE master brand (navbar)
├── v24.mp4                      # Home page "Our Presence" video
├── event.mp4                    # Events page hero video
├── chair.png                    # Default chair photo
├── AGM/                         # AGM Report PDFs
│   ├── AGM Repourt 2024.pdf
│   └── AGM Repourt 2025.pdf
└── Official Logo Downloads/     # Brand assets for Resources page
    ├── IEEE TEMS/
    ├── IEEE Bangalore Section/
    └── IEEE Bangalore Section - TEMS/
```

## CSS Architecture

| File | Scope |
|---|---|
| `global.css` | CSS variables, reset, grid, utilities, buttons |
| `navbar.css` | Navigation, active states, mobile menu |
| `footer.css` | Footer layout + developer credits |
| `homepage.css` | Home page hero (cinematic animations) + all sections |
| `about.css` | About page (pillars, chair feature, AGM cards) |
| `events.css` | Events hero (full-screen cinematic) + event cards |
| `pages.css` | Generic page hero used by gallery, blogs, contact etc. |
| `branches.css` | Student branches + Karnataka map |
| `resources.css` | Resource cards + brand asset download grid |
