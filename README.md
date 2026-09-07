# Care Nest 🕉️ — Trusted Stays for Every Pilgrim

> **A Nashik-focused accommodation discovery, verification, and booking platform for Kumbh Mela pilgrims, yatris, and families.**

---

## 🏛️ Project Overview

**Care Nest** connects pilgrims attending the Kumbh Mela in **Nashik, Maharashtra, India** with verified accommodations including Homestays, Ashrams, Dharamshalas, Hotels, Hostels, and Tents across key pilgrimage sectors (Panchavati, Ramkund, Godavari Ghats, Tapovan, and Trimbakeshwar).

### Core Features & USPs
1. **Strict Nashik Platform Scope:** All accommodations, landmark distances, maps, and guides are localized exclusively to Nashik & Trimbakeshwar (`locationScope: "nashik"`).
2. **6-Point Manual Trust & Verification System:** Admin-curated 6-point matrix (Owner Identity, Municipal/Title NOC, Ghat Proximity, Photo Authenticity, Tariff Transparency, Snan Amenities) issuing Care Nest Verified Badges and deterministic trust scores.
3. **Interactive OpenStreetMap + Leaflet.js:** Fast, open-source geospatial map rendering with zero proprietary map API fees or restrictions.
4. **Comprehensive Stay Search & Filters:** Real-time search with sector destination dropdowns, auto-synchronizing check-in/check-out dates (+1 day minimum), Gender Suitability (`Female`, `Male`, `All`), and Stay Type / Occupancy (`Family`, `Single`, `All`).
5. **Razorpay TEST Mode Payment Flow:** Complete booking request cycle with server-side order creation, test checkout modal, and cryptographic HMAC-SHA256 signature verification.
6. **KumbhVaani AI Assistant:** Multilingual pilgrim assistant (**KumbhVaani — Care Nest's multilingual pilgrim assistant**) providing practical stay guidance, Snan timings, ghat locations, and navigation tips.
7. **Role-Based Access Control:** Strict JWT authentication with segregated role permissions for `pilgrim`, `owner`, and `admin`.

---

## 🛠️ Technology Stack

### Frontend (`client/`)
- **React 19** + **Vite 8** + **React Router 7**
- **Leaflet.js** + **React-Leaflet** with OpenStreetMap tiles
- **Tailwind CSS** (Spiritual palette: saffron/amber `#ea580c`, deep navy `#0f172a`, emerald `#059669`)
- **Lucide React** (Vector icons)
- **i18n Localization** (English, Hindi, Marathi)

### Backend (`server/`)
- **Node.js** (v20+) + **Express.js** (REST API)
- **MongoDB** + **Mongoose** (Strict Schemas & 2dsphere Geospatial Indexing)
- **MongoMemoryServer** (Instant development in-memory database fallback)
- **JWT (JSON Web Tokens)** + **bcryptjs** (Password hashing)
- **Razorpay SDK** (Test Mode integration with server signature verification)
- **Security Middleware** (Helmet, CORS, Role-based route protection)

---

## 📂 Project Structure

```text
KHUMBCARE STAY AND HEALTH/
├── client/                     # Frontend Application (Vite + React)
│   ├── src/
│   │   ├── components/         # Reusable UI components (SearchBar, Map, Chatbot, Cards)
│   │   ├── context/            # AuthContext, LanguageContext, ToastContext
│   │   ├── hooks/              # Custom hooks (useAuth, useLanguage)
│   │   ├── layouts/            # MainLayout
│   │   ├── pages/              # FindStays, PropertyDetails, AdminDashboard, OwnerDashboard...
│   │   ├── services/           # API clients (propertyService, adminService, bookingService...)
│   │   ├── App.jsx             # Route definitions & guards
│   │   └── main.jsx            # React root
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend API Server (Node + Express + MongoDB)
│   ├── config/                 # db.js connection with auto-memory fallback
│   ├── controllers/            # propertyController, adminController, bookingController...
│   ├── middleware/             # authMiddleware, errorMiddleware
│   ├── models/                 # Property, User, Booking, Report schemas
│   ├── routes/                 # Express API routes
│   ├── utils/                  # seedData.js, token generator
│   ├── package.json
│   └── server.js               # Server entry point
│
├── .env.example                # Safe environment configuration template
├── .gitignore                  # Git exclusion rules
└── README.md                   # Documentation
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v20 or higher)
- **npm** (v10 or higher)
- **MongoDB** (Optional; the server automatically launches MongoMemoryServer in development if a local MongoDB instance is not detected)

### 2. Environment Setup
Copy `.env.example` to `server/.env`:
```bash
cp .env.example server/.env
```

Fill in required placeholder values in `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/kumbhstay
JWT_SECRET=your_jwt_secret_key_change_in_production
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
ADMIN_EMAIL=admin@kumbhstaynashik.local
ADMIN_PASSWORD=your_secure_admin_password
```

### 3. Install Dependencies
Install server and client packages:
```bash
# In the project root or respective directories:
cd server
npm install

cd ../client
npm install
```

### 4. Start the Application
Start the backend server and frontend dev server:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Server running at http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Vite client running at http://localhost:5173
```

---

## 🔐 Admin Verification Console

- **Private Admin URL:** `http://localhost:5173/admin/verification-console`
- **Access Control:** Requires JWT authentication with `role: 'admin'`. Excluded from public navigation headers, footers, and sitemaps.
- **Workflow:**
  1. Host registers and submits property details + proof documents (Status: `pending`).
  2. Admin evaluates submission against the 6-point checklist.
  3. Actions available:
     - **Approve:** Computes trust score, awards Care Nest Verified Badge, publishes live to search.
     - **Request Changes:** Sends listing back to host with feedback notes for revision and resubmission.
     - **Reject / Suspend:** Rejects unverified listings or suspends problematic properties.

---

## 💳 Razorpay TEST Mode Payment Flow

1. User clicks **Request Booking** on property details page (`/stays/:id`).
2. Backend creates a pending booking record and generates a Razorpay Order ID.
3. Razorpay Checkout modal opens with test payment options (UPI, Netbanking, Test Cards).
4. Upon payment completion, payment signature is sent to `POST /api/bookings/:id/verify-payment`.
5. Backend verifies the HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET`.
6. Booking status updates to `confirmed` and displays booking confirmation (`/bookings/:id/confirmation`).

---

## 🔒 Security Best Practices

- **Zero Hardcoded Secrets:** No API keys, passwords, or secrets exist in client-side bundles or source code.
- **Protected Environment Variables:** `.env` is ignored by Git. Never commit production secrets.
- **Role Isolation:** Non-admin users attempting to access admin endpoints receive HTTP 401/403 responses.
- **Data Validation:** Strict server-side validation for dates (`checkIn < checkOut`), sanitized regex search queries, and sanitized user inputs.

---

## 📜 License

Academic & Hackathon Prototype for Kumbh Mela Nashik Accommodation Management.
