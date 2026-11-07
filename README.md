# 🐓 JP FARMS - Heritage Desi Rooster Living Gallery & Conservation Estate

Welcome to **JP Farms** — an indigenous avian conservation and living showroom platform dedicated to preserving pure bloodlines of Indian gamefowl: **Championship Aseel (Peela, Kagar, Sindhi)**, pure **Kadaknath**, and authentic native **Country Desi (Natu Kodi)** roosters.

---

## 🌟 Key Features

### 1. 🎬 HD Walking & Stance Video Reels ("JP Rooster TV")
- **Video-First Inspection:** Observe natural crowing, posture, gait, wing spread, and bone structure in unfiltered high definition.
- **Vertical Video Reels Player:** Full-screen viewing experience with mute/unmute controls, specs overlay, and one-click WhatsApp breeder connection.

### 2. 🏷️ Individual Tagging & Living Gallery
- Every bird carries a unique **Tag ID** (e.g. `JP-AS-101`), verified weight, age, standing height, and physical attributes.
- **Prestige Badges:**
  - 👑 **Champion Line:** Direct descendants of national championship bloodlines.
  - ⭐ **Farm Stud:** Primary breeding sires maintained for genetic purity.
  - 🌿 **Heritage Pure:** 100% DNA-pure indigenous strains (e.g. Jhabua Kadaknath).
  - 🌾 **Breeding Flock:** Established family breeding units.
  - ✨ **Young Star:** Upcoming adolescent studs showing exceptional plumage and stance.
- **Smart Filtering:** Filter by Breed Category and Exhibition Badge.

### 3. 🔍 Deep Biological Traits & Health Records
- Multi-angle photo gallery and HD video switch.
- Verified **Veterinary Vaccination Records** (Ranikhet ND-Lasota, Fowl Pox, IBD, Deworming).
- Traditional nutrition regimen (Sprouted Bajra, Almond paste, Boiled Desi eggs, organic greens).
- Lineage & pedigree history (e.g. Garuda Champion bloodline).

### 4. 📜 Official Printable Pedigree & Health Certificate
- Instant certificate generator with gold seal stamps, microchip/leg-tag registration, and veterinary clearance.
- Integrated one-click print support (`window.print()`).

### 5. 🗺️ Farm Visitation & Route Planning Guide
- Interactive highway travel guide with driving directions from major hubs (Hyderabad, Vijayawada, Vizag, Bengaluru, Chennai).
- Farm visiting hours (7:00 AM – 7:00 PM daily) and entrance bio-security protocols.

### 6. 🛠️ Farm Owner & Admin Control Panel (`/admin`)
- **Add & Edit Roosters:** Upload photos, paste walking video links or upload MP4 files, enter tag ID, age, weight, comb, diet, and lineage.
- **Badge Management:** Easily update exhibition status with live preview.
- **Visitor Request Tracker:** View incoming farm visit requests, visitor location, and chat directly on WhatsApp.
- **Firebase Firestore Integration:** Real-time database sync via Google Cloud Firestore.

---

## 🚀 How to Run the Website

### Development Mode:
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
Navigate to **[http://localhost:3000/admin](http://localhost:3000/admin)** or click the **Admin** link in the top bar.

---

## 📁 Project Architecture

```
JP Farms/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx           # Farm Owner / Admin Management Dashboard
│   │   ├── api/                   # Backend routes (roosters, inquiries, upload)
│   │   ├── globals.css            # Custom luxury agricultural styles & animations
│   │   ├── layout.tsx             # Root Layout with SEO metadata & OpenGraph tags
│   │   └── page.tsx               # Main Living Gallery Homepage
│   ├── components/
│   │   ├── AdminPanel.tsx         # Full rooster & visitor inquiry management
│   │   ├── BookingModal.tsx       # Farm visit & breed inquiry scheduling modal
│   │   ├── BreedCertificateModal.tsx # Printable official pedigree certificate
│   │   ├── BreedsGuide.tsx        # Educational showcase of pure Indian breeds
│   │   ├── DeliveryProcess.tsx    # Farm visitation & highway route guide
│   │   ├── FarmBioSecurity.tsx    # Diet, vaccination & organic standards
│   │   ├── Footer.tsx             # Farm contact, hours, address & navigation
│   │   ├── Header.tsx             # Sticky navbar, exhibition status & quick actions
│   │   ├── Hero.tsx               # High-impact hero section & featured stud card
│   │   ├── RoosterCard.tsx        # Individual rooster card with specs & CTA
│   │   ├── RoosterCatalog.tsx     # Filterable, searchable living gallery grid
│   │   ├── RoosterDetailModal.tsx # Full biological specs & video inspection
│   │   ├── RoosterReelsModal.tsx  # JP Rooster TV vertical video player
│   │   └── Testimonials.tsx       # Verified breeder & visitor testimonials
│   ├── lib/
│   │   ├── data.ts                # Initial rooster catalog & farm info
│   │   ├── firebase.ts            # Firebase client initialization
│   │   ├── firebaseService.ts     # Firestore real-time queries & CRUD
│   │   ├── roosterStore.ts        # Client/Server reactive persistence layer
│   │   └── utils.ts               # WhatsApp link generator, styling helpers
│   └── types/
│       └── rooster.ts             # Domain TypeScript interfaces
├── data/
│   └── roosters.json              # Local persistent rooster store
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## ☁️ Deployment on Vercel

1. Push this repository to GitHub: `https://github.com/bhanuprakashgowdu958-bit/JP-FARMS.git`
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Configure the environment variables from `.env.local` (Firebase API credentials).
4. Click **Deploy**.
