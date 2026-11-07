# 🐓 JP FARMS - Premium Desi & Heritage Rooster Platform

Welcome to **JP Farms** — a modern, top-tier e-commerce and media showroom platform built specifically for breeding farms selling heritage desi roosters, championship Aseel, pure Kadaknath, and indigenous gamefowl.

---

## 🌟 Key Features Built

### 1. 🎬 HD Walking & Stance Video Reels ("JP Rooster TV")
- **Video-First Rooster Presentation:** Animal buyers inspect gait, alertness, wing spread, tail curve, spurs, and comb before purchasing.
- **Swipeable / Clickable Video Reels Player:** Instagram/TikTok-style vertical video reels with sound control, pause/play, overlay specs, and direct 1-click WhatsApp purchase.

### 2. 🏷️ Individual Tagging & Catalog System
- Every bird gets an individual **Tag ID** (e.g. `JP-AS-101`), verified weight, age, standing height, and physical attributes.
- **Real-Time Statuses:**
  - 🟢 **AVAILABLE FOR DISPATCH:** Ready for immediate order or booking token.
  - 🟡 **TOKEN RESERVED:** Bird held for 48 hours for an interested buyer.
  - 🔴 **SOLD OUT:** Clearly labeled, with a "Request Similar Clutch" action.
- **Smart Filtering:** Filter by Breed (Pure Peela Aseel, Kagar, Sindhi, Kadaknath, Natu Kodi, Breeding Pairs), Status, and Price/Weight sorting.

### 3. 🔍 Deep Biological & Health Specs Modal
- Multi-angle photo gallery + HD video switch.
- Verified **Veterinary Vaccination Records** (Ranikhet ND-Lasota, Fowl Pox, IBD, Deworming).
- Diet regimen (Sprouted Bajra, Almond paste, Boiled Desi eggs, organic greens).
- Lineage & pedigree history (e.g. Garuda Champion bloodline).

### 4. 📲 High-Converting WhatsApp & Booking Funnel
- Pre-filled WhatsApp message generation with bird Tag ID, breed, and price for zero-friction chat with the farm owner.
- **3 Booking Methods:**
  1. **Hold Token (₹500 for 48 hrs)** to lock the bird.
  2. **Full Purchase & Immediate Express Transit**.
  3. **Direct Farm Visit & In-Person Handover**.
- Confetti celebration upon booking and automated registry logging.

### 5. 🛠️ Farm Owner & Admin Control Panel (`/admin`)
- **Add New Rooster:** Upload photos, paste walking video links or upload MP4 files, enter tag ID, age, weight, comb, diet, price, and status.
- **Instant Status Toggle:** Flip between Available, Reserved, and Sold in one click.
- **Customer Inquiry Tracker:** View incoming buyer leads, destinations, requested roosters, and one-click direct WhatsApp reply.
- **Live Inventory Analytics:** Total birds, current stock value in ₹, sold count, and active inquiries.

### 6. 🌿 Farm Bio-Security & Safe All-India Transit Logistics
- Educational guide on free-range pasture roaming and organic grain feeding.
- Detailed step-by-step breakdown of customized ventilated travel crates equipped with hydration gel, cucumbers, and grain bedding for stress-free transit across India.

---

## 🚀 How to Run the Website

### Development Mode (with Live Hot-Reloading):
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Production Build & Launch:
```bash
npm run build
npm start
```

### Accessing the Admin Portal:
Navigate to **[http://localhost:3000/admin](http://localhost:3000/admin)** or click the **Admin Login** button in the header.

---

## 📁 Project Architecture

```
JP Farms/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx           # Farm Owner / Admin Management Dashboard
│   │   ├── globals.css            # Custom luxury agricultural styles & animations
│   │   ├── layout.tsx             # Root Layout with SEO metadata & OpenGraph tags
│   │   └── page.tsx               # Main Showroom Homepage
│   ├── components/
│   │   ├── AdminPanel.tsx         # Full CRUD rooster & inquiry management
│   │   ├── BookingModal.tsx       # Instant booking, token checkout & confetti
│   │   ├── BreedsGuide.tsx        # Educational showcase of pure Indian breeds
│   │   ├── DeliveryProcess.tsx    # Live animal crate transit logistics
│   │   ├── FarmBioSecurity.tsx    # Diet, vaccination & organic standards
│   │   ├── Footer.tsx             # Farm contact, hours, address & disclaimer
│   │   ├── Header.tsx             # Sticky navbar, live status & quick actions
│   │   ├── Hero.tsx               # High-impact hero section & featured bird card
│   │   ├── RoosterCard.tsx        # Individual rooster card with specs & CTA
│   │   ├── RoosterCatalog.tsx     # Filterable, searchable inventory grid
│   │   ├── RoosterDetailModal.tsx # Full-screen biological specs & video inspection
│   │   ├── RoosterReelsModal.tsx  # TikTok/Reels-style vertical video player
│   │   └── Testimonials.tsx       # Verified breeder reviews & testimonials
│   ├── lib/
│   │   ├── data.ts                # Initial rooster catalog & farm info
│   │   ├── roosterStore.ts        # Client/Server reactive persistence layer
│   │   └── utils.ts               # WhatsApp link generator, formatPrice, tailwind helpers
│   └── types/
│       └── rooster.ts             # Domain TypeScript interfaces
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 📱 Customizing Your Farm Details

Edit `src/lib/data.ts` to update:
- Farm Name, Phone Number, and WhatsApp Number.
- Farm physical address and visiting hours.
- Default pricing, breeds, and initial roosters.

