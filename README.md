# 🔧 FixMate — Smart Device & Home Appliance Repair Service Platform

FixMate is a **production-ready, real-world, full-stack**, role-based on-demand repair service booking platform built to solve practical day-to-day device and appliance servicing workflows. Verified technicians list repair services (**Smartphone**, **Laptop & PC**, **AC**, **Refrigerator**, **TV**, **Washing Machine**, **Electrical**), customers browse, communicate, book, and track repair jobs step by step, and online payment via Stripe happens **only after the job is completed**.

## 🎯 Purpose
Finding a trustworthy repair technician is a real-world challenge—customers often lack visibility into job progress, direct communication channels, or confidence to pay upfront, while skilled technicians need a structured marketplace to manage listings, incoming requests, customer messages, and feedback. FixMate addresses these real operational needs with admin-moderated listings, a server-enforced job status pipeline, 2-way messaging, review sentiment visibility, and a transparent pay-after-service model.

---

## 🔗 Live & Repository Links
- **Live Website:** https://fixmate-client-delta.vercel.app
- **Backend API:** https://fixmate-server-wrsy.onrender.com
- **Client Repository:** https://github.com/nazifa-buildscodes/fixmate-client
- **Server Repository:** https://github.com/nazifa-buildscodes/fixmate-server

---

## 🔐 Demo Credentials (For Quick Testing)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@fixmate.com` | `Aa1234` |
| **Technician** | `hmhasan4@gmail.com` | `Tt1234` |
| **Customer** | `tahsingpt1yr@gmail.com` | `Cc1234` |

*(Customers can also register a new account or sign in via **Continue with Google**.)*

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
- **Service Details (`/services/[id]`):** Full service info, verified technician profile with **phone (`tel:`), email (`mailto:`), and direct Message Technician modal**, customer reviews with average rating, and role-restricted Repair Request form (blocks duplicate active requests).
- **About (`/about`):** Detailed role-based walkthroughs for both **Customers** and **Technicians**, platform trust pillars, support contact info, and direct inquiry submission to Admin, plus custom `404`, Error Boundary, & Loading Skeletons.

### 2-Way Messaging & Reviews Center
- **2-Way Messaging (`MessagesCenter` & `/api/messages`):** Send inquiries to Admin from the Footer or `/about` page, or message a technician directly from a Service Details page. Inside dashboard **Messages**, users can view `From`/`To` sender and recipient details, quick Call/Mail/Copy actions, reply to messages, or delete authorized messages (`POST /api/messages`, `GET /api/messages/my`, `PATCH /api/messages/:id/reply`, `DELETE /api/messages/:id`).
- **Dedicated Reviews Center (`ReviewsCenter` & `/api/reviews/*`):** Dedicated **Reviews** pages in the Technician and Admin sidebars with service filtering, summary counts, and **Good (`4–5★`) vs. Poor (`1–2★`)** review indicators (`GET /api/reviews/technician`, `GET /api/reviews/admin`).

### Role-Based Dashboards
- **Customer Dashboard:** Overview stats & charts, **Messages** (with replies), **My Bookings** (Cancel while `requested`, visual **Job Timeline Tracker**, **Stripe Pay Now** after completion, 1–5 star **Rating & Review**), and **Payment History**.
- **Technician Dashboard:** Overview stats & job breakdown chart, **Reviews** (service & sentiment filtered feedback), **Messages** (2-way replies & inbox management), **Add & Manage Services (CRUD)** with **ImgBB** image upload and availability toggle (edits reset approval to `pending`), and **Manage Requests** with forward-only status transitions (`requested → accepted/rejected → in-progress → completed` with final amount modal).
- **Admin Dashboard:** Overview analytics, **Reviews** (platform-wide service reviews & sentiment view), **Messages** (inquiries & replies), **Manage Users** (dynamic role updates, self-role locked), **Service Approval** queue (`Pending` prioritized), **All Bookings**, and **Transactions** with total revenue.
- **Shared Profile (`/dashboard/profile`):** Update name, phone, area, bio, and profile photo via ImgBB without logging out.

### Payments & UI/UX
- **Stripe Pay-After-Service (Test Mode):** Checkout enabled strictly after completion in **BDT (`৳`)**, backed by idempotent verification and a Stripe Webhook.
- **Modern UX:** Dark/Light mode toggle, toast notifications (`sonner`), confirmation modals, and responsive mobile/tablet/desktop layout.

---

## 🛠️ Tech Stack & Important Functions

### Technologies Used
- **Frontend:** Next.js (App Router), React, Tailwind CSS, Lucide React, Recharts, Sonner
- **Authentication & Security:** BetterAuth (MongoDB Adapter), Google OAuth, JSON Web Tokens (`jsonwebtoken`)
- **Backend & Database:** Node.js, Express.js, MongoDB Native Driver, CORS, Dotenv
- **Payments & Media:** Stripe Checkout & Webhooks, ImgBB Image Hosting
- **Deployment:** Vercel (Client) & Render (Server)

### Important Functions & Modules
- **`resolveRequestUser(req)` (`fixmate-server/src/index.js`):** Verifies incoming `Bearer` JWT tokens and resolves the authenticated user's profile and role from MongoDB (`users` collection).
- **Messaging API Handlers (`POST /api/messages`, `GET /api/messages/my`, `PATCH /api/messages/:id/reply`, `DELETE /api/messages/:id`):** Handle storing admin/technician inquiries, role-scoped inbox retrieval, reply updates, and authorized message deletion.
- **Review Aggregation Handlers (`GET /api/reviews/technician`, `GET /api/reviews/admin`):** Correlate booking ratings/reviews with service and technician records for role-specific review views.
- **`MessagesCenter` & `ReviewsCenter` (`fixmate-client/src/components/`):** Reusable client components powering 2-way messaging/replies/deletion and Good/Poor review filtering across dashboards.
- **`ServiceDetailsPage` (`fixmate-client/src/app/(public)/services/[id]/page.js`):** Displays service/technician details, urgent phone/email links, direct technician messaging modal, and repair booking submission.
- **`recordCompletedPayment` & Stripe Webhook (`fixmate-server/src/utils/paymentHelper.js` & `index.js`):** Verifies paid Stripe checkout sessions and records completed payments idempotently.

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
   git clone [https://github.com/nazifa-buildscodes/fixmate-client.git](https://github.com/nazifa-buildscodes/fixmate-client.git)
   cd fixmate-client
   npm install

   ---

## 👩‍💻 Author

# Nazifa Nowsin

Portfolio: https://nazifa-nowsin-portfolio.vercel.app/

LinkedIn: https://www.linkedin.com/in/nazifa-nowsin-7b7459243/

GitHub: https://github.com/nazifa-buildscodes