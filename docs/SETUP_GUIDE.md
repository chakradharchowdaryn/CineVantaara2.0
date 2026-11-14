# CineVantaara — Comprehensive Setup & Developer Guide

---

## Prerequisites
- **Node.js:** v18+ or v20+ (Tested on Node v24.18)
- **Java:** JDK 21+ (Tested on Oracle JDK 21.0.11 LTS)
- **Apache Maven:** 3.9+ (Included or `mvn.cmd`)
- **Python:** 3.10+ (Tested on Python 3.14)
- **PostgreSQL (Optional for local test):** System includes embedded H2 dual-mode for zero-prerequisite instant execution.

---

## 1. Quick Start (Run in 3 Simple Steps)

### Step 1: Start Frontend Client
```bash
cd frontend
npm.cmd install    # (or npm install)
npm.cmd run dev    # (or npm run dev)
```
Frontend runs on: `http://localhost:5173`

### Step 2: Start Spring Boot Backend
```bash
cd backend
mvn.cmd spring-boot:run
```
Backend runs on: `http://localhost:8080` (H2 database console available at `http://localhost:8080/h2-console`).
To run with real PostgreSQL:
```bash
SPRING_PROFILES_ACTIVE=prod mvn.cmd spring-boot:run
```

### Step 3: Start AI Recommendation Microservice
```bash
cd ai_service
pip install -r requirements.txt
python main.py
```
FastAPI runs on: `http://localhost:8000` (Interactive Swagger docs at `http://localhost:8000/docs`).

---

## 2. Instant Persona Switcher (Testing Guide)
When testing CineVantaara, use the **Persona Switcher** dropdown in the top navigation bar or the login quick switcher to instantly experience the visual theme and customized workbench for:
- 🎬 **Director** (Royal Purple / Deep Black / Silver)
- 💼 **Producer** (Emerald Green / Dark Black / Luxury Gold — Recruitment & Opportunities)
- ✍️ **Screenwriter** (Burgundy Red / Charcoal / Cream)
- ✨ **Actor** (Rose Gold / Deep Black / Champagne Gold)
- 🎥 **Cinematographer** (Electric Blue / Navy / Silver)
- ✂️ **Film Editor** (Cyan / Dark Navy / White)
- 🎵 **Composer / Music Director** (Deep Violet / Midnight Blue / Gold)
- 🪄 **VFX Artist** (Neon Teal / Deep Black / Electric Blue)
- 💄 **Makeup Artist** (Rose Pink / Plum / Soft Gold)
- 👗 **Costume Designer** (Terracotta / Warm Brown / Gold)
- 🏛️ **Art Director** (Burnt Orange / Dark Brown / Beige)
- 🔊 **Sound Designer** (Midnight Blue / Neon Cyan / Graphite)
- 🛡️ **Super Admin** (Red / Black Citadel Security Governance)
