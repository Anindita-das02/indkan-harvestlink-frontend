# INDKAN HarvestLink - Frontend Client

Modern B2B Agricultural Commodity Export Client Portal built with **React 19**, **TypeScript**, and **Vite**. Features an enterprise trade showcase, commodity catalogue, interactive RFQ quotation engine, PIN-secured multi-stage shipment tracking, and an Administrator Trade Control Desk with single and batch PDF dossier export.

---

## 📋 Table of Contents
1. [Tech Stack & Architecture](#-tech-stack--architecture)
2. [Project Structure](#-project-structure)
3. [Key Platform Features](#-key-platform-features)
4. [Trade Status & Shipment Workflow](#-trade-status--shipment-workflow)
5. [Admin Access & Authentication Architecture](#-admin-access--authentication-architecture)
6. [Mobile Web Experience](#-mobile-web-experience)
7. [Local Setup & Development](#-local-setup--development)
8. [Production Build & Quality Verification](#-production-build--quality-verification)
9. [Cloud Deployment Guide (Vercel)](#-cloud-deployment-guide-vercel)

---

## 🛠 Tech Stack & Architecture

- **Runtime & Framework**: React 19, TypeScript, Vite 8
- **Styling Architecture**: Custom Vanilla CSS Design System with CSS variables and responsive media queries
- **Iconography**: `lucide-react`
- **Networking**: Axios client with centralized endpoint configuration
- **Document Generation**: `jspdf` & `jspdf-autotable` (client-side vector PDF generation for lightweight, stateless backend scaling)

---

## 📁 Project Structure

The frontend repository is structured into modular layers adhering to modern React & TypeScript best practices:

```text
Indkan_Frontend/
├── public/                     <-- Static assets, brand logos, favicon
│   └── images/                 <-- High-resolution agricultural commodity imagery
├── src/
│   ├── components/             <-- Reusable UI components
│   │   ├── Footer.tsx          <-- Enterprise multi-column footer with quick links & trade policies
│   │   ├── Navbar.tsx          <-- Brand header with mobile hamburger navigation drawer
│   │   └── ScrollToTop.tsx     <-- Smooth route-transition scroll reset
│   ├── config/
│   │   └── api.ts              <-- Centralized API endpoint routing constants
│   ├── pages/                  <-- Route views & page controllers
│   │   ├── AboutUs.tsx         <-- Company profile, export values, global desk
│   │   ├── AdminPage.tsx       <-- Protected trade control panel (KPIs, Products, Enquiries, PDF)
│   │   ├── ContactUs.tsx       <-- Global trade desk contact form
│   │   ├── Disclaimer.tsx      <-- Export commodity trade disclaimers
│   │   ├── EnquiryPage.tsx     <-- Multi-item RFQ bulk quotation builder
│   │   ├── ExportProcess.tsx   <-- Step-by-step export workflow overview
│   │   ├── FAQs.tsx            <-- Common buyer questions (MOQ, Incoterms, Quality)
│   │   ├── LandingPage.tsx     <-- Commercial homepage with hero, categories, and workflow
│   │   ├── PrivacyPolicy.tsx   <-- GDPR/Trade compliance data privacy policy
│   │   ├── ProductDetails.tsx  <-- High-spec commodity view with MOQ and RFQ launcher
│   │   ├── Products.tsx        <-- Real-time catalogue with search & category filtering
│   │   ├── TermsAndConditions.tsx <-- Trade terms & CIF/FOB conditions
│   │   └── TrackEnquiryPage.tsx<-- Live shipment tracking desk by Reference ID + PIN
│   ├── services/
│   │   └── apiService.ts       <-- Pre-configured Axios instance with dynamic base URL
│   ├── styles/
│   │   └── admin.css           <-- Dedicated design system for the Admin Management Console
│   ├── utils/
│   │   └── pdfExport.ts        <-- Vector PDF export engine (Single dossier & Batch reports)
│   ├── App.css                 <-- Component-level style overrides
│   ├── App.tsx                 <-- React Router view declarations & route wiring
│   ├── index.css               <-- Global design system tokens, typography, and breakpoints
│   └── main.tsx                <-- React DOM entrypoint
├── .env.example                <-- Environment variable template
├── package.json                <-- Project scripts & npm dependencies
├── tsconfig.json               <-- TypeScript project configuration
└── vite.config.ts              <-- Vite build and development configuration
```

---

## 🌟 Key Platform Features

1. **Commercial Landing Page**:
   - Export value proposition with quick quotation triggers.
   - Featured commodity categories (Pulses, Lentils, Whole Spices, Agro Grains).
   - 4-step international trade workflow (Enquiry → Verification → Quality Sorting → Export Shipment).
   - Trust indicators, Sortex purity standards, and quality certifications.

2. **Commodity Catalogue & Product Details**:
   - Instant search, active category filtering, and real-time stock status badges (`in_stock`, `low_stock`, `out_of_stock`, `on_request`).
   - Technical specifications: Moisture level, sortex purity percentage, origin country, crop year, and minimum order quantity (MOQ).
   - Direct bulk quotation / enquiry launcher with pre-filled commodity parameters.

3. **Multi-Item Buyer Enquiry & PIN Tracking**:
   - Multi-commodity enquiry submission with custom packaging requirements.
   - Reference ID + confidential 6-digit Secret PIN generated upon submission.
   - Live order stage tracking with visual progress stepper, shipment timeline, and PIN change tool.
   - Direct PDF enquiry dossier download for buyers.

4. **Administrator Trade Control Panel (`/admin`)**:
   - Real-time KPI counters: Total RFQs, Pending Verification, Active Catalogue, In Stock Inventory.
   - Inventory CRUD: Add/edit commodities, upload specifications, toggle stock availability.
   - Category management.
   - **Enquiry Management & PDF Export**:
     - **Single Enquiry PDF Export**: Generates an official B2B export specification dossier with buyer KYC, commodity details, delivery port, shipment status, and admin audit notes.
     - **Batch Master PDF Export**: Multi-enquiry selection toolbar to export selected or all RFQs in a formatted landscape master report.

---

## 🔄 Trade Status & Shipment Workflow

The frontend renders a synchronized multi-stage status workflow matching the backend database:

### Detailed Trade & Shipment Stages (`verification_status`)

| Status Value | Display Label | Stage Step | Description |
| :--- | :--- | :---: | :--- |
| `pending` / `submitted` | **Request Received** | Step 1 | Buyer RFQ submitted and queued for verification. |
| `under_review` / `pending_kyc` | **Under Review (Trade KYC)** | Step 2 | Trade desk verifying import credentials and destination port. |
| `quote_sent` | **Quotation Ready** | Step 3 | Formal proforma quotation (FOB/CIF) issued to buyer. |
| `order_confirmed` / `accepted`| **Order Confirmed** | Step 4 | Commercial sales contract executed. |
| `processing` | **Processing & Sortex Cleaning** | Step 5 | Commodity undergoing optical sorting, purity cleaning, and moisture control. |
| `packed` | **Packed in Export Bags** | Step 6 | Packed into export-grade sacks (PP/Jute/Liners) with APEDA/Phyto compliance tags. |
| `shipped` | **Vessel Shipped (In Transit)** | Step 7 | Bill of Lading (B/L) issued; cargo onboard container vessel in international transit. |
| `delivered` / `completed` | **Delivered at Port / Closed** | Step 8 | Cargo arrived at destination port, cleared customs, trade transaction finalized. |
| `rejected` / `quote_rejected` | **Quotation Rejected** | Exception | Buyer declined quotation; RFQ closed. |
| `cancelled` | **Closed / Cancelled** | Exception | Enquiry cancelled due to stock limits or buyer request. |

### High-Level Status (`status`)
The admin panel also supports filtering by high-level database categories: `pending`, `contacted`, `completed`, and `cancelled`.

---

## 🔐 Admin Access & Authentication Architecture

### Evaluation Credentials
> **Admin Access:**  
> Use the demo credentials provided separately for assignment evaluation.

### Authentication & Session Verification Flow
The platform implements a client-server token verification flow:
1. **Login & Token Issuance**: The admin submits credentials to `POST /api/admin/login`. On verification against the Scrypt password hash, the backend issues an HMAC-SHA256 bearer token with a 7-day expiration.
2. **Session Storage**: The token is stored in the browser's `localStorage` (`indkan_admin_token`) and attached as `Authorization: Bearer <token>` on all administrative requests via Axios.
3. **Automatic 401 Interception**: If the token expires or is rejected by the backend, the client immediately catches the `401 Unauthorized` response, purges the stored credentials, and resets the interface to the secure login prompt.
4. **Password Self-Service**: Authenticated administrators can update their password at any time via the Admin Profile modal (`POST /api/admin/change-password`).

---

## 📱 Mobile Web Experience

INDKAN HarvestLink provides a fully optimized **Responsive Mobile Web Experience** designed for mobile browsers (Safari on iOS, Chrome on Android):
- **Adaptive Navigation**: Site header transforms into a slide-down mobile navigation drawer with touch-friendly tap targets.
- **Adaptive Grids**: Commodity cards, technical specs, and category showcases adjust seamlessly from multi-column desktop layouts to single-column mobile viewports.
- **Touch-Friendly Forms**: Multi-item quotation builder and PIN-protected tracking desk feature full-width inputs, touch-optimized number controls, and responsive modal drawers.
- **Scrollable Admin Controls**: The admin table features horizontal scrolling and sticky action columns for smooth management on tablet and smartphone screens.

*(Note: INDKAN HarvestLink is engineered as a responsive mobile web platform rather than a standalone native Flutter or React Native mobile application).*

---

## 💻 Local Setup & Development

### Step 1: Navigate to Frontend Directory
```bash
cd Indkan_Frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Copy the provided `.env.example` file to `.env`:
- **Windows**:
  ```powershell
  copy .env.example .env
  ```
- **Linux / macOS**:
  ```bash
  cp .env.example .env
  ```

In your `.env` file, specify the raw URL of your running backend:
```env
VITE_API_BASE_URL=http://127.0.0.1:5001
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open the local URL displayed in your terminal (typically `http://localhost:5173` or `http://localhost:5175`).

---

## 🧪 Production Build & Quality Verification

Before deploying, run the production build check to ensure TypeScript strict compliance and clean bundling:

```bash
npm run build
```

**Quality Status**:
- TypeScript strict checking (`tsc -b`): Passed (0 errors).
- Vite production bundling: Completed successfully into `dist/`.

---

## ☁️ Cloud Deployment Guide (Vercel)

1. Push your repository to GitHub.
2. Log in to your [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Select your repository:
   - **Root Directory**: `Indkan_Frontend` *(leave empty `./` if deploying from a dedicated frontend repository)*
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the Production Environment Variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-service.onrender.com` *(The live URL of your deployed Render/Railway backend)*
5. Click **Deploy**. Vercel will build and publish your live production URL with SSL enabled.
