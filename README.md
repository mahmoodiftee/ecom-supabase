# 🛒 E-Commerce Platform

A modern, full-featured e-commerce platform built with **Supabase** (serverless backend) and **Stripe** (secure payment gateway). The application is fully responsive, optimized for mobile devices, and includes a powerful admin panel for managing products, orders, and payments.


## Features

### User-Facing Website

* Fully responsive design for all screen sizes
* Beautiful home page with:

  * Navigation bar
  * Search bar (search products by name)
  * Filter option
* Product listing and product detail pages
* Product detail page includes:

  * Detailed product information (features, specifications, etc.)
  * Rating & review system
* Shopping cart:

  * Add to cart
  * Remove from cart
  * Checkout flow
* Secure checkout using **Stripe**
* Automatically generates a **PDF invoice** for each order

---

### Admin Panel

* Full-fledged admin dashboard
* Manage products:

  * Add, edit, delete products
* Manage orders:

  * View complete order history
* Manage payments:

  * View payment history
* Analytics and reporting features

---

### Payments

* Secure payment system using **Stripe**
* Supports credit and debit card payments
* Safe and reliable transaction handling

---

### Backend

* Powered by **Supabase** (serverless database & backend services)
* Handles:

  * Authentication
  * Product, order, user, and review data
  * Payment records

---

### Invoices

* Automatically generates a **PDF invoice** for every completed order
* Users get a clear and concise record of their transactions

---

## Tech Stack

* **Frontend:** Next.js, Shadcn, Lenis and Gsap and Zustand
* **Backend:** Supabase
* **Database:** Supabase (PostgreSQL)
* **Payments:** Stripe

---

## 📦 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project and add:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 4. Run the project

```bash
npm run dev
```

---

## 📸 Screenshots

<p align="center">
  <img src="https://i.ibb.co.com/1G9GpJWc/1.jpg" width="700"/>
</p>

<p align="center">
  <img src="https://i.ibb.co.com/fzcw7gYf/portrait1.jpg" width="45%"/>
  <img src="https://i.ibb.co.com/nstSNhXp/portrait2.jpg" width="45%"/>
</p>

<p align="center">
  <img src="https://i.ibb.co.com/PG4HmMLm/2.jpg" width="700"/>
</p>

<p align="center">
  <img src="https://i.ibb.co.com/35P5DDHv/portfolio1.jpg" width="700"/>
</p>


