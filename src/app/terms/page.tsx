import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-soft-bg pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <nav className="flex text-sm text-gray-400 mb-8 font-medium">
          <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-navy">Terms of Service</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-gray-100 mb-12 prose prose-lg text-gray-600">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-12">Terms & Conditions</h1>
          
          <p className="lead text-xl text-navy font-medium mb-8">
            Welcome to Nilambur Furniture. By accessing our website and purchasing our handcrafted products, you agree to comply with and be bound by the following terms and conditions.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-12 mb-4">1. Product Descriptions and Pricing</h2>
          <p>
            We strive to ensure that all details, descriptions, and prices of products appearing on our website are accurate. However, errors may occur. Since our furniture is handcrafted from natural wood, variations in grain, color, and texture are inherent and are not considered defects. Prices are subject to change without notice. All prices include applicable GST unless stated otherwise.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-12 mb-4">2. Custom Orders and Lead Times</h2>
          <p>
            Custom interior works and bespoke furniture pieces require a non-refundable advance payment of 50%. The estimated lead time will be communicated during order confirmation. While we endeavor to meet these timelines, delays due to unforeseen artisanal or logistical challenges will be communicated promptly.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-12 mb-4">3. Shipping and Delivery</h2>
          <p>
            Free delivery is provided within the Trivandrum city limits. For inter-state shipping, logistics charges will be calculated at checkout or communicated via quoting. The customer is responsible for ensuring adequate access space for large furniture deliveries. Risk of loss passes to you upon delivery.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-12 mb-4">4. Warranty and Returns</h2>
          <p>
            We offer a comprehensive 5-year structural warranty on all solid wood frames against manufacturing defects. Normal wear and tear, fabric snagging, or damage due to improper use are excluded. Returns are only accepted within 7 days of delivery if the product arrives damaged or significantly differs from the description. Refund processing may take up to 10-14 business days.
          </p>

           <h2 className="text-2xl font-bold text-navy mt-12 mb-4">5. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Kerala.
          </p>

          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50 rounded-2xl p-6">
             <p className="text-sm font-semibold mb-4 md:mb-0">Last Updated: October 2023</p>
             <Link href="/contact" className="text-teal-600 font-bold hover:underline">
               Questions? Contact Support
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
