import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1c1410",
};

export const metadata: Metadata = {
  title: "JP Farms | Heritage Desi Roosters, Pure Aseel & Indigenous Avian Conservation",
  description: "Official online living gallery for JP Farms. Explore pure bloodline Peela Aseel, Kagar, Sindhi Heavy Aseel, Kadaknath, and indigenous Indian gamefowl with HD stance videos, biological traits, and farm visit schedules.",
  keywords: "Desi rooster farm, pure Aseel roosters, Kadaknath conservation, Peela Aseel, Kagar Aseel, Sindhi Aseel, Natu Kodi showcase, rooster videos, Indian gamefowl heritage",
  openGraph: {
    title: "JP Farms - Pure Desi Roosters & Heritage Bloodlines",
    description: "Explore elite verified heritage roosters with unfiltered HD walking videos, biological pedigree traits, and farm visitation guide.",
    images: ["/banners/banner_rainbow_wings_crow.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased text-slate-800 bg-[#faf8f4] selection:bg-amber-500 selection:text-white font-sans`}>
        {children}
      </body>
    </html>
  );
}
