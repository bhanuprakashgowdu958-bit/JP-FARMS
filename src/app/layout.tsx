import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JP Farms | Heritage Desi Roosters, Pure Aseel & Indigenous Avian Conservation",
  description: "Official online living gallery for JP Farms. Explore pure bloodline Peela Aseel, Kagar, Sindhi Heavy Aseel, Kadaknath, and indigenous Indian gamefowl with HD stance videos, biological traits, and farm visit schedules.",
  keywords: "Desi rooster farm, pure Aseel roosters, Kadaknath conservation, Peela Aseel, Kagar Aseel, Sindhi Aseel, Natu Kodi showcase, rooster videos, Indian gamefowl heritage",
  openGraph: {
    title: "JP Farms - Pure Desi Roosters & Heritage Bloodlines",
    description: "Explore elite verified heritage roosters with unfiltered HD walking videos, biological pedigree traits, and farm visitation guide.",
    images: ["https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable}`}>
      <body className={`${inter.className} antialiased text-slate-800 bg-[#f4f9fd] selection:bg-sky-500 selection:text-white font-sans`}>
        {children}
      </body>
    </html>
  );
}
