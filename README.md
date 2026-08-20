# CoastSafe

CoastSafe is a consumer-facing coastal conditions application designed to help users make better-informed decisions before visiting beaches and other coastal locations.

The project is being developed as a three-phase Moringa School capstone. Phase 1 focuses on the React frontend and public API integration. Phase 2 will introduce a Flask backend and PostgreSQL database. Phase 3 will add authentication and user-owned functionality.

---

## Project Objective

CoastSafe brings relevant weather and marine information into one simple interface for people planning coastal activities.

Users can:

- Discover coastal locations.
- Search for a location.
- View current weather conditions.
- View marine conditions.
- Review short-term forecasts.
- Interpret conditions through a simple visual safety-oriented summary.

CoastSafe is an informational planning tool. It is not a navigation system, emergency service, lifeguard replacement, or professional marine advisory system.

---

## Capstone Phases

### Phase 1 — React Application

The first phase focuses on:

- React
- Vite
- JavaScript
- JSX
- React Router
- Tailwind CSS
- Open-Meteo public APIs
- Dynamic API fetching
- Loading states
- Error handling
- Conditional rendering
- Responsive design
- Multiple views/components
- Git/GitHub
- Documentation
- Deployment

### Phase 2 — Flask Backend

The application will be extended with:

- Flask
- REST API endpoints
- PostgreSQL
- Database models
- CRUD operations
- Persistent application data
- Backend business logic

### Phase 3 — Authentication and User-Owned Data

The application will eventually support:

- User registration
- Login
- Logout
- Authentication
- User profiles
- Saved coastal locations
- Favorite locations
- User reports
- User-owned data

---

## Technology Stack

### Phase 1

- React
- Vite
- JavaScript
- JSX
- React Router
- Tailwind CSS
- Open-Meteo Geocoding API
- Open-Meteo Weather Forecast API
- Open-Meteo Marine API

### Phase 2

- Flask
- PostgreSQL
- SQLAlchemy
- REST API

### Phase 3

- Authentication
- Authorization
- User-owned resources

---

## External APIs

### Geocoding

```text
https://geocoding-api.open-meteo.com/v1/search
Used to convert a location name into latitude and longitude.

Weather
https://api.open-meteo.com/v1/forecast

Used for atmospheric weather conditions and forecasts.

Marine
https://marine-api.open-meteo.com/v1/marine

Used for wave and other marine conditions.

Repository Structure
Project-1/
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── data/
│       ├── pages/
│       ├── services/
│       └── utils/
├── backend/
├── docs/
│   ├── api/
│   ├── design/
│   ├── development/
│   └── presentation/
├── .gitignore
└── README.md
Current Project Status

Phase 1 — Project initialization and API validation completed.

Next milestone:

Application shell and React routing.

Development Principles

The project will follow these principles:

Keep components focused and reusable.
Keep API calls inside service modules rather than UI components.
Handle loading, errors, empty results and successful responses explicitly.
Keep documentation updated throughout development.
Maintain meaningful Git commits for every major milestone.
Keep Phase 2 and Phase 3 requirements in mind when making Phase 1 architectural decisions.
Git Strategy

This is one repository covering all three phases.

The repository root is:

Project-1/

Git is initialized only at the repository root.

Example commit messages:

chore: initialize CoastSafe project
docs: document CoastSafe problem and API research
fix: correct Open-Meteo marine API endpoint
feat: add CoastSafe application shell
feat: implement location search
feat: integrate weather API
feat: integrate marine API
fix: handle API request failures
style: improve responsive dashboard layout
docs: update Phase 1 documentation
Phase 1 Assignment Deliverables
Working React application
Dynamic public API integration
Loading/error state handling
At least three views or major components
Meaningful styling
GitHub repository
README
Optional deployment
5–7 slide presentation
5–10 minute video presentation
Written reflection
Peer response

