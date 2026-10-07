# ☕️ DeskBrew — Explore Remote Work Cafes

DeskBrew is a professional, full-stack map-based web application tailored specifically for digital nomads seeking the best remote-work cafes. It features an Airbnb-inspired split-screen layout, real-time map bounds querying, and nomad-centric metrics (WiFi speeds, outlet availability, quietness scores).

![DeskBrew Desktop UI Concept](https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&q=80) <!-- Replace with actual screenshot -->

## 🏗 Architecture & Tech Stack

This project strictly separates the backend API from the frontend UI, communicating via a RESTful JSON API.

### 🐍 Backend (Python / FastAPI)
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) - High performance, automatic OpenAPI documentation.
- **Database:** PostgreSQL hosted on [Supabase](https://supabase.com).
- **ORM & Spatial Queries:** SQLAlchemy 2.0 with [GeoAlchemy2](https://geoalchemy-2.readthedocs.io/).
- **Geospatial Engine:** [PostGIS](https://postgis.net/) enabling sub-millisecond bounding-box viewport queries (`ST_Within`, `ST_MakeEnvelope`) backed by a GIST index.
- **Validation:** Pydantic V2 for strict API request/response contracts.
- **Structure:** Domain-driven design separating routes (`api/`), business logic (`crud/`), schemas (`schemas/`), and models (`models/`).

### ⚛️ Frontend (Next.js / React)
- **Framework:** [Next.js](https://nextjs.org/) App Router for server/client component rendering.
- **Map Integration:** [react-map-gl](https://visgl.github.io/react-map-gl/) wrapping Mapbox GL JS for smooth, interactive cartography.
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) mapped to a custom design system reflecting an "Apple Maps Light Mode" aesthetic (glassmorphism, subtle shadows, crisp typography).
- **Icons:** [Lucide React](https://lucide.dev/).
- **State Management:** React hooks synchronizing Mapbox `viewState` with the sidebar's data fetching layer.

## 🚀 Getting Started

### 1. Database Setup (Supabase)
1. Create a new [Supabase](https://supabase.com/) project.
2. Go to the SQL Editor and execute the schema initialization script:
   ```bash
   cat backend/sql/001_create_cafes_table.sql
   ```
3. Execute the seed data script to populate Berlin cafes:
   ```bash
   cat backend/sql/002_seed_cafes.sql
   ```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase Postgres URL

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```
API Documentation available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your Mapbox Public Token

# Run the Next.js development server
npm run dev
```
Open `http://localhost:3000` in your browser.

## 🎨 UI/UX Highlights
- **Dynamic Bounding Box Search:** As the user pans and zooms the map, the frontend calculates the geographic bounding box coordinates (SW/NE corners) and triggers a fast PostGIS query, dynamically updating the sidebar.
- **Rich Cafe Profile Cards:** Features custom AI Insights, visual metric pills (WiFi, Outlets, Quietness), and live availability indicators.
- **Custom Mapbox Styling:** Floating circular score markers, disabled default logos/controls, and custom Apple-style map switchers (Map/Satellite).

## 🧪 Testing
The backend includes a suite of integration tests using FastAPI's `TestClient`.
```bash
cd backend
pytest tests/
```

---
*Designed & Engineered as a portfolio piece showcasing scalable API design and premium frontend execution.*
