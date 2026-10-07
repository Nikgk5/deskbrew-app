# ☕️ DeskBrew — Remote Work Cafe Finder

*[Διαβάστε το README στα Ελληνικά (Read in Greek)](README_GR.md)*

DeskBrew is a full-stack, map-based web application tailored specifically for digital nomads and remote workers. Designed with a clean, Airbnb-inspired aesthetic, the app allows users to seamlessly discover work-friendly cafes and workspaces globally based on critical metrics like WiFi speed, quietness, and available power outlets.

> **🌍 Live Demo:** [https://deskbrew-app.vercel.app](https://deskbrew-app.vercel.app)

> **Note to Recruiters:** This repository is heavily engineered on the backend to showcase robust **Python**, **SQL**, and **Database Administration** skills. While the frontend features a premium, polished user interface, the core of the application relies on advanced spatial queries, database automation, and a highly structured Python REST API.

---

## 🐍 Python & SQL Engineering Highlights

This project was built from the ground up to demonstrate a production-ready approach to backend architecture, data management, and automated maintenance. 

### 1. Robust Data Pipelines & Seeding Automation
Instead of manual database entries, the project uses a custom-built data migration pipeline combining **Python** and **SQL**:
- **`backend/run_seed_*.py` Scripts:** These Python scripts automate the process of securely connecting to the PostgreSQL database via `SQLAlchemy` and executing complex SQL migrations. 
- **`backend/sql/*.sql` Files:** These files define the database schema and insert curated data. They are written to be **idempotent** (meaning they can run multiple times without causing errors or duplicating data) by using advanced PostgreSQL commands like `ON CONFLICT DO UPDATE`. This allows the database to be updated seamlessly as new cafes are added.

### 2. Geospatial Database Architecture (PostGIS)
Finding cafes within a specific map view requires highly optimized database queries:
- **Spatial Data Types:** The database leverages the **PostGIS** extension to store cafe locations not just as numbers, but as actual geographic points (`ST_SetSRID(ST_MakePoint(...))`).
- **Dynamic Bounding Box Queries:** When a user drags the map on the frontend, a Python API endpoint receives the map's coordinates and translates them into a highly efficient SQL query using `ST_MakeEnvelope` and `ST_Within`. This allows the database to instantly filter and return only the cafes currently visible on the user's screen.

### 3. Automated Database Maintenance (`pg_cron`)
To prevent the free-tier cloud database from being suspended due to inactivity, I implemented a zero-cost automated maintenance job:
- **`sql/006_prevent_idle.sql`**: This script enables the native PostgreSQL `pg_cron` extension directly inside the database. It schedules a lightweight, automated background task (`SELECT 1;`) to run every day at midnight. This demonstrates a deep understanding of database-level cron jobs and server resource management.

### 4. High-Performance API Design (FastAPI)
- The entire backend is built with **Python's FastAPI**, known for its speed and asynchronous capabilities.
- It uses **Pydantic V2** to strictly validate all incoming map coordinates and outgoing cafe data, ensuring the frontend never receives malformed data.
- The codebase follows **Domain-Driven Design**, cleanly separating API routes, business logic, and database models for maximum scalability.

---

## 🏗 Full Tech Stack

### Backend
- **Language:** Python 3
- **Framework:** FastAPI
- **Database:** PostgreSQL (hosted on Supabase)
- **Geospatial Engine:** PostGIS
- **ORM:** SQLAlchemy 2.0 & GeoAlchemy2

### Frontend
- **Framework:** Next.js (React) / App Router
- **Map Integration:** Mapbox GL JS via `react-map-gl`
- **Styling:** Tailwind CSS (Custom Design System, Glassmorphism)
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Database Setup
Ensure you have a PostgreSQL database with the PostGIS extension enabled (e.g., via Supabase).
Execute the initialization and seed scripts using the Python runners:
```bash
cd backend
python run_seed_4.py # Sets up schema and initial cafes
python run_seed_5.py # Adds supplementary data
python run_seed_6.py # Enables the pg_cron idle-prevention task
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment variables (copy .env.example to .env and add your DB URL)
cp .env.example .env

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```
API Documentation auto-generates at: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Configure environment variables (copy .env.local.example to .env.local and add your Mapbox token)
cp .env.local.example .env.local

# Run the Next.js development server
npm run dev
```
Open `http://localhost:3000` in your browser.

---
*Designed & Engineered as a comprehensive portfolio piece showcasing scalable backend architecture, SQL proficiency, and premium frontend execution.*
