# ShopEase — E-Commerce Web Application

Full-stack e-commerce app built with **Node.js + Express + MongoDB** (backend) and **React + Vite** (frontend).

---

## Project Structure

```
commerce/
├── backend/        ← Express REST API (port 5000)
│   ├── models/     User, Product, Order
│   ├── routes/     auth, products, orders, admin
│   ├── middleware/ auth (JWT), admin (role check)
│   ├── seeder.js   Sample data seeder
│   └── server.js
└── frontend/       ← React app (port 5173)
    └── src/
        ├── pages/  Home, Products, Cart, Checkout, Orders, Admin
        ├── components/  Navbar, ProductCard, Spinner, Footer
        └── context/     AuthContext, CartContext
```

---

## Prerequisites

- Node.js 18+
- MongoDB running locally on `mongodb://localhost:27017`
  (Install from https://www.mongodb.com/try/download/community)

---

## Quick Start

### 1 — Backend

```bash
cd backend
npm install
npm run seed       # Creates sample users + 8 products
npm run dev        # Starts API on http://localhost:5000
```

### 2 — Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev        # Starts React app on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## Demo Accounts

| Role  | Email            | Password  |
|-------|-----------------|-----------|
| Admin | admin@shop.com  | admin123  |
| User  | user@shop.com   | user123   |

---

## Features

### Customer
- Browse product catalog with search + category filter + pagination
- Product detail page with quantity selector
- Shopping cart (persists in localStorage)
- Checkout with shipping address form
- Order history with live status tracking

### Admin (login as admin)
- Dashboard with stats: users, products, orders, revenue
- Add / edit / delete products
- View all orders, update order status & payment status

---

## API Endpoints

| Method | Endpoint                  | Access        |
|--------|--------------------------|---------------|
| POST   | /api/auth/register        | Public        |
| POST   | /api/auth/login           | Public        |
| GET    | /api/auth/me              | Auth          |
| GET    | /api/products             | Public        |
| GET    | /api/products/:id         | Public        |
| POST   | /api/products             | Admin         |
| PUT    | /api/products/:id         | Admin         |
| DELETE | /api/products/:id         | Admin         |
| POST   | /api/orders               | Auth          |
| GET    | /api/orders/my            | Auth          |
| GET    | /api/orders/:id           | Auth/Admin    |
| GET    | /api/admin/dashboard      | Admin         |
| GET    | /api/admin/orders         | Admin         |
| PUT    | /api/admin/orders/:id     | Admin         |
| GET    | /api/admin/users          | Admin         |
