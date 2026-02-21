import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Best Furniture Store in Nedumangad, Trivandrum | Nilambur Interiors",
  description: "Looking for the best furniture in Nedumangad, Trivandrum? Shop premium sofas, beds, wardrobes & dining tables at Nilambur Interiors & Furniture, Valikkode.",
  keywords: "furniture in nedumangad, furniture shop in trivandrum, best furniture shop nedumangad, nilambur interiors, nilambur furniture valikkode, premium furniture trivandrum, wooden sofa, home decor nedumangad, best interior designers nedumangad",
  openGraph: {
    title: "Nilambur Interiors & Furniture | Best in Nedumangad, Trivandrum",
    description: "Premium modern furniture and interior design in Nedumangad, Trivandrum. Visit our showroom at Valikkode for luxury sofas, beds, and home decor.",
    url: "https://nilambur-furniture.com",
    siteName: "Nilambur Interiors & Furniture",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD structured data for Local SEO Schema
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "name": "Nilambur Interiors & Furniture",
  "image": "https://nilambur-furniture.com/logo.png",
  "description": "Premium modern furniture and interiors in Nedumangad, Trivandrum. Specializing in luxury sofas, beds, dining tables, and complete interior works.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Valikkode",
    "addressLocality": "Nedumangad",
    "addressRegion": "Kerala",
    "postalCode": "695541",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "8.6146",
    "longitude": "77.0016"
  },
  "url": "https://nilambur-furniture.com",
  "telephone": "+919633772866",
  "priceRange": "₹₹₹",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "20:00"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${playfair.variable} font-sans antialiased flex flex-col min-h-screen bg-[#F8FAFC]`}>
        <Header />
        <main className="flex-grow pt-[72px] md:pt-[80px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
