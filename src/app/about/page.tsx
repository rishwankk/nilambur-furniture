"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-soft-bg pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <nav className="flex text-sm text-gray-400 mb-8 font-medium">
          <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-navy">About Us</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-gray-100 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-navy mb-6">Our Legacy of Craftsmanship.</h1>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
              At Nilambur Furniture, we don't just build furniture; we craft legacies. Rooted in the rich teak forests of Kerala, our journey spans generations of mastering the art of premium woodwork.
            </p>
          </motion.div>

          {/* Value Prop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative h-96 w-full rounded-3xl overflow-hidden shadow-lg border-4 border-gray-50">
               <Image src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80" fill alt="Woodworking Craftsman" className="object-cover" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
               <h2 className="text-3xl font-serif font-bold text-navy">Authentic Teak, Uncompromising Quality</h2>
               <p className="text-gray-600 leading-relaxed text-lg">
                 Every piece we create is a testament to the unparalleled durability and beauty of authentic Nilambur Teak. Our artisans combine traditional hand-carving techniques with modern precision engineering to ensure your furniture lasts a lifetime.
               </p>
               <ul className="space-y-4 text-gray-700 font-medium">
                 <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-teal-600"></span> 100% Genuine Solid Wood</li>
                 <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-teal-600"></span> Ethical & Sustainable Sourcing</li>
                 <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-teal-600"></span> 5-Year Structural Warranty</li>
               </ul>
            </motion.div>
          </div>

          <div className="text-center bg-gray-50 rounded-3xl p-12 border border-gray-200 shadow-inner">
             <h2 className="text-3xl font-serif font-bold text-navy mb-6">Experience the Difference</h2>
             <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
               Step into our world of luxury interiors. Let us help you transform your house into a bespoke home.
             </p>
             <Link href="/products" className="inline-block bg-teal-700 text-white font-bold py-4 px-10 rounded-full hover:bg-navy transition-all shadow-xl hover:-translate-y-1">
               Explore Collections
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
