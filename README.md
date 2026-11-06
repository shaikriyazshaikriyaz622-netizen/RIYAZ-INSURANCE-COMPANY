# Riyaz Insurance Co. — Modern Digital Insurance Platform

A modern, elegant, and fully functional multi-page insurance platform built with **pure HTML5, modern CSS3, and Vanilla JavaScript (ES6+)** with **zero backend dependencies or heavy frameworks**. Features real photography, interactive quote calculators, 3D flippable digital ID cards, 24/7 AI chatbot assistant, frictionless claims filing with photo preview, real-time claim tracker, and global branch locator.

---

## 🌟 Key Features & Interactive Engines

1. **Instant Quote Engine (`quote.html` & `index.html`)**:
   - 6 Insurance Categories: Health, Motor Auto & EV, Term Life & Legacy, Home Villa, Commercial Cyber, and Global Travel.
   - Interactive sliders for Age (18–75) and Sum Insured ($100k – $5M).
   - Plan Tier Multipliers (Silver, Gold, Diamond) with live breakdown math.
   - Add-on riders with live dollar calculation.
   - Promo Code discount engine (try code: `RIYAZ20` for 20% instant discount).
   - Printable official digital quote proposal modal.

2. **Claims Center & Live Real-Time Tracker (`claims.html`)**:
   - 3-Step Claim Filing Wizard with live file attachment photo preview (`FileReader` API).
   - Automatic unique `CLM-xxxxxx` Claim Reference ID generator and `localStorage` persistence.
   - Live Claim Search Tracker with 4-stage visual progress bar and timeline pills.
   - Preloaded demo claims for instant lookup: `CLM-883921` (Health), `CLM-100201` (Motor EV), and `CLM-492019` (Property).
   - 24/7 Emergency Dispatch Helpline callouts.

3. **Customer Member Portal (`portal.html`)**:
   - Member login simulation for Shaik Riyaz (Member ID: `RI-MEM-10029`).
   - **Interactive 3D Flippable Digital Insurance ID Card** (`digitalInsuranceCard`) with gold hologram chip, cashless hospital QR code, and print shortcut.
   - Active policy management for Health, Motor Auto EV, and Home Villa plans.
   - Instant renewal premium payment checkout modal.
   - 80D Tax exemption certificate generator (PDF simulation).

4. **24/7 Intelligent AI Assistant ("Riyaz AI Bot")**:
   - Floating interactive chat assistant with natural language response engine.
   - Quick-reply chips (Get Quote, Track Claim, Cashless Hospitals, Network Garages, Call Advisor).
   - Audio feedback using the browser Web Audio API (gentle audio chime).
   - Typing indicator simulation and badge notifications.

5. **Interactive Savings Visualizer (Chart.js)**:
   - Dynamic 1-Year, 3-Year, and 5-Year bundle savings comparisons comparing Riyaz Insurance bundles against traditional fragmented policies.

6. **Interactive Global Branch Locator (`contact.html`)**:
   - Dynamic branch switcher for Hyderabad Global HQ, Mumbai Financial Hub, Dubai DIFC, and London European Hub.
   - Dynamically updates physical office photography, regional desk manager portrait, address, direct phone, email, and working hours.
   - 1-on-1 advisor callback appointment scheduler.

7. **Knowledge Base & Blog Reader (`blog.html`)**:
   - Live search input filter and topic category filter chips (Health, Motor Auto, Term Life, AI & Tech).
   - 6 photo-illustrated articles with reading time estimates.
   - Free downloadable policyholder checklist handbooks (PDF).

8. **Company Story & Executive Team (`about.html`)**:
   - Founder & CEO spotlight on **Shaik Riyaz**.
   - Executive leadership portraits: Dr. Ayesha Khan (Chief Medical Officer), Rajesh Varma (VP Technology & AI), Sarah Jenkins (VP Claims), David Sterling (Chief Actuary).
   - Interactive company timeline and audited solvency metrics.

9. **Custom Design System (`styles.css`)**:
   - Dark/Light mode switcher with `localStorage` state persistence.
   - Glassmorphism UI styling, floating animated background gradient blobs, 3D card perspective rotations, and `@media print` stylesheets.

---

## 📁 Project File Structure

```
├── index.html        # Homepage with active plan cards, Chart.js visualizer, reviews, founder spotlight
├── about.html        # About company, Shaik Riyaz founder story, executive team portraits, milestones
├── products.html     # 6 photo-illustrated product sections, tier comparison tables (Silver/Gold/Diamond)
├── quote.html        # 6-category instant quote calculator, sliders, promo discount, printable proposal
├── claims.html       # Claims filing wizard, live photo upload preview, 4-stage search tracker
├── portal.html       # Customer dashboard, 3D flippable digital ID card, renewal payment modal
├── blog.html         # Knowledge hub, live search filter, topic chips, illustrated articles, PDF guides
├── contact.html      # Global branch switcher (Hyderabad, Mumbai, Dubai, London), callback scheduler
├── styles.css        # Glassmorphism, 3D flip card, animations, dark/light theme tokens, print CSS
├── app.js            # Pure Vanilla JS application logic engine (1,149 lines, zero frameworks)
└── README.md         # Documentation and project manual
```

---

## 💻 Tech Stack (100% Client-Side)

- **HTML5**: Semantic tags, accessibility attributes, modern responsive viewports.
- **CSS3 & Tailwind CSS CDN**: Modern CSS variables, glassmorphism, 3D transforms, fluid grid layouts.
- **Vanilla JavaScript (ES6+)**: Custom event engine, state management, audio synthesis, `localStorage`.
- **Chart.js CDN**: Interactive chart visualization for premium savings.
- **Lucide Icons CDN**: Crisp SVG iconography.
- **Unsplash Photography**: High-resolution, curated real photography for all products, executive leaders, and branch offices.

---

## 🚀 How to Run

1. Open `index.html` directly in any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, Brave).
2. **Zero build steps, package installations, or backend servers required!**

---

© 2026 Riyaz Insurance Co. (Shaik Riyaz Assurance Group). Founded by Shaik Riyaz. All rights reserved.
