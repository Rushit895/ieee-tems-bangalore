# IEEE TEMS Bangalore — Admin Panel

React + Vite content management dashboard for the IEEE TEMS Bangalore website.

## Setup

```bash
npm install
npm run dev     # http://localhost:5173
```

## Build for Production

```bash
npm run build   # outputs to dist/
```

Upload the contents of `dist/` to `public_html/admin/` on Hostinger.

## Environment

**`.env.development`** (already configured):
```env
VITE_BACKEND_URL=http://localhost:5000
```

In production, `VITE_BACKEND_URL` is not set — the app uses same-origin `/api` calls.

## Login

Use credentials set in the backend `.env`:
- Username: `ADMIN_USER_1` value
- Password: `ADMIN_PASS_1` value

Session (JWT) lasts **8 hours**.

## Key Files

| File | Purpose |
|---|---|
| `src/App.jsx` | Routes with `<ProtectedRoute>` auth guards |
| `src/config.js` | `BACKEND_BASE` + `resolveUpload()` helper |
| `src/services/api.js` | All API functions (axios) |
| `src/pages/Login/` | Login page |
| `src/components/Sidebar/` | Navigation sidebar + logout |

## Adding a New Page

1. Create `src/pages/ManageXxx/ManageXxx.jsx`
2. Import and add a `<Route>` in `src/App.jsx`
3. Add a nav link in `src/components/Sidebar/Sidebar.jsx`
4. Add API functions in `src/services/api.js`

## Image URLs

Always use `resolveUpload()` from `src/config.js` to build image URLs:

```jsx
import { resolveUpload } from '../../config';
<img src={resolveUpload(item.image)} />
```

Never hardcode `localhost:5000` in component files.
