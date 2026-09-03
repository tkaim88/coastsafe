# 🌊 CoastSafe

### Real-time water safety and facility discovery for Kenya's coast

[![Live App](https://img.shields.io/badge/live-coastsafe.vercel.app-06b6d4?style=flat-square)](https://coastsafe.vercel.app)
[![API](https://img.shields.io/badge/api-coastsafe.onrender.com-0f172a?style=flat-square)](https://coastsafe.onrender.com/api)
[![React](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Flask](https://img.shields.io/badge/backend-Flask-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)](#-license)

</div>

---

CoastSafe helps beachgoers check live weather and marine conditions before heading out, read and file community safety reports for specific coastal spots, and discover verified businesses (pools, water parks, resorts) with lifeguard availability. Business owners get a simple way to list and manage their facilities once approved by an admin.

**🔗 Live app:** https://coastsafe.vercel.app
**🔗 API base:** https://coastsafe.onrender.com/api

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started-local-development)
- [Deployment](#%EF%B8%8F-deployment)
- [Security Notes](#-security-notes)
- [Roadmap](#%EF%B8%8F-roadmap--known-items)
- [About This Project](#-about-this-project)
- [License](#-license)

---

## ✨ Features

### 🧭 For visitors
- 🌤️ Live weather and marine conditions for any coastal location, powered by Open-Meteo
- 📍 Browse a curated set of Kenyan coastal spots — Diani, Nyali, Watamu, Tiwi, Shanzu, Kilifi, Mtwapa, Tudor, and more — or search anywhere else
- 📝 Read community-submitted safety reports for a location before heading out
- 🏨 View verified, admin-approved business listings (pools, water parks, resorts) with lifeguard availability and hours

### 👤 For registered users
- 🔐 Sign up / log in with JWT-based auth
- ✍️ Submit, edit, and delete your own safety reports — ownership enforced both client- and server-side
- 🏢 List a business for admin review, and track its status from a personal dashboard (**My Listings**)

### 🛡️ For admins
- ✅ Review pending business listings and approve or reject them from a dedicated queue

---

## 🛠️ Tech Stack

<table>
<tr><th>Layer</th><th>Stack</th></tr>
<tr><td>🎨 Frontend</td><td>React + Vite + Tailwind CSS + React Router</td></tr>
<tr><td>⚙️ Backend</td><td>Flask + SQLAlchemy + Flask-Migrate + Flask-JWT-Extended + Flask-CORS</td></tr>
<tr><td>🗄️ Database</td><td>PostgreSQL (Supabase)</td></tr>
<tr><td>🌦️ External data</td><td>Open-Meteo API — Geocoding + Weather + Marine (no API key required)</td></tr>
<tr><td>▲ Frontend hosting</td><td>Vercel</td></tr>
<tr><td>🚀 Backend hosting</td><td>Render</td></tr>
</table>

---

## 🏗️ Architecture

```
┌──────────────┐      HTTPS       ┌──────────────┐      SQL       ┌────────────┐
│   Frontend    │ ───────────────▶ │   Backend    │ ──────────────▶ │  Supabase  │
│  React/Vite   │ ◀─────────────── │ Flask + JWT  │ ◀────────────── │ PostgreSQL │
│   (Vercel)    │                  │   (Render)   │                 │            │
└──────────────┘                  └──────────────┘                 └────────────┘
       │
       ▼
┌──────────────┐
│  Open-Meteo   │  live weather / marine / geocoding — called directly from the frontend
└──────────────┘
```

- 🔑 **Auth** — JWT access tokens, kept in-memory on the frontend (never `localStorage`), with real server-side token revocation via a `TokenBlocklist` table.
- 🔒 **Ownership** — a shared `owns_resource` decorator enforces that users can only edit or delete their own reports and listings; no per-resource duplication.
- 🛡️ **Admin gating** — a shared `admin_required` decorator protects admin-only routes server-side (approving/rejecting listings), independent of client-side route guarding.
- 📍 **Locations** — the backend `Location` table is the source of truth (numeric IDs). The frontend's curated location list (for Home/Explore browsing) is just a discovery subset — anyone can list a business anywhere via geocoded search, which auto-creates a `Location` row through `POST /api/locations/resolve` if one doesn't already exist.

---

## 📁 Project Structure

```
coastsafe/
├── frontend/
│   ├── src/
│   │   ├── components/     # Navbar, ReportForm, BusinessForm, LocationBusinesses, ProtectedRoute, ...
│   │   ├── pages/          # Home, Explore, LocationDetails, SearchResults, Login, Signup,
│   │   │                   # ListYourBusiness, MyListings, AdminReviewQueue
│   │   ├── services/       # apiClient.js, authApi.js, reportsApi.js, locationsApi.js,
│   │   │                   # businessesApi.js, geocodingApi.js
│   │   ├── context/        # AuthContext.jsx
│   │   └── data/           # coastalLocations.js (curated list)
│   └── vercel.json         # SPA rewrite rule (all paths → index.html)
├── backend/
│   ├── app/
│   │   ├── models/         # User, Location, SafetyReport, Business, TokenBlocklist
│   │   ├── routes/         # auth, locations, reports, businesses
│   │   └── decorators.py   # owns_resource, admin_required
│   ├── migrations/
│   └── requirements.txt
└── README.md
```

---

## 🔌 API Reference

Base URL: `https://coastsafe.onrender.com/api`

#### 🔐 Auth
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/auth/signup` | `POST` | – | Create an account |
| `/auth/login` | `POST` | – | Log in, receive a JWT |
| `/auth/logout` | `POST` | ✅ | Revoke the current token |

#### 📍 Locations
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/locations` | `GET` | – | List locations (paginated) |
| `/locations/resolve` | `POST` | ✅ | Find-or-create a location by name (used when listing a business anywhere) |

#### 📝 Safety Reports
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/reports` | `GET` | – | List safety reports (paginated) |
| `/reports` | `POST` | ✅ | Submit a safety report |
| `/reports/:id` | `PATCH` | ✅ owner | Edit your own report |
| `/reports/:id` | `DELETE` | ✅ owner | Delete your own report |

#### 🏢 Businesses
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/businesses` | `GET` | – | List **approved** businesses only |
| `/businesses` | `POST` | ✅ | Submit a business listing (status: `pending`) |
| `/businesses/mine` | `GET` | ✅ | Your own listings, any status |
| `/businesses/:id` | `PATCH` | ✅ owner | Edit your own listing |
| `/businesses/:id` | `DELETE` | ✅ owner | Delete your own listing |
| `/businesses/pending` | `GET` | ✅ admin | Queue of listings awaiting review |
| `/businesses/:id/status` | `PATCH` | ✅ admin | Approve or reject a listing |

> All list endpoints are paginated. Protected routes require an `Authorization: Bearer <token>` header.

---

## 🚀 Getting Started (local development)

### Prerequisites
- Node.js 18+
- Python 3.11+
- A PostgreSQL database (e.g. a free Supabase project)

### ⚙️ Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:
```env
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=your-jwt-secret
JWT_ACCESS_TOKEN_EXPIRES_MINUTES=60
FRONTEND_ORIGINS=http://localhost:5173
```

```bash
flask db upgrade
flask run
```

### 🎨 Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev
```

---

## ☁️ Deployment

| Piece | Platform | Notes |
|---|---|---|
| 🎨 Frontend | **Vercel** | Auto-deploys on push to `main`. `vercel.json` adds a SPA rewrite rule so direct navigation to client-side routes doesn't 404. |
| ⚙️ Backend | **Render** (free tier, Oregon) | Root directory `backend` · Build: `pip install -r requirements.txt` · Start: `gunicorn run:app` |
| 🗄️ Database | **Supabase** (Postgres) | Connected via the **Session pooler** (IPv4) rather than the direct connection, since the direct connection requires IPv6. |

Environment variables are configured on Render (backend) and Vercel (frontend) — see the `.env` examples above for the full list.

---

## 🔒 Security Notes

- JWTs are kept in-memory on the frontend only — never written to `localStorage` or `sessionStorage`.
- Logout performs real token revocation via a server-side `TokenBlocklist`, not just client-side token deletion.
- Every ownership check (edit/delete on reports and listings) is enforced **server-side** via the shared `owns_resource` decorator — client-side checks are a UX convenience, not the security boundary.
- Admin-only routes are enforced **server-side** via `admin_required`, independent of any client-side route guarding.

---

## 🗺️ Roadmap / Known Items

- ⚠️ `/admin/businesses` is currently gated client-side only by "logged in," not "is admin." The backend correctly blocks non-admins from the actual data via `admin_required`, so there's no real security gap — just an unpolished UX for a non-admin user who navigates there directly.
- 🔜 Optimistic UI updates for reports and listings
- 🔜 Richer "My Reports" / "My Listings" dashboards
- 🔜 Expansion beyond Kenya to the wider East African coast

---

## 🎓 About This Project

CoastSafe is being built as a multi-phase capstone project:

| Phase | Scope |
|---|---|
| **Phase 1** | Frontend with live weather/marine search (Open-Meteo) |
| **Phase 2** | Full backend (Flask, JWT auth, ownership enforcement) + frontend integration |
| **Phase 3** *(current)* | Business listings with an admin approval workflow, plus the full auth-driven, user-owned-data capstone submission (pitch, MVP, final repo, video walkthrough) |

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---

## 👤 Author

**tkaim88**
GitHub: [@tkaim88](https://github.com/tkaim88) · Repo: [tkaim88/coastsafe](https://github.com/tkaim88/coastsafe)


Built with 🌊 for Kenya's coastal communities.
