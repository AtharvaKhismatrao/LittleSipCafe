# Little Sip Cafe

Full-stack cafe ordering website: **React (Vite) + TailwindCSS** frontend, **Express + MongoDB (Mongoose)** backend.

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally (or set `MONGODB_URI` to Atlas)

## MongoDB setup

1. Install MongoDB Community Edition, or use Docker:

   ```bash
   docker run -d -p 27017:27017 --name mongo mongo:7
   ```

2. Default connection string: `mongodb://127.0.0.1:27017/littlesip_cafe`

## Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

- API base: `http://localhost:5000`
- Health check: `GET http://localhost:5000/health`
- **Admin login** (after seed): email `admin@littlesipcafe.com`, password `admin123` (override via `.env`: `ADMIN_EMAIL`, `ADMIN_PASSWORD`)

### Backend start commands

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Dev server with nodemon  |
| `npm start`    | Production (`node`)      |
| `npm run seed` | Seed admin + menu items  |

## Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies API calls to port `5000` when `VITE_API_URL` is empty.

### Frontend start commands

| Command         | Description        |
|-----------------|--------------------|
| `npm run dev`   | Vite dev server    |
| `npm run build` | Production build   |
| `npm run preview` | Preview production build |

For production, set `VITE_API_URL` in `frontend/.env` to your API origin (e.g. `https://api.example.com`).

## API routes (as implemented)

| Method | Path | Notes |
|--------|------|--------|
| GET | `/menu` | All menu items |
| POST | `/menu` | Create item (JWT) |
| PUT | `/menu/:id` | Update (JWT) |
| DELETE | `/menu/:id` | Delete (JWT) |
| POST | `/reservations` | Create reservation |
| GET | `/reservations` | List (JWT) |
| GET | `/reviews` | All reviews |
| POST | `/reviews` | Submit review |
| POST | `/orders` | Place order |
| GET | `/orders` | List (JWT) |
| PATCH | `/orders/:id/status` | Update status (JWT) |
| POST | `/auth/login` | Admin login → JWT |

## Project structure

```
backend/
  models/       Mongoose models
  routes/       Express routers
  middleware/   JWT auth
  seed.js       Sample data + admin user
  server.js

frontend/
  src/
    components/ Navbar, Hero, MenuCard, Cart, Footer
    pages/      Home, Order, Menu, Reservations, Reviews, Loyalty, Contact, AdminDashboard
    context/    CartContext
    services/   api.js (Axios)
```

## Features

- Home hero with cafe imagery and CTAs
- Order online with category filters and right-side cart (React Context)
- Menu page with category imagery and item lists
- Table reservations saved to MongoDB
- Reviews submitted and listed from MongoDB
- Loyalty page (UI + placeholder modal for login/signup)
- Contact page with cafe details and client-side contact form demo
- Admin dashboard: JWT login, CRUD menu, view reservations/reviews/orders, update order status
