# MongoDB Schema Documentation

> IEEE TEMS Bangalore — Full Database Specification
> Database: `ieee-tems` on MongoDB Atlas M0 Free Tier

---

## 📋 Table of Contents

1. [Connection Details](#connection-details)
2. [Collections Overview](#collections-overview)
3. [Collection Schemas](#collection-schemas)
   - [events](#1-events)
   - [teams](#2-teams)
   - [blogs](#3-blogs)
   - [studentbranches](#4-studentbranches)
   - [resources](#5-resources)
   - [contacts](#6-contacts)
   - [pastexecoms](#7-pastexecoms)
   - [liveupdates](#8-liveupdates)
   - [heroslides](#9-heroslides)
   - [counters](#10-counters)
   - [karnatakas](#11-karnatakas)
   - [charmessages](#12-charmessages)
   - [homegalleries](#13-homegalleries)
   - [aboutintros](#14-aboutintros)
   - [contactinfos](#15-contactinfos)
   - [sociallinks](#16-sociallinks)
   - [pagecontents](#17-pagecontents)
4. [Disabled / Reserved Collections](#disabled--reserved-collections)
5. [Admin Panel Mapping](#admin-panel-mapping)
6. [Indexes](#indexes)
7. [Seeding Demo Data](#seeding-demo-data)
8. [Atlas Configuration](#atlas-configuration)

---

## Connection Details

| Property | Value |
|---|---|
| **Provider** | MongoDB Atlas |
| **Cluster Tier** | M0 (Free) |
| **Cluster Name** | M0 |
| **Host** | `m0.uifhovv.mongodb.net` |
| **Database Name** | `ieee-tems` |
| **App Name** | `M0` |
| **Connection String** | `mongodb+srv://<user>:<pass>@m0.uifhovv.mongodb.net/ieee-tems?appName=M0` |
| **DB User** | `ieeetemsreva_db_user` |
| **Network Access** | `0.0.0.0/0` (open — restrict to server IP in production) |

> ⚠️ The actual password is stored in `backend/.env.production`. Never commit credentials to version control.

---

## Collections Overview

| # | Collection | Model File | Admin Panel Section | Frontend Page |
|---|---|---|---|---|
| 1 | `events` | `Event.js` | Manage Events | events.html |
| 2 | `teams` | `Team.js` | Manage Team | execom.html |
| 3 | `blogs` | `Blog.js` | Manage Blogs | blogs.html, index.html |
| 4 | `studentbranches` | `StudentBranch.js` | Manage Branches | branches.html |
| 5 | `resources` | `Resource.js` | Manage Resources | resources.html |
| 6 | `contacts` | `Contact.js` | Manage Messages | contact.html (form) |
| 7 | `pastexecoms` | `PastExeCom.js` | Manage Past ExeCom | execom.html |
| 8 | `liveupdates` | `HomeModels.js` | Home Manager | index.html (ticker) |
| 9 | `heroslides` | `HomeModels.js` | Home Manager | index.html (hero) |
| 10 | `counters` | `HomeModels.js` | Home Manager | index.html (stats) |
| 11 | `karnatakas` | `HomeModels.js` | Home Manager | index.html (presence) |
| 12 | `charmessages` | `HomeModels.js` | Home Manager | index.html + about.html |
| 13 | `homegalleries` | `HomeModels.js` | Home Manager | index.html (preview) |
| 14 | `aboutintros` | `HomeModels.js` | Home Manager | index.html (about section) |
| 15 | `contactinfos` | `HomeModels.js` | Home Manager | footer (email/address) |
| 16 | `sociallinks` | `HomeModels.js` | Home Manager | footer (social icons) |
| 17 | `pagecontents` | `HomeModels.js` | — | branches.html (hero text) |

---

## Collection Schemas

---

### 1. `events`

Stores all IEEE TEMS events — upcoming and past.

**API Route:** `/api/events`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | MongoDB document ID |
| `title` | String | ✅ | — | Event title (unique) |
| `description` | String | ✅ | — | Full event description |
| `date` | Date | ✅ | — | Event date |
| `location` | String | ✅ | — | Venue or "Online (Zoom)" |
| `category` | String | ✅ | — | `Workshops`, `Conferences`, `Talks`, `AGM`, `Competitions` |
| `organizer` | String | ❌ | — | Organizer name |
| `registerLink` | String | ❌ | — | Registration URL |
| `moreInfoLink` | String | ❌ | — | More info URL |
| `image` | String | ❌ | — | Filename in `uploads/` or full URL |
| `createdAt` | Date | auto | `Date.now` | Creation timestamp |

**Example document:**
```json
{
  "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
  "title": "TEMSCON 2026 — Innovation & Leadership Summit",
  "description": "Join us for the flagship annual conference...",
  "date": "2026-08-15T00:00:00.000Z",
  "location": "IISc Bangalore, Auditorium",
  "category": "Conferences",
  "image": "event-1234567890.jpg",
  "registerLink": "https://events.vtools.ieee.org",
  "createdAt": "2026-05-01T10:00:00.000Z"
}
```

---

### 2. `teams`

Stores current Executive Committee members.

**API Route:** `/api/team`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | MongoDB document ID |
| `name` | String | ✅ | — | Full name |
| `role` | String | ✅ | — | Position title (e.g. `Chair`, `Secretary`) |
| `photo` | String | ❌ | `default-avatar.png` | Filename in `uploads/` or full URL |
| `bio` | String | ❌ | — | Short biography |
| `email` | String | ❌ | — | Contact email |
| `linkedin` | String | ❌ | — | LinkedIn profile URL |
| `year` | Number | ❌ | current year | Committee year (e.g. `2026`) |
| `order` | Number | ❌ | `0` | Display sort order (ascending) |
| `createdAt` | Date | auto | `Date.now` | Creation timestamp |

**Index:** `{ name: 1, year: 1 }` — unique compound index (prevents duplicate members per year)

**Example document:**
```json
{
  "_id": "64a1b2c3d4e5f6a7b8c9d0e2",
  "name": "Dr. Rajesh Kumar",
  "role": "Chair",
  "photo": "team-1234567890.jpg",
  "bio": "Senior engineering leader with 20+ years of experience...",
  "email": "chair@ieee-tems-bangalore.org",
  "linkedin": "https://linkedin.com/in/...",
  "year": 2026,
  "order": 1
}
```

---

### 3. `blogs`

Stores blog posts and news articles.

**API Route:** `/api/blogs`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | MongoDB document ID |
| `title` | String | ✅ | — | Blog title (unique) |
| `content` | String | ✅ | — | Full article content (plain text or HTML) |
| `author` | String | ✅ | — | Author name |
| `category` | String | ❌ | `Announcement` | Category tag shown on card |
| `date` | Date | ❌ | `Date.now` | Publish date |
| `image` | String | ❌ | — | Filename in `uploads/` or full URL |
| `articleUrl` | String | ❌ | — | External article link (if applicable) |

**Example document:**
```json
{
  "_id": "64a1b2c3d4e5f6a7b8c9d0e3",
  "title": "The Future of Engineering Management in the Age of AI",
  "content": "Artificial intelligence is fundamentally reshaping...",
  "author": "Dr. Rajesh Kumar",
  "category": "Technology Management",
  "date": "2026-05-10T00:00:00.000Z",
  "image": "blog-1234567890.jpg",
  "articleUrl": "https://example.com/article"
}
```

---

### 4. `studentbranches`

Stores student branch chapters with geographic coordinates for map display.

**API Route:** `/api/branches`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | MongoDB document ID |
| `name` | String | ✅ | — | Branch name (unique) |
| `institutionImage` | String | ❌ | — | College/institute photo |
| `city` | String | ✅ | — | City name (e.g. `Bangalore`) |
| `formationDate` | Date | ❌ | — | Date branch was established |
| `memberCount` | Number | ❌ | `0` | Current member count |
| `description` | String | ❌ | — | About the branch |
| `website` | String | ❌ | — | College website URL |
| `socialLinks.facebook` | String | ❌ | — | Facebook page URL |
| `socialLinks.instagram` | String | ❌ | — | Instagram profile URL |
| `socialLinks.linkedin` | String | ❌ | — | LinkedIn page URL |
| `advisor.name` | String | ❌ | — | Branch advisor name |
| `advisor.photo` | String | ❌ | — | Advisor photo |
| `advisor.linkedin` | String | ❌ | — | Advisor LinkedIn |
| `chair.name` | String | ❌ | — | Branch chair name |
| `chair.photo` | String | ❌ | — | Chair photo |
| `chair.linkedin` | String | ❌ | — | Chair LinkedIn |
| `latitude` | Number | ✅ | — | GPS latitude for map dot |
| `longitude` | Number | ✅ | — | GPS longitude for map dot |
| `order` | Number | ❌ | `0` | Display sort order |
| `createdAt` | Date | auto | `Date.now` | Creation timestamp |

> ⚠️ `latitude` and `longitude` are **required** — without them the branch won't appear on the Karnataka map.

**Karnataka coordinate range:**
- Latitude: `11.50° N` to `18.45° N`
- Longitude: `74.05° E` to `78.60° E`

**Example document:**
```json
{
  "_id": "64a1b2c3d4e5f6a7b8c9d0e4",
  "name": "REVA University TEMS Student Branch",
  "city": "Bangalore",
  "latitude": 13.1140,
  "longitude": 77.6024,
  "memberCount": 85,
  "formationDate": "2022-03-10T00:00:00.000Z",
  "advisor": { "name": "Dr. Suresh M.", "linkedin": "https://linkedin.com/in/..." },
  "chair": { "name": "Ms. Aesha Italiya", "linkedin": "https://linkedin.com/in/aesha-italiya-74087633b/" }
}
```

---

### 5. `resources`

Stores downloadable resources, brand assets, and documents.

**API Route:** `/api/resources`

| Field | Type | Required | Default | Allowed Values |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `name` | String | ✅ | — | Resource title |
| `description` | String | ❌ | — | Short description |
| `previewImage` | String | ✅ | — | Preview image filename or URL |
| `downloadUrl` | String | ✅ | — | Download link or filename |
| `fileType` | String | ❌ | `PNG` | `PNG`, `SVG`, `JPG`, `PDF`, `OTHER` |
| `fileSize` | String | ❌ | — | Human-readable size (e.g. `2.4 MB`) |
| `category` | String | ❌ | `IEEE` | `IEEE`, `TEMS`, `BANGALORE SECTION`, `AGM REPORT`, `OTHER` |
| `order` | Number | ❌ | `0` | Display sort order |
| `createdAt` | Date | auto | `Date.now` | — |

> Note: Static brand assets (PNGs in `assets/Official Logo Downloads/`) are displayed directly in the frontend without using this collection. This collection is for dynamically managed resources.

---

### 6. `contacts`

Stores contact form submissions from the public website.

**API Route:** `/api/messages`

| Field | Type | Required | Default | Allowed Values |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `name` | String | ✅ | — | Sender's full name |
| `email` | String | ✅ | — | Sender's email |
| `subject` | String | ✅ | — | Message subject |
| `message` | String | ✅ | — | Full message body |
| `status` | String | ❌ | `unread` | `unread`, `read`, `replied` |
| `createdAt` | Date | auto | `Date.now` | — |

> Read via admin panel at `yourdomain.com/admin/messages`. Public `POST /api/messages` does not require authentication.

---

### 7. `pastexecoms`

Stores historical Executive Committee members for display on the ExeCom page.

**API Route:** `/api/past-execom`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `name` | String | ✅ | — | Full name |
| `role` | String | ✅ | — | Committee role |
| `year` | Number | ✅ | — | Year of service (e.g. `2025`) |
| `photo` | String | ❌ | `''` | Photo filename or URL |
| `linkedin` | String | ❌ | `''` | LinkedIn URL |
| `order` | Number | ❌ | `0` | Display sort order |
| `createdAt` | Date | auto | `Date.now` | — |

---

### 8. `liveupdates`

Ticker bar announcements shown at the top of the homepage.

**API Route:** `/api/home/live-updates`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `text` | String | ✅ | — | Ticker announcement text |
| `active` | Boolean | ❌ | `true` | Toggle visibility without deleting |
| `createdAt` | Date | auto | `Date.now` | — |

---

### 9. `heroslides`

Homepage hero slider slides.

**API Route:** `/api/home/hero`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `title` | String | ✅ | — | Headline (can include `<br>` and `<span>`) |
| `subtitle` | String | ❌ | — | Eyebrow label text above headline |
| `image` | String | ✅ | — | Background image filename or URL |
| `buttonText` | String | ❌ | — | CTA button label |
| `buttonLink` | String | ❌ | — | CTA button destination URL |
| `order` | Number | ❌ | `0` | Slide order (ascending) |

---

### 10. `counters`

Animated stat counters on the homepage (e.g. "1200 Active Members").

**API Route:** `/api/home/counters`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `label` | String | ✅ | — | Stat label (unique, e.g. `Active Members`) |
| `value` | Number | ✅ | — | Numeric value to count up to |
| `icon` | String | ❌ | — | Font Awesome icon class (optional) |

---

### 11. `karnatakas`

"Our Presence" section content on the homepage.

**API Route:** `/api/home/karnataka`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `title` | String | ✅ | — | Section heading |
| `content` | String | ✅ | — | Paragraph text |
| `image` | String | ❌ | — | Background image or video filename/URL. If `.mp4/.webm/.mov` → plays as video; otherwise → shown as background image |

> Only **one document** should exist in this collection.

---

### 12. `charmessages`

Chair's message shown on homepage and About page.

**API Route:** `/api/home/chair-message`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `name` | String | ✅ | — | Chair's full name |
| `designation` | String | ✅ | — | Full title (e.g. `Chair, IEEE TEMS Bangalore Section`) |
| `message` | String | ✅ | — | Full message text |
| `image` | String | ✅ | — | Photo filename or URL |

> Only **one document** should exist in this collection.

---

### 13. `homegalleries`

Gallery images displayed in the homepage preview section.

**API Route:** `/api/home/gallery`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `imageUrl` | String | ✅ | — | Image filename in `uploads/` or full URL |
| `caption` | String | ❌ | — | Image caption (optional) |
| `createdAt` | Date | auto | `Date.now` | — |

> Note: The main `gallery.html` page uses the `/api/gallery` route from a separate `Gallery` model (managed via **Manage Gallery** in the admin panel). This collection is only for the **homepage preview** — managed via **Home Manager**.

---

### 14. `aboutintros`

About section text on the homepage (left column of the stats grid section).

**API Route:** `/api/home/about-intro`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `title` | String | ✅ | — | Section heading |
| `content` | String | ✅ | — | Paragraph text |
| `linkText` | String | ❌ | `Learn More` | CTA link label |
| `linkUrl` | String | ❌ | `about.html` | CTA link destination |

> Only **one document** should exist in this collection.

---

### 15. `contactinfos`

Contact details shown in the website footer.

**API Route:** `/api/home/contact-info`

| Field | Type | Required | Allowed Values | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `type` | String | ✅ | `address`, `phone`, `email` | Contact type |
| `value` | String | ✅ | — | Actual value (email address, phone number, address) |
| `label` | String | ❌ | — | Display label (e.g. `General Enquiries`) |
| `icon` | String | ❌ | — | Font Awesome icon class |

---

### 16. `sociallinks`

Social media links shown in the footer.

**API Route:** `/api/home/social-links`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `platform` | String | ✅ | — | Platform name — unique (e.g. `LinkedIn`) |
| `url` | String | ✅ | — | Full social profile URL |
| `icon` | String | ✅ | — | Font Awesome icon class (e.g. `fab fa-linkedin`) |
| `order` | Number | ❌ | `0` | Display sort order |

---

### 17. `pagecontents`

Generic page section content for non-home pages (currently used for the Student Branches page hero text).

**API Route:** `/api/home/page-content?page=<page>&section=<section>`

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `_id` | ObjectId | auto | — | — |
| `page` | String | ✅ | — | Page identifier (e.g. `branches`, `about`) |
| `section` | String | ✅ | — | Section identifier (e.g. `hero`, `map-desc`) |
| `title` | String | ❌ | — | Section heading |
| `subtitle` | String | ❌ | — | Sub-heading |
| `content` | String | ❌ | — | Body text |
| `image` | String | ❌ | — | Background image filename or URL |
| `order` | Number | ❌ | `0` | Sort order |

**Index:** `{ page: 1, section: 1 }` — unique compound index (one record per page+section combo)

---

## Disabled / Reserved Collections

### `exams`

Fully implemented but **disabled** in `backend/server.js`:

```js
// app.use('/api/exams', require('./routes/examRoutes'));  // REMOVED - Past Exams feature
```

The schema, model, controller, and routes exist. To re-enable:
1. Uncomment the route in `server.js`
2. Add `ManageExams` to the admin panel sidebar

**Schema fields:** `title`, `subject`, `year`, `fileUrl`, `description`, `order`, `createdAt`

---

## Admin Panel Mapping

| Admin Panel Section | Collections Used | Route |
|---|---|---|
| Home Manager — Hero | `heroslides` | `/api/home/hero` |
| Home Manager — Ticker | `liveupdates` | `/api/home/live-updates` |
| Home Manager — Stats | `counters` | `/api/home/counters` |
| Home Manager — About Intro | `aboutintros` | `/api/home/about-intro` |
| Home Manager — Presence | `karnatakas` | `/api/home/karnataka` |
| Home Manager — Chair Message | `charmessages` | `/api/home/chair-message` |
| Home Manager — Gallery Preview | `homegalleries` | `/api/home/gallery` |
| Home Manager — Contact Info | `contactinfos` | `/api/home/contact-info` |
| Home Manager — Social Links | `sociallinks` | `/api/home/social-links` |
| Manage Events | `events` | `/api/events` |
| Manage Team | `teams` | `/api/team` |
| Manage Blogs | `blogs` | `/api/blogs` |
| Manage Branches | `studentbranches` | `/api/branches` |
| Manage Gallery | `galleries` | `/api/gallery` |
| Manage Resources | `resources` | `/api/resources` |
| Manage Messages | `contacts` | `/api/messages` |
| Manage Past ExeCom | `pastexecoms` | `/api/past-execom` |

---

## Indexes

| Collection | Index | Type | Purpose |
|---|---|---|---|
| `events` | `title` | Unique | Prevent duplicate event titles |
| `teams` | `{ name, year }` | Unique compound | Prevent same person twice per year |
| `blogs` | `title` | Unique | Prevent duplicate blog titles |
| `studentbranches` | `name` | Unique | Prevent duplicate branch names |
| `counters` | `label` | Unique | Prevent duplicate stat labels |
| `sociallinks` | `platform` | Unique | One entry per platform |
| `pagecontents` | `{ page, section }` | Unique compound | One record per page+section |

---

## Seeding Demo Data

A seed script is provided for development and testing:

```bash
cd backend
node seed.js
```

**What it seeds:**
- 5 Events (3 upcoming, 2 past)
- 6 Team members (current ExeCom)
- 4 Blog posts
- 5 Student Branches (Bangalore area colleges)
- 5 Past ExeCom members (2024 & 2025)
- All homepage sections (hero, ticker, stats, about, presence, chair, gallery)
- Contact info and social links

> ⚠️ **The seed script clears ALL data before inserting.** Never run on production.

---

## Atlas Configuration

### Cluster Details
- **Cluster Name:** M0
- **Tier:** M0 Free (512 MB storage)
- **Region:** (set during cluster creation)
- **MongoDB Version:** 7.x

### Database Users
| Username | Roles | Purpose |
|---|---|---|
| `ieeetemsreva_db_user` | `readWrite` on `ieee-tems` | Application user (backend) |

### Network Access
| IP | Description |
|---|---|
| `0.0.0.0/0` | Allow all (current setting) |

> 🔒 For better security, restrict to your Render.com server IP once deployed. Find it in Render dashboard → your service → Settings → outbound IP addresses.

### Monitoring
- Use **Atlas Data Explorer** to browse collections
- Use **Atlas Performance Advisor** to check for slow queries
- M0 tier does not support Atlas Search or advanced analytics

---

> **IEEE TEMS Bangalore Section** — Database Documentation v1.0
> Maintained by the Web Team: Rushit Jani · Aesha Italiya · Shiva Bhalke
