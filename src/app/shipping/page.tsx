import { motion } from "framer-motion";
import Link from "next/link";
import { FiTruck, FiBox, FiClock, FiRotateCcw, FiShield } from "react-icons/fi";

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-soft-bg pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <nav className="flex text-sm text-gray-400 mb-8 font-medium">
          <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-navy">Shipping & Returns</span>
        </nav>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">Shipping & Returns</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Everything you need to know about how we deliver our premium handcrafted furniture to your doorstep, and our hassle-free return policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-teal-100 transition-all">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <FiTruck size={120} className="text-teal-600" />
             </div>
             <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-6">
                <FiTruck size={24} />
             </div>
             <h2 className="text-2xl font-serif font-bold text-navy mb-4 relative z-10">Shipping Policy</h2>
             <ul className="space-y-4 text-gray-600 relative z-10">
               <li className="flex items-start gap-3">
                 <span className="mt-1 text-teal-600 shrink-0"><FiClock /></span>
                 <span><strong>Standard Dispatch:</strong> In-stock items are typically dispatched within 3-5 business days.</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="mt-1 text-teal-600 shrink-0"><FiBox /></span>
                 <span><strong>Custom Orders:</strong> Handcrafted bespoke furniture requires 3-4 weeks for complete artisanal production before shipping.</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="mt-1 text-teal-600 shrink-0"><FiTruck /></span>
                 <span><strong>Free Delivery:</strong> We offer complimentary secure delivery across the Trivandrum city perimeter. Outside Trivandrum, standard freight charges will apply incrementally based on weight and volume.</span>
               </li>
             </ul>
           </div>

           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-navy transition-all">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <FiRotateCcw size={120} className="text-navy" />
             </div>
             <div className="w-14 h-14 bg-gray-50 text-navy rounded-full flex items-center justify-center mb-6">
                <FiRotateCcw size={24} />
             </div>
             <h2 className="text-2xl font-serif font-bold text-navy mb-4 relative z-10">Returns & Exchanges</h2>
             <ul className="space-y-4 text-gray-600 relative z-10">
               <li className="flex items-start gap-3">
                 <span className="mt-1 text-navy shrink-0"><FiShield /></span>
                 <span><strong>7-Day Window:</strong> We accept return verification requests strictly within 7 days of the delivery if the condition is functionally compromised upon transit.</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="mt-1 text-navy shrink-0"><FiBox /></span>
                 <span><strong>Condition:</strong> To be eligible for a return, your furniture must be unused and placed exactly in its original delivered condition without modifications.</span>
               </li>
               <li className="flex items-start gap-3">
                 <span className="mt-1 text-navy shrink-0"><FiRotateCcw /></span>
                 <span><strong>Custom Exclusions:</strong> Custom-designed interiors or tailored upholstery choices cannot be returned due to their personalized nature, unless fundamentally defective.</span>
               </li>
             </ul>
           </div>
        </div>

        <div className="bg-teal-50 rounded-3xl p-8 md:p-12 text-center border border-teal-100">
           <h2 className="text-2xl font-bold text-navy mb-4">Received a Damaged Item?</h2>
           <p className="text-gray-600 max-w-2xl mx-auto mb-8">
             Our packing process uses industrial double-layered wrapping to ensure the woodwork is shielded. However, if transit damage occurs, please take clear pictures immediately and contact support so we can dispatch our carpenters or process a replacement.
           </p>
           <Link href="/contact" className="inline-block bg-navy text-white px-8 py-4 rounded-full font-semibold hover:bg-teal-700 transition-colors shadow-lg">
             Contact Support Team
           </Link>
        </div>
      </div>
    </div>
  );
}
