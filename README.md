# IEEE TEMS Bangalore — Official Website

> **IEEE Technology and Engineering Management Society, Bangalore Section**
> Official web portal connecting professionals, students, and innovators across Karnataka.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start (Local Development)](#quick-start-local-development)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment Guide](#deployment-guide)
- [Admin Panel Guide](#admin-panel-guide)
- [Developer Team](#developer-team)

---

## Project Overview

This is a full-stack web application consisting of three parts:

| Part | Description | Tech |
|---|---|---|
| **Frontend** | Public-facing static website | HTML, CSS, Vanilla JS |
| **Admin Panel** | Content management dashboard | React + Vite |
| **Backend** | REST API + file uploads | Node.js, Express, MongoDB |

The website uses a **hybrid static + dynamic** approach — pages show fallback static content but load live data from the backend when available. This ensures the site always displays content even if the backend is temporarily unavailable (e.g. Render cold start).

---

## Tech Stack

### Frontend
- Plain HTML5, CSS3, Vanilla JavaScript (no framework)
- Font Awesome 6.4 for icons
- Google Fonts — Inter + Playfair Display

### Admin Panel
- React 18 + Vite
- React Router DOM v6
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js + Express.js
- MongoDB via Mongoose ODM
- JWT Authentication (jsonwebtoken + bcryptjs)
- Multer for file/image/video uploads

### Infrastructure
- **Database:** MongoDB Atlas (M0 Free Tier)
- **Frontend Hosting:** Hostinger Premium
- **Backend Hosting:** Render.com (Free Tier)
- **Keep-alive:** UptimeRobot (pings Render every 10 mins to prevent sleep)

---

## Project Structure

```
ieee-tems-bangalore/
│
├── frontend/                        # Public website (static HTML)
│   ├── index.html                   # Home page
│   ├── about.html                   # About IEEE TEMS
│   ├── events.html                  # Events listing & detail
│   ├── execom.html                  # Executive Committee
│   ├── branches.html                # Student Branches + map
│   ├── gallery.html                 # Photo Gallery
│   ├── blogs.html                   # Blogs & Updates
│   ├── blog-detail.html             # Individual blog post
│   ├── resources.html               # Resource Library + brand assets
│   ├── contact.html                 # Contact form
│   ├── join-ieee.html               # How to Join IEEE
│   ├── search.html                  # Search results page
│   ├── ieee-75years.html            # 🎉 Easter Egg — 75 Years page
│   ├── css/                         # Stylesheets
│   │   ├── global.css               # CSS variables, resets, utilities
│   │   ├── navbar.css               # Navigation bar styles
│   │   ├── footer.css               # Footer + dev team credit
│   │   ├── homepage.css             # Home page (hero, sections)
│   │   ├── about.css                # About page (pillars, chair)
│   │   ├── events.css               # Events hero + card styles
│   │   ├── pages.css                # Shared hero section styles
│   │   ├── branches.css             # Student branches + map
│   │   └── resources.css            # Resources + brand assets
│   ├── js/
│   │   ├── api.js                   # ⚠️ API_BASE_URL lives here
│   │   ├── navbar.js                # Navbar loader + active page highlight
│   │   ├── main.js                  # Scroll reveal, counters, back-to-top
│   │   ├── homepage.js              # Homepage-specific logic
│   │   ├── events.js                # Events page JS
│   │   └── search.js                # Live search dropdown
│   ├── components/
│   │   ├── navbar.html              # Shared navbar (loaded by all pages)
│   │   └── footer.html              # Shared footer with dev credits
│   └── assets/                      # Images, videos, brand files
│       ├── logo.png                 # IEEE TEMS Bangalore logo
│       ├── logo_75.png              # 75 Years commemorative seal
│       ├── ieee-mb-blue.png         # IEEE master brand logo (navbar)
│       ├── v24.mp4                  # Video — home "Our Presence" section
│       ├── event.mp4                # Video — events hero background
│       ├── AGM/                     # AGM Report PDFs (2024, 2025)
│       └── Official Logo Downloads/ # Official IEEE brand assets (PNG)
│           ├── IEEE TEMS/
│           ├── IEEE Bangalore Section/
│           └── IEEE Bangalore Section - TEMS/
│
├── admin-panel/                     # React CMS Dashboard
│   ├── src/
│   │   ├── App.jsx                  # Routes with auth protection
│   │   ├── main.jsx                 # React entry point
│   │   ├── config.js                # BACKEND_BASE + resolveUpload() helper
│   │   ├── services/
│   │   │   └── api.js               # All API call functions (axios)
│   │   ├── components/
│   │   │   ├── Sidebar/             # Sidebar nav with logout
│   │   │   └── ErrorBoundary.jsx    # React error boundary
│   │   └── pages/
│   │       ├── Login/               # Login page (JWT auth)
│   │       ├── Dashboard/           # Stats overview
│   │       ├── ManageEvents/        # Events CRUD
│   │       ├── ManageTeam/          # ExeCom CRUD
│   │       ├── ManageBlogs/         # Blogs CRUD
│   │       ├── ManageBranches/      # Student branches CRUD
│   │       ├── ManageGallery/       # Gallery upload/delete
│   │       ├── ManageResources/     # Resources CRUD
│   │       ├── ManageHome/          # Homepage sections editor
│   │       ├── ManageMessages/      # Contact form inbox
│   │       └── ManagePastExeCom/    # Past committee members
│   ├── .env.development             # Local: VITE_BACKEND_URL=http://localhost:5000
│   ├── dist/                        # Production build (upload this to Hostinger)
│   └── vite.config.js               # Vite + proxy config
│
├── backend/                         # Node.js REST API
│   ├── server.js                    # Express app + route registration
│   ├── seed.js                      # Demo data seeder script
│   ├── config/
│   │   └── db.js                    # MongoDB Atlas connection
│   ├── models/
│   │   ├── Event.js                 # Events schema
│   │   ├── Team.js                  # Team members schema
│   │   ├── Blog.js                  # Blogs schema
│   │   ├── StudentBranch.js         # Student branches (lat/lng)
│   │   ├── Resource.js              # Resources schema
│   │   ├── Contact.js               # Contact form messages
│   │   ├── PastExeCom.js            # Past committee members
│   │   ├── Exam.js                  # Exams (disabled, routes commented out)
│   │   └── HomeModels.js            # All homepage section models
│   ├── controllers/                 # Request handlers (business logic)
│   ├── routes/                      # API route definitions
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT token verification
│   │   └── uploadMiddleware.js      # Multer config (50MB, images + videos)
│   ├── utils/
│   │   └── response.js              # Standardised successResponse/errorResponse
│   ├── uploads/                     # Uploaded media files (served as /uploads/)
│   ├── .env                         # Local environment variables
│   └── .env.production              # Production environment variables
│
└── README.md                        # ← You are here
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js v18 or higher
- A MongoDB Atlas account with a free M0 cluster

### 1. Clone the repository
```bash
git clone <repo-url>
cd ieee-tems-bangalore
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in values:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ieee-tems
JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
NODE_ENV=development
ADMIN_USER_1=Admin2026
ADMIN_PASS_1=<your-secure-password>
ADMIN_USER_2=Admin2027
ADMIN_PASS_2=<your-secure-password>
```

Start backend:
```bash
npm run dev    # nodemon (auto-restart on changes)
```

Backend runs at: `http://localhost:5000`

### 3. Seed Demo Data (Optional)
Populates MongoDB with sample events, team, blogs, branches, homepage sections:
```bash
node seed.js
```
> ⚠️ This **clears all existing data** before seeding. Do NOT run on production.

### 4. Setup Admin Panel
```bash
cd admin-panel
npm install
npm run dev    # runs at http://localhost:5173
```

Login with the credentials set in your `.env` (`ADMIN_USER_1` / `ADMIN_PASS_1`).

### 5. Run the Frontend
```bash
cd frontend
npx serve . -p 8080
# Open http://localhost:8080
```

For local dev, temporarily update `frontend/js/api.js`:
```js
// Change for local testing:
const API_BASE_URL = 'http://localhost:5000/api';
const BACKEND_BASE  = 'http://localhost:5000';

// All UPLOADS_BASE in HTML files should also be:
const UPLOADS_BASE = 'http://localhost:5000/uploads/';
```

> ⚠️ **Switch back to production URLs before deploying!** See `frontend/js/api.js`.

---

## Environment Variables

### Backend `.env` / `.env.production`

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Server port (default: 5000) |
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | 64-char hex string for signing JWTs |
| `NODE_ENV` | ✅ | `development` or `production` |
| `ADMIN_USER_1` | ✅ | First admin username |
| `ADMIN_PASS_1` | ✅ | First admin password |
| `ADMIN_USER_2` | ✅ | Second admin username |
| `ADMIN_PASS_2` | ✅ | Second admin password |

### Admin Panel `.env.development`

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | Backend URL for local dev. Leave empty/unset for production (uses same-origin). |

---

## API Endpoints

Base: `/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | ❌ | Admin login — returns JWT (8h expiry) |
| `GET` | `/events` | ❌ | All events |
| `POST` | `/events` | ✅ | Create event (multipart form) |
| `PUT` | `/events/:id` | ✅ | Update event |
| `DELETE` | `/events/:id` | ✅ | Delete event |
| `GET` | `/team` | ❌ | ExeCom team members |
| `POST/PUT/DELETE` | `/team/:id` | ✅ | Manage team |
| `GET` | `/blogs` | ❌ | All blog posts |
| `POST/PUT/DELETE` | `/blogs/:id` | ✅ | Manage blogs |
| `GET` | `/branches` | ❌ | Student branches |
| `POST/PUT/DELETE` | `/branches/:id` | ✅ | Manage branches |
| `GET` | `/gallery` | ❌ | Gallery images |
| `POST` | `/gallery` | ✅ | Upload gallery image |
| `DELETE` | `/gallery/:id` | ✅ | Delete gallery image |
| `GET` | `/resources` | ❌ | Resources |
| `POST/PUT/DELETE` | `/resources/:id` | ✅ | Manage resources |
| `GET` | `/messages` | ✅ | Contact form submissions |
| `POST` | `/messages` | ❌ | Submit contact form (public) |
| `PUT` | `/messages/:id` | ✅ | Update message status |
| `GET` | `/home/:section` | ❌ | Homepage section data |
| `POST/PUT/DELETE` | `/home/:section/:id` | ✅ | Edit homepage content |
| `GET` | `/past-execom` | ❌ | Past committee members |
| `POST/PUT/DELETE` | `/past-execom/:id` | ✅ | Manage past members |
| `GET` | `/search?q=` | ❌ | Search across all content |

**Auth header format:**
```
Authorization: Bearer <jwt-token>
```

---

## Deployment Guide

### Architecture on Production
```
yourdomain.com           →  Hostinger Premium (static files)
  /                      →  frontend/ HTML pages
  /admin                 →  admin-panel/dist/ React build
  /uploads/*             →  served by Node.js backend

api.yourdomain.com       →  Render.com (Node.js)
  /api/*                 →  all API routes
  /uploads/*             →  uploaded media files

MongoDB Atlas M0         →  cloud database (free)
UptimeRobot              →  pings Render every 10 min (keeps it awake)
```

### Step-by-Step

**1. Deploy Backend to Render**
```
render.com → New Web Service → Connect GitHub
Root Directory: backend
Start Command: node server.js
Add all env vars from .env.production
```
Note your Render URL: `https://ieee-tems-api.onrender.com`

**2. Update production URLs in frontend**
```js
// frontend/js/api.js
const API_BASE_URL = 'https://ieee-tems-api.onrender.com/api';
const BACKEND_BASE  = 'https://ieee-tems-api.onrender.com';
```
Also update all `UPLOADS_BASE` in HTML files to `/uploads/` (relative).

**3. Build Admin Panel**
```bash
cd admin-panel && npm run build
```

**4. Upload to Hostinger**
- `frontend/` → `public_html/`
- `admin-panel/dist/` → `public_html/admin/`

**5. Setup UptimeRobot**
```
uptimerobot.com → Add Monitor → HTTP(s)
URL: https://ieee-tems-api.onrender.com
Interval: Every 10 minutes
```

**6. Add CORS for your domain**
In `backend/server.js`, ensure your domain is in the CORS list:
```js
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

---

## Admin Panel Guide

### Accessing the Admin Panel
- **URL:** `yourdomain.com/admin`
- **Credentials:** Set in backend `.env` as `ADMIN_USER_1` / `ADMIN_PASS_1`
- **Session:** JWT lasts 8 hours, then you must log in again

### Content Management Reference

| Section | Frontend Page | Notes |
|---|---|---|
| Home Manager | `index.html` | Hero slides, ticker, stats, chair message, presence |
| Events | `events.html` | Supports image + video uploads (max 50MB) |
| Team Members | `execom.html` | Add photo, LinkedIn, role, year |
| Student Branches | `branches.html` | **Requires lat/lng** for map dot placement |
| Gallery | `gallery.html` | Images appear in gallery + homepage preview |
| Blogs | `blogs.html` | Also appears on homepage "Latest Updates" |
| Resources | `resources.html` | Static brand assets shown separately (not in DB) |
| Messages | N/A (admin only) | Contact form submissions from `contact.html` |
| Past ExeCom | `execom.html` | Historical committee members by year |

### Adding a New Admin User
1. Add `ADMIN_USER_3` and `ADMIN_PASS_3` to `.env`
2. In `backend/controllers/authController.js`, add to the `ADMINS` array:
```js
{
  username: process.env.ADMIN_USER_3,
  passwordHash: bcrypt.hashSync(process.env.ADMIN_PASS_3, 10),
}
```

### Uploading Media
- **Supported types:** JPG, PNG, GIF, WebP, MP4, WebM, MOV
- **Max size:** 50MB
- **Storage:** Files are saved to `backend/uploads/` and served at `/uploads/filename`
- ⚠️ On Render.com free tier, the filesystem resets on every deploy. Consider migrating to Cloudinary for persistent storage.

---

## Important Notes for Future Developers

### 1. Frontend is Hybrid (Static + Dynamic)
Every page has **default static content** in the HTML that shows if the API fails. The JS then attempts to fetch live data and overwrites the defaults. This is intentional for resilience.

### 2. Two API files
- `frontend/js/api.js` — used by the public HTML pages
- `admin-panel/src/services/api.js` — used by the React admin panel
Both must be updated when the backend URL changes.

### 3. Image URL Resolution
The admin panel has a central helper in `admin-panel/src/config.js`:
```js
export const resolveUpload = (path) => { ... }
```
Always use this instead of hardcoding `localhost` or production URLs in admin panel components.

### 4. Exam Feature is Disabled
`backend/routes/examRoutes.js` exists and is fully implemented, but the route is commented out in `server.js`. The `ManageExams` page exists in the admin panel but is not linked in the sidebar. To re-enable: uncomment the route in `server.js`.

### 5. Search Only Works With Data
The search bar queries the backend. If the database is empty, search returns no results. It is not a static content search.

---

## Developer Team

This website was designed and developed by the IEEE TEMS Bangalore web team:

| Name | Role | Contact |
|---|---|---|
| **Rushit Jani** | Section Student Representative | [rushitjaniofficial895@ieee.org](mailto:rushitjaniofficial895@ieee.org) · [LinkedIn](https://www.linkedin.com/in/rushit-jani/) |
| **Aesha Italiya** | Web Lead | [aeshaitaliya123@gmail.com](mailto:aeshaitaliya123@gmail.com) · [LinkedIn](https://www.linkedin.com/in/aesha-italiya-74087633b/) |
| **Shiva Bhalke** | Web Admin | [bhalkeshiva9@gmail.com](mailto:bhalkeshiva9@gmail.com) · [LinkedIn](https://www.linkedin.com/in/shivabhalke/) |

---

> **IEEE TEMS Bangalore Section** — Empowering Innovation in Karnataka
