# Setup & Deployment Guide

---

## STEP 1 — Fix the "Can't Create Account" Issue

The backend needs a MongoDB database. You have two options:

---

### Option A — MongoDB Atlas (FREE, no install needed) ✅ RECOMMENDED

1. Go to **https://cloud.mongodb.com** and sign up free
2. Click **Create a deployment** → choose **M0 Free** → pick any region → click **Create**
3. In the **Security Quickstart**:
   - Create a database user (e.g. username: `shopease`, password: `shopease123`)
   - Under **IP Access**, click **Add My Current IP Address** (or use `0.0.0.0/0` to allow all)
4. Click **Connect** → **Drivers** → copy the connection string, looks like:
   ```
   mongodb+srv://shopease:shopease123@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   ```
5. Open `backend/.env` and replace the MONGODB_URI line:
   ```
   MONGODB_URI=mongodb+srv://shopease:shopease123@cluster0.abcde.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
6. Seed the database:
   ```bash
   cd backend
   npm run seed
   ```
7. Start the backend:
   ```bash
   npm run dev
   ```

---

### Option B — Local MongoDB

1. Download from https://www.mongodb.com/try/download/community
2. Install and start the service
3. Keep `.env` as: `MONGODB_URI=mongodb://localhost:27017/ecommerce`
4. Run `npm run seed` then `npm run dev`

---

## STEP 2 — Running Locally (both servers)

```
Terminal 1 (backend):
  cd backend
  npm run dev          → http://localhost:5000

Terminal 2 (frontend):
  cd frontend
  npm run dev          → http://localhost:5173
```

Demo accounts (after seeding):
- Admin: admin@shop.com / admin123
- User:  user@shop.com  / user123

---

## STEP 3 — Deployment

### Backend → Render.com (FREE)

1. Push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   # create repo on github.com, then:
   git remote add origin https://github.com/YOUR_USERNAME/shopease.git
   git push -u origin main
   ```

2. Go to **https://render.com** → Sign up → **New Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `MONGODB_URI` → your Atlas connection string
   - `JWT_SECRET` → any long random string
   - `NODE_ENV` → `production`
6. Click **Deploy** — you'll get a URL like `https://shopease-api.onrender.com`

---

### Frontend → Vercel (FREE)

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **Add New Project** → import your repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
4. Add **Environment Variable**:
   - `VITE_API_URL` → your Render backend URL (e.g. `https://shopease-api.onrender.com`)
5. Click **Deploy** — you'll get a URL like `https://shopease.vercel.app`

6. Update `frontend/src/api.js` to use the env variable:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api'
})
```

7. Also update `backend/server.js` CORS to allow your Vercel domain:
```js
app.use(cors({
  origin: ['http://localhost:5173', 'https://shopease.vercel.app'],
  credentials: true
}))
```

---

### Quick Deployment Summary

| Service  | What it hosts | Cost | URL                    |
|----------|--------------|------|------------------------|
| Atlas    | MongoDB DB    | Free | cloud.mongodb.com      |
| Render   | Node backend  | Free | render.com             |
| Vercel   | React frontend| Free | vercel.com             |

All three have free tiers — your app can run at zero cost.
