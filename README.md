# Ashaduzzaman Shaun - Dynamic Portfolio & Full-Stack CMS

A high-performance, dynamic portfolio website and Content Management System (CMS) engineered for **Ashaduzzaman Shaun** (International Business Management student at IBA Denmark & Business Development Enthusiast).

Built with **React 19**, **Express.js**, **MongoDB Atlas**, **Vercel Serverless Architecture**, and protected with enterprise-grade defensive security.

---

## 🌟 Key Features

1. **Agile Engineering & MVC Architecture**: Structured following industry-standard Agile delivery sprints and Model-View-Controller separation of concerns.
2. **iPhone-Inspired Dynamic Island**:
   - Interactive glassmorphic Dynamic Island navigation bar.
   - Expandable iOS Live Activity capsule with instant status, quick navigation, and fast actions.
3. **One-Click CV Download**:
   - Direct download button for Shaun's authentic Curriculum Vitae (`Shaun_CV.pdf`) in the Hero section and Dynamic Island.
4. **Live In-Browser Photo Studio & Direct Upload**:
   - Upload profile pictures directly from computer or mobile devices.
   - Built-in live photo adjustments: Brightness, Contrast, Saturation, and Monochrome Noir filters.
5. **Modern Direct Contact Channels**:
   - **WhatsApp**: Instant one-tap direct messaging (`+45 71 51 45 43` -> `https://wa.me/4571514543`).
   - **Instagram**: Direct profile integration (`https://www.instagram.com/azshaun`).
   - **Email**: Pre-addressed direct mailing (`azshaunofficial@gmail.com`).
   - **LinkedIn**: Professional network connection.
6. **Zero-Code Secure Admin CMS**:
   - Discrete admin entry (`#admin` URL or triple-clicking `©` in the footer).
   - Secret passcode authentication (`shaun2026`).
   - Manage personal info, CV links, experiences, achievements, and education dynamically.
7. **Hybrid Database Fallback Engine**:
   - Connects to **MongoDB Atlas** when `MONGODB_URI` is provided.
   - Seamlessly falls back to local JSON storage (`backend/data/portfolio.json`) and memory cache when running offline or locally.

---

## 🛡️ Enterprise Security & Defensive Measures

The system incorporates multi-layered defensive security:
- **NoSQL & SQL Injection Defense**: Deep recursive sanitization of incoming requests (`req.body`, `req.query`, `req.params`) automatically stripping malicious MongoDB operators (`$where`, `$gt`, `$ne`, etc.) and SQL payloads.
- **XSS & XML/HTML Entity Defense**: Automatically sanitizes executable tags (`<script>`, `<!ENTITY>`, `<!DOCTYPE>`, and `javascript:` URIs) from CMS form submissions.
- **Defensive HTTP Headers**: Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, `Referrer-Policy`, and restrictive permissions policies.
- **Authentication Rate Limiting**: In-memory IP rate limiter on `/api/auth/login` to prevent credential stuffing and brute-force passcode attacks.
- **Payload Size Restrictions**: Explicit 15MB request payload limit configured in Express body parsers to mitigate denial-of-service (DoS) buffer exhaustion while accommodating high-resolution photo uploads.

---

## 🏛️ Software Architecture: MVC & Design Patterns

### 1. Model-View-Controller (MVC) Separation
```
       ┌────────────────────────────────────────────────────────┐
       │                       CLIENT / VIEW                    │
       │  React 19 UI + iPhone Dynamic Island + Admin Dashboard │
       └───────────────────────────┬────────────────────────────┘
                                   │ HTTP / JSON API
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                      CONTROLLER                        │
       │    Express Controllers (portfolioController, auth)     │
       │    Middlewares: Security, Auth, Rate Limiter           │
       └───────────────────────────┬────────────────────────────┘
                                   │ Data Access
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                         MODEL                          │
       │   Mongoose Schemas (Portfolio, Experience, Profile)    │
       │   Hybrid Store Pattern (MongoDB Atlas / Local JSON)    │
       └────────────────────────────────────────────────────────┘
```

- **Model (`backend/src/models/`, `backend/src/utils/portfolioStore.js`)**: Encapsulates portfolio data structures and validation schemas with MongoDB Mongoose and local JSON fallback persistence.
- **View (`frontend/src/`)**: Built using React 19 and Vite with modular responsive components (`Hero`, `About`, `Experience`, `Achievements`, `Contact`, `Admin`, `Navbar`).
- **Controller (`backend/src/controllers/`, `backend/src/routes/`)**: Express controllers manage business logic, authenticate admin actions, sanitize payloads, and issue structured REST responses.

### 2. Software Architecture Patterns
- **Layered Architecture**: Clear isolation between presentation, business logic, security middleware, and data persistence layers.
- **Repository / Fallback Pattern**: `portfolioStore.js` abstracts the underlying database. The application functions flawlessly regardless of whether MongoDB Atlas is connected or offline.
- **Serverless Cloud Microservice**: `/api/index.js` wraps the Express application to run as Vercel serverless edge functions.

---

## 🏃 Agile Process Model & Development Lifecycle

The project was executed following the **Agile Scrum Methodology**:

1. **Backlog & Requirement Gathering**: User stories defined for personal profile showcase, student CV distribution, international contact channels, photo management, and cloud virtualization.
2. **Sprint 1 (Architecture & CMS Setup)**: Implemented Express REST API, MongoDB schema, and dynamic fallback storage.
3. **Sprint 2 (UI/UX & Dynamic Island)**: Built React 19 frontend with iOS Dynamic Island, glassmorphism design, and responsive layouts.
4. **Sprint 3 (CV Integration & Media Studio)**: Integrated Shaun's actual resume PDF, profile photograph, in-browser Photo Studio filters, and WhatsApp/Instagram channels.
5. **Sprint 4 (Security Hardening & Cloud Virtualization)**: Added NoSQL/XML/XSS injection defense, rate limiting, Vercel cloud configuration, and Git repository setup.

For complete architectural specifications, see [docs/WIKI.md](docs/WIKI.md).

---

## 🚀 Running Locally

```bash
# 1. Install root dependencies
npm install

# 2. Start backend server (Port 5000)
npm run start

# 3. In another terminal, start frontend (Port 5173)
npm run dev:frontend
```

- Open [http://localhost:5173](http://localhost:5173) to view the portfolio.
- Access the Admin Dashboard at [http://localhost:5173/#admin](http://localhost:5173/#admin) (Passcode: `shaun2026`).

---

## ☁️ Virtualization & Cloud Deployment

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "feat: complete Shaun dynamic portfolio with CV, Photo Studio, Security, and MVC architecture"
git branch -M main
git remote add origin https://github.com/sakib276/ashaduzzaman-shaun-portfolio.git
git push -u origin main
```

### Step 2: Deploy to Vercel (1-Click)
1. Go to your [Vercel Dashboard](https://vercel.com/nazmussakib06927-5546s-projects).
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository (`ashaduzzaman-shaun-portfolio`).
4. In **Environment Variables**, add:
   - `ADMIN_SECRET_KEY` = `shaun2026`
   - `MONGODB_URI` = *(Your MongoDB Atlas connection string)*
5. Click **Deploy**. Your portfolio will be live worldwide with a public `https://*.vercel.app` URL!

### Step 3: MongoDB Atlas Free Setup
1. Create a free M0 cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere for Vercel serverless).
3. Under **Database Access**, create a user (e.g. `shaun_admin`).
4. Click **Connect** -> **Drivers** -> Copy connection URI.
5. Paste it into Vercel's Environment Variables and `backend/.env`.

