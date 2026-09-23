# Deployment & Database Setup Guide

This guide explains how to deploy Ashaduzzaman Shaun's dynamic portfolio to **Vercel** and connect it to a free **MongoDB Atlas** cloud database.

---

## 1. Quick Start Locally

1. **Install Dependencies**:
   ```bash
   npm install
   npm run build
   ```

2. **Run Both Backend and Frontend**:
   - Terminal 1 (Backend API on Port 5000):
     ```bash
     node backend/src/server.js
     ```
   - Terminal 2 (Frontend Dev Server on Port 5173):
     ```bash
     npm run dev:frontend
     ```
   - Open browser at `http://localhost:5173`.
   - The Vite dev server will automatically proxy `/api/*` calls to the backend on `http://localhost:5000`.

---

## 2. Admin Access & Dynamic Editing (No Coding Required)

- **Normal Visitors**: The navigation bar and Dynamic Island have NO admin button. Visitors only see the professional portfolio.
- **Admin Access**:
  - Visit the URL with `#admin` (e.g. `http://localhost:5173/#admin` or `https://your-domain.vercel.app/#admin`).
  - Or **Triple-click the "©" copyright icon** in the footer.
- **Passcode Authentication**:
  - Enter the Admin Passcode: `shaun2026` (configurable in `ADMIN_SECRET_KEY`).
  - You can immediately edit:
    1. **Personal Information**: Full Name, Title, Bio, About Me, Location, Years of Experience, Photo URL.
    2. **Social Links**: LinkedIn (`https://www.linkedin.com/in/ashaduzzaman-shaun-4aa737374/`), GitHub, Email.
    3. **Personal Achievements**: Title, Badge/Category, Year, and Description.
    4. **Featured Projects**: Add/Remove projects with technologies and links.
    5. **Experience & Education**: Add/Remove career milestones.
  - All changes are immediately saved to the database and reflected live on the public portfolio!

---

## 3. Deploying to Vercel

1. Push this repository to **GitHub**:
   ```bash
   git add .
   git commit -m "Dynamic portfolio with MongoDB, admin access, and Shaun's profile"
   git push origin main
   ```

2. Log into [Vercel](https://vercel.com/) and click **"Add New Project"** -> **Import from Git**.

3. **Build & Output Settings**:
   - Vercel will automatically detect `vercel.json`.
   - Build Command: `npm run build --prefix frontend`
   - Output Directory: `frontend/dist`

4. **Environment Variables** (in Vercel project settings):
   - `ADMIN_SECRET_KEY` = `shaun2026` (or your chosen secret password)
   - `MONGODB_URI` = `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`

5. Click **Deploy**!
   - Your frontend will be live on Vercel's global CDN.
   - All `/api/*` endpoints will run as serverless functions connected to your MongoDB Atlas cluster.

---

## 4. Setting up Free MongoDB Atlas (5 Minutes)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a free **M0 Shared Cluster** (always free, 512MB).
3. Under **Database Access**: Create a database user (e.g. `shaun_admin` with a secure password).
4. Under **Network Access**: Add IP Address `0.0.0.0/0` (Allow access from anywhere, required for serverless hosting on Vercel).
5. Under **Clusters** -> Click **Connect** -> **Drivers** (Node.js).
6. Copy the connection string:
   ```text
   mongodb+srv://shaun_admin:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```
7. Paste it into `backend/.env` (locally) and into Vercel's **Environment Variables**.
