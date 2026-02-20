"use client";

import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-soft-bg pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <nav className="flex text-sm text-gray-400 mb-8 font-medium">
          <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-navy">Contact Us</span>
        </nav>

        <div className="text-center mb-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-serif font-bold text-navy mb-6">Let's Craft Something Beautiful Together.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-gray-500 max-w-2xl mx-auto">
            Whether you have a question about our bespoke collections, shipping policies, or need a custom quote for your interior space, our dedicated craftsmanship team is here to assist.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100">
          
          {/* Contact Details */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-navy mb-2">Reach Out Direclty</h2>
            <p className="text-gray-500 mb-8">We value your inquiries and aim to provide prompt, personalized responses tailored to your lifestyle needs.</p>
            
            <div className="flex items-start gap-6 relative group">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-teal-100 group-hover:scale-110 transition-transform">
                <FiMapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-navy mb-1">Head Office & Factory</h3>
                <p className="text-gray-600 leading-relaxed text-sm">Nilambur, Main Road,<br/>Kerala, India 679329</p>
              </div>
            </div>

            <div className="flex items-start gap-6 relative group">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-teal-100 group-hover:scale-110 transition-transform">
                <FiPhone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-navy mb-1">Call Us (Mon-Sat, 9AM-6PM)</h3>
                <a href="tel:+919876543210" className="text-teal-600 font-bold hover:underline">
                  +91 98765 43210
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6 relative group">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-teal-100 group-hover:scale-110 transition-transform">
                <FiMail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl text-navy mb-1">Email us 24/7</h3>
                <a href="mailto:support@nilambur.com" className="text-teal-600 font-bold hover:underline">
                  support@nilambur.com
                </a>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100">
               <h4 className="font-bold text-navy mb-4">Or hit us up on WhatsApp securely</h4>
               <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-700 transition">
                 Message on WhatsApp
               </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            {success ? (
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col justify-center items-center text-center space-y-4">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                   <FiSend size={32} />
                 </div>
                 <h2 className="text-2xl font-bold text-navy font-serif">Message Sent Successfully!</h2>
                 <p className="text-gray-500">Thank you for contacting Nilambur Furniture. Our experts will revert to you within 24 working hours.</p>
                 <button onClick={() => setSuccess(false)} className="mt-4 border-b-2 border-teal-600 text-teal-700 font-bold hover:text-navy transition-colors pb-1">Send Another Message</button>
               </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-navy font-serif border-b border-gray-200 pb-4">Drop a Quick Message</h3>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Your Full Name</label>
                  <input required placeholder="E.g., Manoj Kumar" type="text" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm shadow-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Email Address</label>
                    <input required placeholder="E.g., hello@mail.com" type="email" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm shadow-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Phone Number</label>
                    <input placeholder="(Optional)" type="tel" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm shadow-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Inquiry Type</label>
                  <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm shadow-sm">
                    <option>Product Inquiry</option>
                    <option>Custom Interior Design</option>
                    <option>Bulk Order/B2B</option>
                    <option>Order Tracking</option>
                    <option>Warranty & Support</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Your Message</label>
                  <textarea required placeholder="How can we help you craft your dream space?" rows={4} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm shadow-sm resize-none"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-navy text-white text-lg py-4 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>Send Request <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
