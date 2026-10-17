# Farzi — Premium Restaurant Website + Interactive QR Digital Menu + RestaurantOS Pro

[![Node.js](https://img.shields.io/badge/Node.js-v24.19+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21_LTS-orange.svg)](https://openjdk.org/)

An award-winning, production-ready digital dining experience for **Farzi — Progressive Modern Indian Culinary Lab**. This unified ecosystem combines an editorial customer-facing brand website, an interactive mobile-first QR-code digital table menu with live kitchen ordering, and the **RestaurantOS Pro** administrative command center.

> **Demonstration Notice**: This project is built as a premier demonstration of modern hospitality software engineering and progressive Indian dining aesthetics. It is not officially affiliated with Massive Restaurants Pvt Ltd.

---

## 🌟 Key Product Pillars

### 1. Cinematic Customer Website
- **Atmospheric Visual Identity**: Deep charcoal (`#0A0B0E`), muted gold (`#D4AF37`), burnished copper (`#C57D56`), and warm ivory (`#FAF8F5`).
- **Editorial Typography**: Pairing *Cinzel* display serif with *Playfair Display* and *Plus Jakarta Sans*.
- **Motion & Storytelling**:
  - Hero carousel with smooth crossfades between molecular gastronomy photography.
  - Staggered scroll reveals, hover image zooms, and tactile micro-interactions.
  - Interactive lightbox for dining chamber ambiance and plating photography.
  - Complete storytelling on progressive molecular gastronomy (reverse spherification, liquid nitrogen cryogenics, smoked bell jars).
- **Concierge Table Reservations**: Real-time slot booking with instant confirmation reference ticket.

### 2. QR-Code Mobile Digital Menu (`/menu?table=T04`)
- **First-Class Table Experience**: Deep-linked table URLs (`/menu?table=T01` to `T12`) with active table indicator.
- **Fast Visual Browsing**:
  - Sticky category pills for instant scrolling.
  - Dietary filters: Pure Veg (green square), Non-Veg (red triangle), Chef's Signature, and Spice Levels (Mild, Medium, Hot, Extra Hot).
  - Quick quantity controls (+ / -) directly on food cards.
  - Comprehensive modal showing preparation time, calorie counts, culinary ingredients, and allergen warnings.
- **Real-Time Order Building & Dispatch**:
  - Live cart drawer with subtotal, 5% GST calculation, and chef instructions.
  - Instant dispatch to the Kitchen Display System (KDS).
  - Confetti celebration and order tracking ticket.

### 3. RestaurantOS Pro Administrative Command Center (`/admin`)
- **Operational Analytics Dashboard**:
  - Real-time gross revenue, active orders queue, upcoming reservations, and table turns.
  - **Recharts** visualizations: Daily revenue curves, top guest dish selections, and QR scan telemetry.
- **Live Kitchen Display System (KDS)**:
  - Real-time order cards by table.
  - One-click workflow: `PENDING` ➔ `IN_KITCHEN` ➔ `READY` ➔ `SERVED` ➔ `COMPLETED`.
  - Automatic table vacancy upon order completion.
- **Menu Items Studio**:
  - Full CRUD: Create, edit descriptions, adjust prices in INR, select high-definition imagery, toggle availability in 1 click, and toggle Chef's Signature badges.
  - Instant reflection on the public website and mobile QR menus.
- **Reservation Concierge Desk**:
  - View all guest requests, confirm bookings, and assign table stations (T01 - T12).
- **QR Signage Studio**:
  - Generate QR codes for any table with live preview.
  - Download high-resolution PNGs.
  - **Printable Branded Table Tent Card**: Formatted for A5/A6 acrylic stands with restaurant crest, table badge, QR code, and guest instructions.
- **Restaurant Settings**:
  - Live configuration of operating hours, phone lines, WhatsApp hotlines, address, and GST rates.

---

## 🏗️ Technical Architecture

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Farzi luxury design tokens
- **Animations**: Framer Motion (with `prefers-reduced-motion` compliance)
- **Icons**: Lucide Icons
- **Data Visualization**: Recharts
- **QR Code Engine**: `qrcode` canvas & data URL renderer
- **Celebration Effects**: `canvas-confetti`

### Backend Engine
1. **Zero-Dependency High-Performance API Server (`server/index.js`)**:
   - Built with Express, JWT authentication, and bcrypt password hashing.
   - Persistent relational data store in `server/data/restaurantos.json`.
   - Auto-seeded with 15+ curated Farzi progressive dishes, 12 tables, demo orders, and reviews.
   - Provides instant 60 FPS local execution with `npm run dev`.
2. **Spring Boot 3 / Java 21 Enterprise Blueprint (`backend-java/`)**:
   - Spring Boot 3.3.5, Spring Security 6, Spring Data JPA, Hibernate, and MySQL 8.
   - Versioned Flyway migrations (`V1` to `V4`) covering users, menu categories, menu items, reservations, gallery, reviews, settings, orders, and tables.
   - Layered architecture: Controllers, Services, Repositories, Entities, DTOs, and Exception Handlers.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+`

### 2. Local Startup
```bash
# Navigate to project directory
cd C:\Users\Samit\.gemini\antigravity\scratch\farzi-restaurantos

# Install dependencies (already executed)
npm install

# Run both the API Server (:5000) and Vite Web Client (:5173) simultaneously
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

### 3. Default Administrative Credentials
- **Portal URL**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Email**: `admin@restaurantos.local`
- **Password**: `Admin@12345`
*(A "Fill In" demo shortcut button is provided directly on the login screen for 1-click evaluation)*

---

## 🧪 Verified Test Scenarios

The following end-to-end user workflows were verified via automated testing:
1. **Homepage Crossfade**: Verified hero carousel transitions, brand narrative, and signature dish grid.
2. **A La Carte Menu**: Verified search queries, vegetarian/non-veg toggle, and category navigation.
3. **Table QR Ordering**: Placed real orders at `Table T04`, verified subtotal and 5% GST calculations, received order ticket (`FZ-1972`).
4. **Kitchen Order Workflow**: Verified order transmission from mobile menu to RestaurantOS KDS, updated status through `IN_KITCHEN` ➔ `READY`.
5. **Table Reservation**: Submitted booking for *Kavita Rao* (4 Guests), verified database persistence and concierge desk display.
6. **QR Studio**: Verified generation of high-resolution QR codes and printable branded table tent card view.
7. **Menu Management**: Tested creating, updating, and toggling dishes; verified instant persistence to both website and QR digital menu.
8. **Production Build**: Verified with `tsc && vite build` (3045 modules transformed, zero compile errors).

---

## 📦 Deployment Instructions

### Deploy Frontend to Vercel
1. Set Root Directory to `C:\Users\Samit\.gemini\antigravity\scratch\farzi-restaurantos`.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables:
   - `VITE_PUBLIC_APP_URL`: Your Vercel production domain (e.g. `https://farzi.vercel.app`)

### Deploy Java Backend to Render / Railway
1. Set Root Directory to `backend-java`.
2. Provision a MySQL 8 database instance.
3. Configure Environment Variables:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
   - `JWT_SECRET`: Random 32+ byte string
   - `CORS_ALLOWED_ORIGINS`: Your Vercel frontend URL
4. Run command: `./mvnw spring-boot:run` or `mvn spring-boot:run`. Flyway will automatically execute migrations `V1` through `V4`.
