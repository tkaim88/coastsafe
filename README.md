# 🌊 CoastSafe

**Know before you go.**

CoastSafe is a water-safety web application for Kenya's coast, helping
visitors check live weather and marine conditions before entering the
water — and helping verified businesses (pools, water parks, resorts)
list their facility so visitors can find not just *"is the open water
safe"* but *"where can I safely go swim."*

Built as a three-phase Moringa School capstone. All three phases are now
implemented and the application is deployed and live.

🔗 **Live app:** [coastsafe.vercel.app](https://coastsafe.vercel.app)
🔗 **Live API:** [coastsafe.onrender.com](https://coastsafe.onrender.com)

---

## 📌 Project Objective

CoastSafe brings weather, marine conditions, and community/business trust
signals into one simple interface for people planning coastal activities.

Visitors can:

- 🔍 Search any coastal location
- ☀️ View live weather conditions
- 🌊 View live marine conditions (wave height, swell, etc.)
- 📝 Read community-submitted safety reports for a location
- 🏨 Browse verified, admin-approved facility listings — including
  lifeguard availability — to find a safe place to swim
- 🔐 Create an account to submit their own safety reports or list a
  business

CoastSafe is an informational planning tool. It is **not** a navigation
system, emergency service, lifeguard replacement, or professional marine
advisory system.

---

## ✅ Project Status

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** | React frontend, live Open-Meteo integration | ✅ Complete, deployed |
| **Phase 2** | Flask + PostgreSQL backend, full CRUD, ownership, pagination | ✅ Complete, deployed |
| **Phase 2 (frontend)** | JWT auth wired into the UI — signup, login, protected routes, report submission | ✅ Complete, merged |
| **Business Listings** | Owner-submitted facility listings with admin approval workflow | 🚧 In progress |

---

## 🛠️ Technology Stack

**Frontend**
- ⚛️ React + Vite
- 🎨 Tailwind CSS
- 🧭 React Router
- ▲ Deployed on Vercel

**Backend**
- 🐍 Flask 3 (app-factory pattern)
- 🗄️ PostgreSQL (hosted on Supabase)
- 🔗 Flask-SQLAlchemy + Flask-Migrate
- 🔑 Flask-JWT-Extended (real token revocation on logout)
- 🌐 Deployed on Render

**External APIs (Open-Meteo — no key required)**
- 📍 Geocoding — `https://geocoding-api.open-meteo.com/v1/search`
- ☀️ Weather Forecast — `https://api.open-meteo.com/v1/forecast`
- 🌊 Marine Conditions — `https://marine-api.open-meteo.com/v1/marine`

---

## 📂 Repository Structure

```text
Project-1/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/        # AuthContext (in-memory JWT)
│       ├── pages/
│       ├── services/        # apiClient + one service per resource
│       └── utils/
├── backend/
│   ├── app/
│   │   ├── models/           # one file per table
│   │   ├── routes/           # one blueprint per resource
│   │   └── utils/            # ownership + admin decorators, pagination
│   ├── migrations/
│   └── seed.py
├── docs/
│   ├── api/
│   ├── design/
│   ├── development/
│   └── presentation/
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Run Locally

**Backend** — see [`backend/README.md`](./backend/README.md) for full
setup instructions.

**Frontend**
```bash
cd frontend
npm install

# create frontend/.env
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

npm run dev
```

---

## ✨ Core Functionality

### For visitors
- Search any coastal location and see **live** weather + marine
  conditions (not demo data)
- Read community safety reports for a location
- Browse admin-approved business/facility listings — see lifeguard
  availability, hours, and amenities at a glance

### For account holders
- Sign up, log in, log out (JWT, with real server-side revocation)
- Submit a safety report tied to a location
- Submit a facility listing for admin review

### For admins
- Review pending business listings
- Approve or reject a listing before it becomes publicly visible

---

## 🔐 Auth & Ownership

Every write to a `SafetyReport` or `Business` is checked against the
authenticated user's ID via a single shared `owns_resource` decorator —
users can only edit or delete records they created. Business listings
additionally require admin approval (`status: pending → approved`)
before they're visible to the public, enforced via a shared
`admin_required` decorator. Both live in
`backend/app/utils/decorators.py` — one place, never duplicated per
route.

---

## 🌳 Git Strategy

One repository, one root (`Project-1/`), feature-branch workflow for
every chunk of work:

```text
feature/backend-api
feature/frontend-auth-integration
feature/business-listings
```

Merged via GitHub pull requests with `--no-ff`, so history stays
readable and every feature has a visible review trail.

**Commit convention:**
```text
feat:  new functionality
fix:   bug fixes
chore: tooling, config, dependencies
docs:  documentation
style: formatting / non-functional UI changes
```

---

## 🧭 Development Principles

- Keep components focused and reusable
- Keep API calls inside service modules, never inline in UI components
- Handle loading, errors, empty states, and success explicitly
- One shared helper per concern (pagination, ownership, admin checks) —
  never duplicated per resource
- Feature-branch workflow for every new chunk of work
