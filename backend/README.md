# CoastSafe Backend

Flask + PostgreSQL API for CoastSafe — handles user accounts, community
safety reports, and business (facility) listings. Pairs with the existing
React frontend, which continues to call Open-Meteo directly for live
weather and marine conditions.

## Technologies Used

- **Flask 3** — application framework, organized with the app-factory pattern
- **Flask-SQLAlchemy** — ORM / PostgreSQL models
- **Flask-Migrate** — versioned schema migrations
- **Flask-JWT-Extended** — JWT authentication, with real token revocation on logout
- **Flask-CORS** — restricts API access to known frontend origins
- **PostgreSQL** — relational database

## Project Structure

```
backend/
├── app/
│   ├── __init__.py         # application factory
│   ├── config.py           # environment-based config classes
│   ├── extensions.py       # shared extension instances (db, jwt, etc.)
│   ├── models/              # one file per table + to_dict() serialization
│   ├── routes/              # one blueprint per resource
│   └── utils/
│       ├── decorators.py   # owns_resource — shared ownership enforcement
│       ├── pagination.py   # shared paginate_query helper
│       └── errors.py       # centralized JSON error handlers
├── seed.py                  # seeds the six Phase 1 coastal locations
├── run.py                   # entry point (FLASK_APP)
├── requirements.txt
└── .env.example
```

## Setup & Run

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

python seed.py                  # populate the six starter locations

flask run
```

The API runs at `http://localhost:5000` by default.

## Core Functionality

### Auth (`/api/auth`)
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/signup` | — | Create an account (`role`: `user` or `business_owner`) |
| POST | `/login` | — | Returns a JWT access token |
| POST | `/logout` | required | Revokes the current token |
| GET | `/me` | required | Returns the logged-in user |

### Safety Reports (`/api/reports`) — full CRUD, owner-restricted writes
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/?page=1&per_page=10` | — | Paginated list, optional `?location_id=` filter |
| GET | `/<id>` | — | Single report |
| POST | `/` | required | Create a report |
| PATCH | `/<id>` | required + owner | Update your own report |
| DELETE | `/<id>` | required + owner | Delete your own report |

### Businesses (`/api/businesses`) — full CRUD, owner-restricted writes
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/?page=1&per_page=10` | — | Paginated list, optional `?location_id=` / `?lifeguard_available=true` filters |
| GET | `/<id>` | — | Single listing |
| POST | `/` | required | Create a facility listing |
| PATCH | `/<id>` | required + owner | Update your own listing |
| DELETE | `/<id>` | required + owner | Delete your own listing |

### Locations (`/api/locations`) — read-only
| Method | Route | Description |
|---|---|---|
| GET | `/` | List all locations |
| GET | `/<id>` | Single location |

## Authentication & Ownership

Every write to a `SafetyReport` or `Business` is checked against the
authenticated user's ID via the shared `owns_resource` decorator
(`app/utils/decorators.py`) — a user can only edit or delete records they
created. This logic lives in exactly one place rather than being
duplicated per route.

## Deployment

Not yet deployed — planned target is Render or Railway for the API,
paired with the existing Vercel-hosted frontend. `FRONTEND_ORIGINS` in
`.env` controls which origins CORS will accept once deployed.
