# Engineering Wiki & Architecture Specification

## Project: Ashaduzzaman Shaun - Dynamic Portfolio & CMS
- **Author / Lead**: sakib276 (Nazmus Sakib)
- **Subject Profile**: Ashaduzzaman Shaun (BSc International Business Management, IBA Denmark)
- **Target Deployment**: Vercel Cloud Serverless + MongoDB Atlas

---

## 1. Agile Methodology & Process Model

The engineering lifecycle of this project adhered to the **Agile Scrum Framework**, delivering features through iterative sprints:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ Product Backlog │ ───►  │ Sprint Backlog  │ ───►  │ Sprint Planning │
└─────────────────┘       └─────────────────┘       └────────┬────────┘
                                                             │
┌─────────────────┐       ┌─────────────────┐       ┌────────▼────────┐
│ Increment /     │ ◄───  │ Sprint Review & │ ◄───  │ Daily Iteration │
│ Cloud Release   │       │ Retrospective   │       │ & Development   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

### Sprint Breakdown
- **Sprint 1: Core Foundation & Data Modeling (MVC)**
  - Defined initial user stories for personal portfolio display.
  - Implemented Mongoose schemas (`Portfolio`, `Experience`, `Education`, `Achievement`).
  - Created Express backend controllers and JSON file fallback.

- **Sprint 2: UI Engineering & iPhone Dynamic Island**
  - Integrated React 19 and Vite with CSS modular glassmorphic design.
  - Built Apple iPhone-inspired Dynamic Island navbar with active pill tracking and expandable Live Activity drawer.
  - Structured discrete zero-code Admin dashboard (`#admin`).

- **Sprint 3: Asset Customization & Studio Tooling**
  - Converted Shaun's real-world Curriculum Vitae into downloadable PDF format (`Shaun_CV.pdf`).
  - Added one-click CV download triggers in Hero and Dynamic Island.
  - Built client-side Photo Studio with HTML5 canvas filtering (Brightness, Contrast, Saturation, Monochrome).
  - Integrated WhatsApp (`+45 71 51 45 43`), Instagram (`@azshaun`), and direct mailing.

- **Sprint 4: Security Hardening & Virtualization**
  - Implemented NoSQL and SQL injection defensive sanitizers.
  - Implemented XSS and XML entity filtering.
  - Added HTTP defensive security headers and brute-force auth rate limiting.
  - Configured Git version control and Vercel serverless deployment specifications.

---

## 2. Model-View-Controller (MVC) Architecture

The application strictly enforces separation of concerns via the MVC pattern:

### 1. Model Layer (`backend/src/models/`, `backend/src/utils/portfolioStore.js`)
- Responsible for data representation, schema validation, and persistence.
- Provides an abstracted interface (`portfolioStore.js`) that synchronizes state across both **MongoDB Atlas** (cloud) and **Local JSON storage** (offline fallback).

### 2. View Layer (`frontend/src/`)
- Pure React 19 presentation layer.
- Components subscribe to portfolio state via `App.jsx`.
- Real-time updates: When an administrator saves edits in the CMS, the view immediately renders the newly updated records without page reloads.

### 3. Controller Layer (`backend/src/controllers/`, `backend/src/routes/`)
- `portfolioController.js`: Handles API requests for fetching and mutating portfolio data.
- `authController.js`: Manages admin passcode verification and session issuance.
- `securityMiddleware.js`: Inspects and sanitizes all incoming payloads prior to controller execution.

---

## 3. Software Architecture Patterns

```
Client (Browser)
   │
   ├── Public Portfolio View (React 19 + Vite)
   ├── iPhone Dynamic Island Navbar (iOS 17+ Style)
   ├── In-Browser Photo Studio (HTML5 Canvas Filter Engine)
   └── Zero-Code Admin CMS (#admin route)
   │
   ▼ HTTP / JSON REST APIs (Encrypted via HTTPS)
   │
Vercel Edge Gateway (/api/index.js)
   │
   ├── Security Middlewares (Injection Sanitizer, Security Headers, Rate Limiter)
   ├── Authentication Middleware (Admin Passcode Verification)
   ├── Express REST Controllers (portfolioController, authController)
   └── Storage Strategy (portfolioStore.js)
         │
         ├── Primary Target: MongoDB Atlas Cloud Database (Mongoose ODM)
         └── High-Availability Fallback: Local JSON Store (backend/data/portfolio.json)
```

### Design Patterns Utilized:
1. **Repository / Hybrid Store Pattern**:
   - Isolates the data tier from the business logic. If MongoDB Atlas has high latency or goes offline, the fallback automatically serves data without crashing.
2. **Serverless Micro-Gateway Pattern**:
   - Uses Vercel serverless functions (`api/index.js`) to process backend requests on demand with global low latency.
3. **Optimistic UI / Live Refresh Pattern**:
   - Admin changes are reflected immediately in the React state while syncing asynchronously with the persistent store.

---

## 4. Defensive Security Architecture

### Threat Modeling & Countermeasures:
| Threat Category | Potential Vector | Implemented Countermeasure |
| :--- | :--- | :--- |
| **NoSQL Injection** | Attacker passes `{"$gt": ""}` in JSON to bypass authentication or extract sensitive records. | `injectionSanitizer` recursively iterates through objects and strips any key prefixed with `$` or containing `.`. |
| **SQL Injection** | Payload containing SQL operators and query terminations. | Inputs are strictly type-checked and sanitized before hitting the data store. |
| **Cross-Site Scripting (XSS)** | Malicious `<script>` tags entered in bio or project descriptions. | Regex sanitization strips executable tags, `javascript:` pseudoprotocols, and event handlers. |
| **XML / XXE Injection** | XML entity expansions (`<!ENTITY>`, `<!DOCTYPE>`). | Recursive parser strips XML entity declarations from incoming requests. |
| **Brute-Force Attacks** | Automated bots repeatedly trying passwords on `/api/auth/login`. | `authRateLimiter` restricts IP requests to 5 failed attempts per 15-minute window. |
| **Clickjacking / MIME Sniffing**| Iframing application or forcing incorrect MIME types. | Sets `X-Frame-Options: SAMEORIGIN` and `X-Content-Type-Options: nosniff`. |

---

## 5. iPhone-Inspired UI/UX Features

1. **Dynamic Island Navbar**:
   - Floating pill with dynamic width animation responding to scroll position.
   - Expandable into an iOS Live Activity card containing contact info, copy-to-clipboard email, and one-click CV download.
2. **Photo Studio Canvas Engine**:
   - Allows upload from mobile camera or PC desktop.
   - Built-in live editing sliders for Brightness, Contrast, Saturation, and B&W Noir filter.
   - Converts to optimized base64 for instant storage without requiring third-party storage fees.
3. **Glassmorphism Aesthetic**:
   - Backdrop-filter blur, deep teal and charcoal color schemes (`#071412`, `#69d6c6`), and tactile responsive buttons.

---

## 6. REST API Reference

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | GET | Public | Returns server health and database connection status. |
| `/api/portfolio` | GET | Public | Retrieves complete portfolio data (profile, contact, projects, etc.). |
| `/api/auth/login` | POST | Public (Rate Limited) | Authenticates admin using secret passcode. |
| `/api/portfolio/profile` | PUT | Protected (Admin) | Updates profile info, photo, CV URL, and contact links. |
| `/api/portfolio/achievements` | POST | Protected (Admin) | Adds a new achievement. |
| `/api/portfolio/achievements/:id`| DELETE | Protected (Admin) | Deletes an achievement. |
| `/api/portfolio/projects` | POST | Protected (Admin) | Adds a new project. |
| `/api/portfolio/projects/:id` | DELETE | Protected (Admin) | Deletes a project. |
| `/api/portfolio/experience` | POST | Protected (Admin) | Adds a new work experience record. |
| `/api/portfolio/experience/:id` | DELETE | Protected (Admin) | Deletes an experience record. |
| `/api/portfolio/education` | POST | Protected (Admin) | Adds an education milestone. |
| `/api/portfolio/education/:id` | DELETE | Protected (Admin) | Deletes an education record. |
