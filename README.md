🌊 CoastSafe
Real-time water safety for Kenya's coast.
CoastSafe helps beachgoers check live weather and marine conditions before heading out, read and share community safety reports for specific locations, and discover verified facilities — pools, water parks, and resorts — including lifeguard availability. Business owners can list and manage their facilities directly on the platform.
🔗 Live app: coastsafe.vercel.app

🎞️ Project presentation: Google Slides

📦 Repo: tkaim88/coastsafe

Table of Contents
·	Overview
·	Features
·	Tech Stack
·	Architecture
·	Getting Started
o	Prerequisites
o	Backend Setup
o	Frontend Setup
·	Environment Variables
·	API Overview
·	Project Structure
·	Deployment
·	Roadmap
·	Author

Overview
Kenya's coastline draws thousands of visitors, but there's no easy way to check real-time water conditions or know which beaches and facilities have lifeguards on duty before you go. CoastSafe solves this with two connected experiences:
·	Visitors get live weather and marine conditions per location, community-submitted safety reports, and a directory of nearby facilities with lifeguard and amenity details.
·	Business owners can list pools, water parks, and resorts — advertising lifeguard availability, hours, and amenities — subject to admin approval before going live.
The project is designed to expand beyond Kenya's coast to other water bodies over time.
Features
·	🌤️ Live conditions for any coastal location, powered by the Open-Meteo Geocoding, Weather, and Marine APIs (no API key required)
·	📝 Community safety reports — authenticated users can create, edit, and delete their own reports per location
·	🏖️ Verified business listings — facility type, lifeguard availability and hours, and amenities, searchable by location
·	🔐 JWT authentication with real token revocation, in-memory token storage (never localStorage), and ownership enforcement on every protected resource
·	🛠️ Admin review queue for approving or rejecting new business listings
·	📍 Dynamic location resolution — business owners can list a facility at any coastal location; new locations are created on the fly and merged safely with the curated set
·	📱 Fully responsive, light ocean-themed UI
Tech Stack
Layer	Technology
Frontend	React, Vite, Tailwind CSS, React Router
Backend	Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, Flask-CORS
Database	PostgreSQL (hosted on Supabase)
External data	Open-Meteo (Geocoding, Weather, Marine APIs)
Frontend hosting	Vercel
Backend hosting	Render

Architecture
┌──────────────┐        HTTPS/JSON        ┌──────────────┐        SQL         ┌──────────────┐
│   Frontend   │ ───────────────────────▶ │   Backend    │ ─────────────────▶ │  PostgreSQL  │
│ React/Vite   │ ◀─────────────────────── │ Flask API    │ ◀───────────────── │  (Supabase)  │
│ (Vercel)     │      JWT-authed          │  (Render)    │                    │              │
└──────────────┘                          └──────────────┘                    └──────────────┘
       │
       │  live weather / marine / geocoding
       ▼
┌──────────────┐
│  Open-Meteo  │
└──────────────┘

Core backend building blocks:
·	App-factory pattern with a modular structure (models, routes, decorators, extensions)
·	Models:User, Location, SafetyReport, Business, TokenBlocklist
·	Shared owns_resource decorator enforces per-resource ownership consistently across reports and listings, instead of duplicating checks per route
·	admin_required decorator gates the business review queue
·	Pagination on all list endpoints
Getting Started
Prerequisites
·	Node.js 18+ and npm
·	Python 3.11+
·	A PostgreSQL database (local, or a free Supabase project)
Backend Setup
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then fill in the values — see below
flask db upgrade
flask run

The API will be available at http://localhost:5000.
Frontend Setup
cd frontend
npm install

cp .env.example .env            # then fill in the values — see below
npm run dev

The app will be available at http://localhost:5173.
Environment Variables
Backend (backend/.env)
Variable	Description
FLASK_APP	Entry point, e.g. run.py
FLASK_ENV	development or production
SECRET_KEY	Flask secret key
DATABASE_URL	PostgreSQL connection string (use the Supabase session pooler URL if your network lacks IPv6)
JWT_SECRET_KEY	Secret used to sign JWTs
JWT_ACCESS_TOKEN_EXPIRES_MINUTES	Access token lifetime
FRONTEND_ORIGINS	Comma-separated allowed CORS origins

Frontend (frontend/.env)
Variable	Description
VITE_API_BASE_URL	Base URL of the backend API, e.g. http://localhost:5000/api

API Overview
Method	Endpoint	Description
POST	/api/auth/signup	Create an account
POST	/api/auth/login	Log in, receive a JWT
POST	/api/auth/logout	Revoke the current token
GET	/api/locations	List locations
POST	/api/locations/resolve	Find or create a location by name (auth required)
GET	/api/reports	List safety reports
POST	/api/reports	Create a report (auth required)
PATCH / DELETE	/api/reports/:id	Update or delete own report (owner only)
GET	/api/businesses	List approved business listings (public)
GET	/api/businesses/mine	List the current user's own listings, any status
GET	/api/businesses/pending	List pending listings (admin only)
POST	/api/businesses	Submit a new listing (auth required, starts as pending)
PATCH	/api/businesses/:id/status	Approve or reject a listing (admin only)

Project Structure
coastsafe/
├── backend/
│   ├── app/
│   │   ├── models/          # User, Location, SafetyReport, Business, TokenBlocklist
│   │   ├── routes/          # auth, locations, reports, businesses
│   │   ├── decorators.py    # owns_resource, admin_required
│   │   └── __init__.py      # app factory
│   ├── migrations/
│   ├── seed.py
│   └── run.py
└── frontend/
    └── src/
        ├── components/      # Navbar, ReportForm, BusinessForm, LocationCard, ...
        ├── pages/            # Home, Explore, LocationDetails, Login, Signup,
        │                     # ListYourBusiness, MyListings, AdminReviewQueue, About
        ├── services/         # apiClient, authApi, locationsApi, reportsApi, businessesApi
        ├── context/          # AuthContext (in-memory JWT)
        └── data/             # coastalLocations.js (curated locations)

Deployment
Layer	Platform	Notes
Frontend	Vercel	Auto-deploys on push to main; SPA rewrite configured via vercel.json
Backend	Render	Free tier; gunicorn run:app
Database	Supabase	Connected via the session pooler for IPv4 compatibility

Roadmap
·	Expand coverage beyond Kenya's coast to other East African water bodies
·	Native mobile app with push safety alerts
·	Self-service appointment/booking for lifeguarded facilities
·	Admin-only client-side route guard for /admin/businesses (currently enforced server-side only)
Author
Built by Thomas as a full-stack capstone project.
