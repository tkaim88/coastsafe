# 🌊 CoastSafe Backend

Flask + PostgreSQL API for CoastSafe — handles user accounts, community
safety reports, and business (facility) listings, including an
admin-gated approval workflow so not just any business can self-list.
Pairs with the React frontend, which calls Open-Meteo directly for live
weather and marine conditions.

🔗 **Live API:** [coastsafe.onrender.com](https://coastsafe.onrender.com)

---

## 🛠️ Technologies Used

| | |
|---|---|
| 🐍 **Flask 3** | Application framework, app-factory pattern |
| 🔗 **Flask-SQLAlchemy** | ORM / PostgreSQL models |
| 🔀 **Flask-Migrate** | Versioned schema migrations |
| 🔑 **Flask-JWT-Extended** | JWT auth, with real token revocation on logout |
| 🌐 **Flask-CORS** | Restricts API access to known frontend origins |
| 🗄️ **PostgreSQL** | Relational database (hosted on Supabase) |
| 🚀 **Gunicorn** | Production WSGI server (Render) |

---

## 📂 Project Structure

```text
backend/
├── app/
│   ├── __init__.py          # application factory
│   ├── config.py            # environment-based config classes
│   ├── extensions.py        # shared extension instances (db, jwt, etc.)
│   ├── models/               # one file per table + to_dict() serialization
│   │   ├── user.py            # includes is_admin flag
│   │   ├── business.py        # includes status: pending/approved/rejected
│   │   ├── safety_report.py
│   │   ├── location.py
│   │   └── token_blocklist.py
│   ├── routes/                # one blueprint per resource
│   └── utils/
│       ├── decorators.py     # owns_resource + admin_required
│       ├── pagination.py     # shared paginate_query helper
│       └── errors.py         # centralized JSON error handlers
├── migrations/
├── seed.py                    # seeds starter coastal locations
├── run.py                     # entry point (FLASK_APP)
├── runtime.txt                # pins Python version for deployment
├── requirements.txt
└── .env.example
```

---

## 🚀 Setup & Run Locally

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then fill in real values, especially DATABASE_URL

# Create the database (adjust to your local Postgres setup)
createdb coastsafe

flask db init                   # first time only
flask db migrate -m "Initial tables"
flask db upgrade

python seed.py                  # populate starter locations

flask run
```

The API runs at `http://localhost:5000` by default.

---

## 🔌 Core Endpoints

### 🔑 Auth — `/api/auth`
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/signup` | — | Create an account (`role`: `user` or `business_owner`) |
| POST | `/login` | — | Returns a JWT access token |
| POST | `/logout` | required | Revokes the current token |
| GET | `/me` | required | Returns the logged-in user |

### 📝 Safety Reports — `/api/reports`
Full CRUD, owner-restricted writes.

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/?page=1&per_page=10` | — | Paginated list, optional `?location_id=` filter |
| GET | `/<id>` | — | Single report |
| POST | `/` | required | Create a report |
| PATCH | `/<id>` | required + owner | Update your own report |
| DELETE | `/<id>` | required + owner | Delete your own report |

### 🏨 Businesses — `/api/businesses`
Full CRUD, owner-restricted writes, **admin-gated visibility**.

| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/?page=1&per_page=10` | — | Paginated list of **approved** listings only, optional `?location_id=` / `?lifeguard_available=true` filters |
| GET | `/<id>` | — | Single listing |
| GET | `/mine` | required | Your own listings, **regardless of status** |
| GET | `/pending` | required + admin | Review queue of listings awaiting approval |
| POST | `/` | required | Create a listing — always starts as `status: pending` |
| PATCH | `/<id>` | required + owner | Update your own listing (cannot change its own status) |
| PATCH | `/<id>/status` | required + admin | Approve or reject a pending listing |
| DELETE | `/<id>` | required + owner | Delete your own listing |

### 📍 Locations — `/api/locations`
Read-only.

| Method | Route | Description |
|---|---|---|
| GET | `/` | List all locations |
| GET | `/<id>` | Single location |

---

## 🔐 Authentication, Ownership & Admin Access

- **Ownership:** every write to a `SafetyReport` or `Business` is checked
  against the authenticated user's ID via the shared `owns_resource`
  decorator (`app/utils/decorators.py`) — a user can only edit or delete
  records they created. This logic lives in exactly one place, never
  duplicated per route.
- **Business approval:** a new listing always starts with
  `status: pending` and is invisible to the public until an admin
  approves it — enforced server-side, not something an owner can set
  themselves. Approval is gated by the shared `admin_required` decorator,
  mirroring the same "one shared helper" pattern as ownership checks.
- **Becoming an admin:** `is_admin` is a plain boolean on the `User`
  model. There's no in-app promotion flow by design — it's set directly
  in the database for the platform operator.

---

## ☁️ Deployment

| Layer | Host | Notes |
|---|---|---|
| 🐍 API | [Render](https://render.com) (free tier) | `gunicorn run:app`, Python pinned via `runtime.txt` / `PYTHON_VERSION` env var |
| 🗄️ Database | [Supabase](https://supabase.com) (free tier) | PostgreSQL, connected via session pooler |
| ⚛️ Frontend | [Vercel](https://vercel.com) | Points at the Render API via `VITE_API_BASE_URL` |

`FRONTEND_ORIGINS` in `.env` controls which origins CORS accepts —
set to the deployed Vercel URL in production.

> ⚠️ Render's free tier spins down after periods of inactivity. The
> first request after idle time can take up to ~50 seconds to respond
> while the instance wakes up — this is expected, not a bug.
