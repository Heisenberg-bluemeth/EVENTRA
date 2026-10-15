# EVENTRA — The Immersive 3D Universe for Events, Movies, Sports & Tickets 🎟️✨

> **“Discover the Moment. Experience the Extraordinary.”**

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r164-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

**EVENTRA** is a next-generation platform for discovering events and purchasing tickets across concerts, cricket championships, football derbies, IMAX 3D movies, comedy specials, and gaming tournaments in an immersive, full-page 3D spatial computing environment.

---

## 🌌 Spatial 3D Architecture & Visual System

* **Full-Page 3D Engine**: Persistent atmospheric visual layer (`GlobalAtmosphereCanvas`) with cosmic cyber dust particles, floating geometric polyhedrons, volumetric lighting, and mouse parallax.
* **The EVENTRA Portals Universe**: Interactive 3D gateway on the Homepage with rotating holographic category rings (Concerts, Sports, Movies, Comedy, Festivals, Gaming) that react to pointer hover and click.
* **Category 3D Experiences**:
  * **Sports**: 3D Stadium pitch with turf boundaries, floodlight towers, and rotating sports balls (`Stadium3DScene`).
  * **Cinema**: 3D Cinema marquee with rotating film reels and volumetric projector light cone (`CinemaMarquee3D`).
  * **Concerts**: 3D Live stage with concert lighting trusses, sweeping laser beams, and dynamic audio visualizer equalizer spectrum (`ConcertStage3D`).
  * **Calendar**: 3D Chronos gyroscopic interlocking time rings (`ChronosTimeRing3D`).
  * **Seating Bowl**: 3D interactive curved stadium bowl with clickable section tiers (`VenueBowl3D`).
  * **Ticket Wallet**: 3D holographic metallic digital passes with real-time pointer tilt, barcode, and QR code pass (`HolographicTicket3D`).
* **Adaptive 2D High Performance Mode**: Dedicated toggle in the navbar to switch between 3D WebGL and lightweight 2D mode, with automatic fallback for `prefers-reduced-motion` and non-WebGL hardware.

---

## 🏛️ Application Routes & Features

| Route | Page | Key Features |
| :--- | :--- | :--- |
| `/` | **Universe (Homepage)** | 3D portals, live autocomplete search, city selector, featured carousel, trending grid |
| `/explore` | **3D Discovery Gallery** | Multi-filter (city, category, month, price, 3D seats), multi-field sorting, grid/list view |
| `/calendar` | **The Time Dimension** | 3D chronos rings, monthly calendar with leap year date math, date click filter, agenda view |
| `/sports` | **Stadium Universe** | 3D stadium pitch, IPL & European football match fixtures, team crests, seat reservation |
| `/movies` | **Cinema Dimension** | 3D marquee with projector beam, IMAX 70mm showtimes, formats (Dolby/4K Laser), seat tiers |
| `/concerts` | **Live Arena** | 3D stage with laser sweep and audio bars, artist lineups, festival passes, VIP tiers |
| `/category/:cat` | **Category Hubs** | Thematic portals for Comedy, Theatre, Gaming & Esports, Festivals, Workshops |
| `/event/:id` | **Event Details** | Category 3D scene, date, start time, venue, performers/teams, rules, ticket tier selector |
| `/venue/:id` | **3D Venue & Seating** | 3D stadium bowl view + accessible 2D seat map toggle, live seat state tracker, price calculation |
| `/checkout` | **Simulated Checkout** | Attendee validation, coupon code (`EXTRAORDINARY10`), simulated payment methods, total math |
| `/confirmation/:ref` | **Booking Confirmation** | Celebratory confetti, unique reference, 3D holographic pass inspector, pass download (.txt) |
| `/tickets` | **My 3D Ticket Wallet** | Active & cancelled passes, 3D holographic pass inspector, demo cancellation flow |
| `/wishlist` | **Saved Experiences** | Events saved in `localStorage`, instant booking navigation |
| `/profile` | **Guest Profile** | Saved city hub, booking history stats, graphics engine toggle, clear local data |
| `/about` | **About & Support** | Brand story, 3D architecture, FAQ accordion, validated contact support form |

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

### 1. Installation
```bash
# Navigate to the project directory
cd eventra-events

# Install dependencies
npm install
```

### 2. Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Running Unit Tests
```bash
npm test
```
Runs 11 automated Vitest tests verifying:
- Event catalogue integrity and non-empty ticket tier pricing across 2026+ dates.
- Coupon code calculation (`EXTRAORDINARY10` = 10%, `WELCOME2026` = 15%).
- Booking reference uniqueness and format (`EVT-2026-XXXXX`).
- Deterministic 72-seat map generation with available and reserved seats.
- LocalStorage persistence for wishlists, bookings, and demo cancellation.

### 4. Production Build
```bash
npm run build
```
Compiles TypeScript and creates optimized bundles in `dist/` with dedicated vendor chunks (`vendor-three`, `vendor-react`, `vendor-ui`).

### 5. Local Production Preview
```bash
npm run preview
```

---

## 🚢 Deployment Guide

### Deploying to Netlify

#### Option A: Direct Netlify CLI
```bash
npm run build
npx netlify deploy --dir=dist --prod
```

#### Option B: GitHub Integration
1. Initialize Git and commit your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: EVENTRA 3D Ticket Universe"
   ```
2. Create a repository on [GitHub](https://github.com/new) and push your branch:
   ```bash
   git remote add origin https://github.com/<your-username>/eventra-events.git
   git branch -M main
   git push -u origin main
   ```
3. Connect your repository in [Netlify](https://app.netlify.com/):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Netlify will automatically detect [`netlify.toml`](file:///C:/Users/maybe/.gemini/antigravity/scratch/eventra-events/netlify.toml) and [`public/_redirects`](file:///C:/Users/maybe/.gemini/antigravity/scratch/eventra-events/public/_redirects) for client-side routing.

---

## 🛡️ Demonstration Limitations & Future Integrations

1. **Simulation Model**: EVENTRA is an interactive demonstration web application. All events, match schedules, cinema showtimes, and booking references are simulated passes and invalid for actual real-world venue entry.
2. **Zero Payment Credentials**: The simulated checkout tests payment flows without requesting real payment credentials or debiting funds.
3. **Provider Interface**: Event queries and seat generation are abstracted behind [`EventService`](file:///C:/Users/maybe/.gemini/antigravity/scratch/eventra-events/src/services/eventService.ts) and [`StorageService`](file:///C:/Users/maybe/.gemini/antigravity/scratch/eventra-events/src/services/storageService.ts), making it straightforward to connect live APIs (e.g. Ticketmaster, Stripe, or custom booking backends) in the future.

---

## 📄 License
Released under the **MIT License**.
