import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JP Farms | Heritage Desi Roosters, Pure Aseel & Kadaknath Breeding Farm",
  description: "Official online showroom for JP Farms. View live videos, photos, and buy pure bloodline Peela Aseel, Kagar, Sindhi Aseel, Kadaknath, and indigenous country roosters with safe All-India live transit.",
  keywords: "Desi rooster farm, pure Aseel rooster for sale, buy Kadaknath rooster, Peela Aseel, Kagar Aseel, Sindhi fighter rooster, Natu Kodi farm, rooster videos",
  openGraph: {
    title: "JP Farms - Pure Desi Roosters & Heritage Bloodlines",
    description: "Explore top-class verified roosters with live walking videos, pedigree specs, and direct farm booking.",
    images: ["https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased text-stone-900 bg-[#fbfdfa] selection:bg-emerald-700 selection:text-white">
        {children}
      </body>
    </html>
  );
}
