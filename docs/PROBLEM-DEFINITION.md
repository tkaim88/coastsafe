# CoastSafe — Problem Definition

## What User Problem Am I Solving?

People planning a coastal visit may need weather, wind, wave and other marine information before deciding what to do.

This information can be spread across multiple services and may be difficult to interpret quickly.

CoastSafe provides a single interface that presents relevant coastal conditions in a simple and understandable format.

---

## Who Is the User?

The primary users are:

### Beachgoers

People checking conditions before going to the beach.

### Tourists

Visitors who may be unfamiliar with local coastal conditions.

### Coastal Residents

People who regularly visit nearby beaches and want quick condition updates.

### Water-Sports Enthusiasts

Users interested in swimming, surfing, boating or similar activities.

### Outdoor Activity Planners

People deciding whether coastal conditions are appropriate for planned activities.

---

## How Does the User Interact With the Application?

The expected flow is:

```text
Open CoastSafe
     ↓
Search for a coastal location
     ↓
Select location
     ↓
Fetch coordinates
     ↓
Fetch weather and marine information
     ↓
Display current conditions
     ↓
Review forecast

What Does the User Expect?

The user expects:

Fast results
Clear information
Useful visual hierarchy
Mobile responsiveness
Understandable weather and marine measurements
Helpful feedback when a request fails
No unnecessary registration during Phase 1
Why Can the Idea Grow?

CoastSafe has a natural path into a full-stack application.

Phase 2 can introduce:

Beach/location records
Persistent data
Backend business logic
Administrative data

Phase 3 can introduce:

User accounts
Favorites
Saved locations
Reviews
Reports
User-owned records
Scope Limitation

CoastSafe is a consumer information and planning application.

It does not provide:

Emergency response
Professional marine navigation
Guaranteed safety assessments
Lifeguard services
Official maritime warnings

Marine model data will therefore be displayed as informational data with appropriate context.
# CoastSafe — Problem Definition

## 1. Project Overview

**Project Name:** CoastSafe

**Tagline:** Know Before You Go.

CoastSafe is a consumer-facing web application designed to help people make better-informed decisions before visiting beaches and other coastal locations.

The application brings relevant weather and marine conditions into a single, simple interface. Instead of requiring users to consult multiple sources, CoastSafe provides a focused view of current conditions and short-term forecasts for a selected coastal location.

Phase 1 of the project will be developed as a React frontend that consumes public APIs. The application will later be extended with a Flask backend and PostgreSQL database in Phase 2, followed by authentication and user-owned functionality in Phase 3.

---

## 2. What Problem Am I Solving?

People planning a visit to a beach or coastal location may want to know the current weather and marine conditions before deciding whether to go, what activities to participate in, or what precautions to take.

Relevant information such as:

* Temperature
* Wind speed
* Wind direction
* Precipitation
* Wave height
* Wave direction
* Wave period
* Sea-surface temperature
* Forecast conditions

may be available from different sources and presented in formats that are difficult for a casual user to interpret quickly.

### The Problem

There is a need for a simple, focused interface that brings relevant coastal conditions together so users can quickly understand the conditions at a selected location.

### The CoastSafe Solution

CoastSafe provides a single interface where a user can:

1. Search for a coastal location.
2. Select the desired location.
3. View current weather conditions.
4. View current marine conditions.
5. Review a short-term forecast.
6. Interpret the information through a clear visual interface.

---

## 3. Who Is the User?

### Primary Users

#### Beachgoers

People planning a visit to the beach who want to check the weather and marine conditions before leaving.

#### Tourists

Visitors who may be unfamiliar with local coastal conditions and want an easy way to understand the environment before visiting a beach.

#### Coastal Residents

People living near the coast who regularly visit beaches and want quick access to current conditions.

#### Water-Sports Enthusiasts

Users interested in activities such as swimming, surfing, kayaking, boating, snorkeling, or other coastal activities.

#### Outdoor Activity Planners

People organizing recreational activities who need current and forecast conditions when deciding whether an outdoor coastal activity is appropriate.

---

## 4. User Needs

CoastSafe is designed around several core user needs.

### Quick Access to Information

Users should be able to obtain useful information without navigating through multiple websites.

### Easy Understanding

Weather and marine data should be presented in a way that is understandable to a non-technical user.

### Location-Based Information

Users should be able to search for a location and receive information relevant to that location.

### Current Conditions

Users should be able to see the latest available weather and marine conditions.

### Forecast Information

Users should be able to review upcoming conditions rather than relying only on the current state.

### Clear Feedback

Users should understand when data is loading, when a search fails, or when information cannot be retrieved.

---

## 5. How Does the User Interact With the Application?

The primary user journey is:

```text
Open CoastSafe
      ↓
Search for a coastal location
      ↓
View search results
      ↓
Select a location
      ↓
Retrieve location coordinates
      ↓
Fetch weather information
      ↓
Fetch marine information
      ↓
Display current conditions
      ↓
Review forecast
```

### Example

A user searches for:

```text
Mombasa
```

CoastSafe uses the location search to identify the relevant coordinates.

Those coordinates are then used to request:

* Weather information
* Marine information
* Forecast information

The application combines the results into a single location view.

---

## 6. What Does the User Expect?

A user interacting with CoastSafe should reasonably expect:

### Fast Response

The application should provide feedback while data is loading and display results as soon as the API requests complete.

### Clear Interface

Important information should be visually prominent and easy to scan.

### Responsive Design

The interface should work across:

* Mobile phones
* Tablets
* Laptops
* Desktop computers

### Accurate Data Presentation

The application should clearly display values returned by the API and avoid misleading interpretations.

### Error Feedback

If data cannot be retrieved, the user should receive a meaningful message rather than a blank screen.

### Search Feedback

If a location cannot be found, the user should receive clear feedback and be able to try another search.

---

## 7. Why Is CoastSafe Useful?

CoastSafe is intended to reduce the effort required to gather basic coastal condition information.

Instead of presenting a large amount of unrelated meteorological data, the application focuses on information that is particularly relevant to someone planning a coastal visit.

The goal is not to replace professional weather services or official marine authorities. The goal is to provide a convenient consumer-facing interface for general planning and awareness.

---

## 8. Phase 1 Scope

Phase 1 will focus on the React frontend.

### Phase 1 will include:

* React application
* Vite
* JavaScript
* JSX
* Tailwind CSS
* React Router
* Public API integration
* Location search
* Weather information
* Marine information
* Forecast information
* Loading states
* Error handling
* Conditional rendering
* Responsive design
* Reusable React components
* Git and GitHub workflow
* Project documentation

### Planned Phase 1 Views

The application will initially contain at least the following views:

1. **Home**
2. **Explore**
3. **Location Details**
4. **About**

The assignment requires at least three views or major components, and CoastSafe will exceed that minimum.

---

## 9. Phase 2 Growth Potential

CoastSafe is intentionally designed so that the Phase 1 frontend can grow into a full-stack application.

Phase 2 will introduce:

* Flask
* Flask REST API
* PostgreSQL
* Persistent data
* Database models
* CRUD operations
* Backend business logic

Potential database entities may include:

* Coastal locations
* Beaches
* Facilities
* Reports
* Conditions
* Other application-specific data

The React application will communicate with the Flask backend instead of depending entirely on direct public API requests.

---

## 10. Phase 3 Growth Potential

Phase 3 will introduce user accounts and personalized functionality.

Potential features include:

### User Registration

Users will be able to create accounts.

### Authentication

Users will be able to securely log in and log out.

### Favorite Locations

Users will be able to mark frequently visited locations as favorites.

### Saved Locations

Users will be able to maintain a personal list of coastal locations.

### User Reports

Users may eventually be able to submit information or observations about coastal locations.

### User-Owned Data

Resources created or managed by an authenticated user will belong to that user and be protected by authorization rules.

---

## 11. Why Can This Idea Become a Full-Stack Application?

CoastSafe has a natural progression from a public-API frontend into a complete full-stack application.

### Phase 1

```text
React
   ↓
Open-Meteo APIs
   ↓
Coastal Conditions Interface
```

### Phase 2

```text
React
   ↓
Flask REST API
   ↓
PostgreSQL
```

### Phase 3

```text
React
   ↓
Flask REST API
   ↓
Authentication
   ↓
PostgreSQL
   ↓
User-Owned Data
```

This means the work completed in Phase 1 will form the foundation of the later phases rather than becoming a standalone application that must be rebuilt.

---

## 12. Important Scope Limitation

CoastSafe is an informational consumer application.

It is **not** intended to replace:

* Lifeguards
* Emergency services
* Official weather warnings
* Maritime authorities
* Professional marine forecasting
* Navigation systems
* Professional safety assessments

Marine and weather information will be presented for general planning and awareness.

Where the underlying API has known limitations, the application will avoid presenting the information as a guaranteed safety assessment.

---

## 13. Success Criteria

The Phase 1 application will be considered successful when a user can:

1. Open the CoastSafe application.
2. Search for a coastal location.
3. Find a relevant location.
4. Open the location details.
5. View weather conditions.
6. View marine conditions.
7. Review forecast information.
8. Understand when data is loading.
9. Receive useful feedback when an API request fails.
10. Use the application successfully on different screen sizes.

---

## 14. Problem Statement

### Final Problem Statement

> People visiting beaches and other coastal locations may need to consult multiple sources to understand current weather and marine conditions before planning a visit or activity. CoastSafe addresses this problem by providing a simple, consumer-focused interface that combines location-based weather, marine conditions, and forecast information in one place. The application will begin as a React frontend using public APIs and will later evolve into a Flask and PostgreSQL full-stack application with authenticated, user-owned features.

---

## 15. Project Direction

CoastSafe will prioritize:

* Simplicity
* Usability
* Clear information architecture
* Responsive design
* Maintainable React code
* Separation of UI and API logic
* Meaningful error handling
* Documentation
* Incremental Git commits
* A clear path toward the Phase 2 and Phase 3 requirements
