import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Premium Furniture in Nedumangad | Best Sofa & Bed Store Trivandrum",
  description: "Browse the finest collection of luxury sofas, beds, wardrobes, and dining tables at Nilambur Interiors & Furniture. Located in Valikkode, Nedumangad, Trivandrum.",
  keywords: "buy furniture nedumangad, best sofa shop trivandrum, luxury beds kerala, nilambur furniture catalogue, wooden furniture nedumangad",
  openGraph: {
    title: "Shop Premium Furniture | Nilambur Interiors Nedumangad",
    description: "Browse the finest collection of luxury sofas, beds, wardrobes, and dining tables at Nilambur Interiors & Furniture in Valikkode, Nedumangad.",
    url: "https://nilambur-furniture.com/products",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
