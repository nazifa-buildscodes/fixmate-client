# 🔧 FixMate — Smart Device & Home Appliance Repair Service Platform

FixMate is a full-stack, role-based on-demand repair service booking platform where verified technicians list repair services (Smartphone, Laptop & PC, AC, Refrigerator, TV, Washing Machine, Electrical), customers book and track repair jobs step by step, and online payment via Stripe happens **only after the job is completed**.

## 🎯 Purpose
Finding a trustworthy repair technician is difficult—customers often lack visibility into job progress and hesitate to pay upfront, while skilled technicians lack a structured marketplace to manage listings and incoming requests. FixMate solves both with admin-moderated listings, a server-enforced job status pipeline, and a transparent pay-after-service model.

---

## 🔗 Live & Repository Links
- **Live Website:** `https://your-vercel-app.vercel.app`
- **Backend API:** `https://your-render-server.onrender.com`
- **Server Repository:** `https://github.com/YOUR_USERNAME/fixmate-server`

---

## 🔐 Demo Credentials (For Quick Testing)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@fixmate.com` | `Aa1234` |
| **Technician** | `tech1@fixmate.com` | `YOUR_TECHNICIAN_PASSWORD` |
| **Customer** | `YOUR_CUSTOMER_EMAIL` | `YOUR_CUSTOMER_PASSWORD` |

*(Customers can also sign up directly or sign in using **Continue with Google**.)*

---

## ✨ Key Features

### Authentication & Authorization
- **BetterAuth + MongoDB Adapter:** Secure email/password authentication plus **Google OAuth** with automatic account linking.
- **Role-Based Registration:** Users register as `customer` or `technician` (admin self-registration is blocked server-side).
- **JWT Token Bridge (`/api/auth/token`):** Issues signed JWT tokens to authenticate all private Express backend API requests.
- **Protected Routes:** Role-based dashboard guards with reload persistence.

### Public Pages & Server-Side Discovery
- **Home (`/`):** Hero banner, latest 6 approved & available services, "How FixMate Works" 4-step workflow, and clickable category cards.
- **Browse Services (`/services`):** Server-side search, category/service mode filters, sorting (Price Low–High, High–Low, Newest), pagination, and URL query synchronization.
- **Service Details (`/services/[id]`):** Complete service breakdown, technician profile, average ratings, and role-restricted Repair Request form (blocks duplicate active requests).
- **About (`/about`), Custom `404`, Error Boundary, & Loading Skeletons.**

### Role-Based Dashboards
- **Customer Dashboard:** Overview stats & charts, **My Bookings** (Cancel while `requested`, visual **Job Timeline Tracker**, **Stripe Pay Now** after completion, 1–5 star **Rating & Review**), and **Payment History**.
- **Technician Dashboard:** Overview stats, **Add & Manage Services (CRUD)** with **ImgBB** image upload and availability toggle (edits reset approval to `pending`), and **Manage Requests** with forward-only status transitions (`requested → accepted/rejected → in-progress → completed` with final amount modal).
- **Admin Dashboard:** Overview analytics, **Manage Users** (dynamic role updates, self-role locked), **Service Approval** queue (`Pending` prioritized), **All Bookings**, and **Transactions** with total revenue.
- **Shared Profile (`/dashboard/profile`):** Update name, phone, area, bio, and profile photo via ImgBB without logging out.

### Payments & UI/UX
- **Stripe Pay-After-Service (Test Mode):** Checkout enabled strictly after completion, backed by idempotent verification and Stripe Webhook.
- **Modern UX:** Dark/Light mode toggle, toast notifications (`sonner`), confirmation modals, responsive mobile/tablet/desktop layout, and BDT (`৳`) localization.

---

## 📦 NPM Packages Used

| Package | Purpose |
| :--- | :--- |
| `next`, `react`, `react-dom` | Next.js App Router frontend framework |
| `better-auth` | Authentication (Email/Password + Google OAuth) |
| `mongodb` | MongoDB adapter connection for BetterAuth |
| `jsonwebtoken` | Signing JWT tokens for the Express API bridge |
| `tailwindcss` | Utility-first responsive styling and dark mode |
| `lucide-react` | Consistent icon set across public & dashboard UI |
| `recharts` | Interactive dashboard overview charts |
| `sonner` | Toast notifications for actions and errors |

---

## 🚀 Local Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/fixmate-client.git](https://github.com/YOUR_USERNAME/fixmate-client.git)
   cd fixmate-client
   npm install