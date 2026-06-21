# IEEE TEMS Bangalore — Backend API

Node.js + Express REST API powering the IEEE TEMS Bangalore website.

## Setup

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev            # starts with nodemon on port 5000
```

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ieee-tems
JWT_SECRET=<64-char hex>
NODE_ENV=development
ADMIN_USER_1=Admin2026
ADMIN_PASS_1=<password>
ADMIN_USER_2=Admin2027
ADMIN_PASS_2=<password>
```

Generate JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start server (production) |
| `npm run dev` | Start with nodemon (development) |
| `node seed.js` | Seed demo data ⚠️ clears all data first |

## Folder Structure

```
backend/
├── server.js              # Entry point — Express app setup
├── seed.js                # Demo data seeder
├── config/
│   └── db.js              # MongoDB Atlas connection
├── models/                # Mongoose schemas
│   ├── Event.js
│   ├── Team.js
│   ├── Blog.js
│   ├── StudentBranch.js
│   ├── Resource.js
│   ├── Contact.js
│   ├── PastExeCom.js
│   └── HomeModels.js      # All homepage section models
├── controllers/           # Business logic for each resource
├── routes/                # Express route definitions
├── middleware/
│   ├── authMiddleware.js  # JWT verification middleware
│   └── uploadMiddleware.js # Multer (50MB, images + videos)
├── utils/
│   └── response.js        # successResponse() / errorResponse()
└── uploads/               # Uploaded files (served at /uploads/)
```

## Authentication

- `POST /api/auth/login` — accepts `{ username, password }`, returns JWT
- JWT expires in **8 hours**
- All write operations (POST/PUT/DELETE) require `Authorization: Bearer <token>`
- Admin credentials are stored in `.env` and hashed with bcrypt at startup

## File Uploads

- Handled by Multer → saved to `uploads/` directory
- Max file size: **50MB**
- Allowed types: JPG, PNG, GIF, WebP, MP4, WebM, MOV
- Served statically at `/uploads/<filename>`

⚠️ On Render free tier, `uploads/` resets on every deploy. For persistent uploads, migrate to Cloudinary.
