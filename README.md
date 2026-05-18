# Smart Leads Dashboard

A full-stack lead management dashboard built with the MERN stack + TypeScript.

## Tech Stack

**Frontend:** React, TypeScript, TailwindCSS, React Query, Zustand, React Router  
**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT

## Features

- JWT authentication with role-based access control (Admin / Sales)
- Full lead CRUD — create, view, edit, delete
- Advanced filtering by status, source, and free-text search (debounced)
- Sort by latest or oldest
- Backend pagination (10 per page)
- CSV export
- Dark mode toggle
- Responsive layout

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or update `MONGO_URI` to your Atlas URI)

### Backend

```bash
cd backend
cp .env.example .env      # fill in your values
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`, API at `http://localhost:5000`.

Local frontend (from backend/.env CLIENT_URL): `http://localhost:5173`
Local API (from frontend/.env VITE_API_URL): `http://localhost:5000`

Production frontend: https://smart-leads-dashboard-2vjkbprx6-sandips-projects-4e25dcc4.vercel.app/
Production backend: https://smart-leads-dashboard-bi5l.onrender.com

### Docker (all-in-one)

```bash
cp backend/.env.example backend/.env   # set JWT_SECRET etc.
docker-compose up --build
```

Frontend → `http://localhost:5173`  
API → `http://localhost:5000`

## Project Structure

```
smart-leads/
├── backend/
│   └── src/
│       ├── config/        # DB connection
│       ├── controllers/   # Route handlers
│       ├── middleware/    # Auth, error, validation
│       ├── models/        # Mongoose schemas
│       ├── routes/        # Express routers
│       ├── types/         # Shared TS types
│       ├── utils/         # JWT helpers
│       └── validators/    # express-validator rules
└── frontend/
    └── src/
        ├── api/           # Axios calls
        ├── components/    # Reusable UI components
        ├── hooks/         # Custom hooks
        ├── pages/         # Page components
        ├── store/         # Zustand stores
        └── types/         # Shared TS types
```

## API Endpoints

| Method | Endpoint             | Auth       | Description                            |
| ------ | -------------------- | ---------- | -------------------------------------- |
| POST   | `/api/auth/register` | Public     | Create account                         |
| POST   | `/api/auth/login`    | Public     | Login                                  |
| GET    | `/api/auth/me`       | Protected  | Get current user                       |
| GET    | `/api/leads`         | Protected  | List leads (with filters + pagination) |
| GET    | `/api/leads/:id`     | Protected  | Get single lead                        |
| POST   | `/api/leads`         | Protected  | Create lead                            |
| PUT    | `/api/leads/:id`     | Protected  | Update lead                            |
| DELETE | `/api/leads/:id`     | Admin only | Delete lead                            |
| GET    | `/api/leads/export`  | Protected  | Export CSV                             |

### Query params for `GET /api/leads`

| Param    | Type   | Description                             |
| -------- | ------ | --------------------------------------- |
| `page`   | number | Page number (default: 1)                |
| `limit`  | number | Items per page (default: 10, max: 50)   |
| `search` | string | Search by name or email                 |
| `status` | string | Filter: New, Contacted, Qualified, Lost |
| `source` | string | Filter: Website, Instagram, Referral    |
| `sort`   | string | `latest` or `oldest`                    |

## RBAC

| Action         | Admin | Sales         |
| -------------- | ----- | ------------- |
| View all leads | ✅    | ❌ (own only) |
| Create lead    | ✅    | ✅            |
| Edit lead      | ✅    | ✅ (own only) |
| Delete lead    | ✅    | ❌            |
| Export CSV     | ✅    | ✅ (own only) |
