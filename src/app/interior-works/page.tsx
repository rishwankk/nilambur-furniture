"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCheck, FiPhone, FiMail, FiMapPin } from "react-icons/fi";

const SERVICES = [
  {
    title: "Living Room Interiors",
    description: "Transform your living space with custom sofas, TV units, accent walls, and lighting solutions designed specifically for your home.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
  {
    title: "Kitchen Design",
    description: "Modular kitchens crafted with premium materials. From cabinets to countertops, we build to your exact specifications.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  },
  {
    title: "Bedroom Makeovers",
    description: "Custom wardrobes, headboards, bedside tables, and complete bedroom transformations with luxury finishes.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
  },
  {
    title: "Dining Spaces",
    description: "Bespoke dining tables, storage units, and crockery cabinets in solid teak and modern materials.",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80",
  },
  {
    title: "Office & Workspace",
    description: "Functional and elegant office desks, bookshelves, and cabin partitions for your home or commercial office.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    title: "Pooja Room & Custom",
    description: "Handcrafted pooja mandir units, shoe racks, display shelves, and any custom furniture you can envision.",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "Consultation", description: "Share your vision and requirements with our design experts." },
  { step: "02", title: "Design & Plan", description: "We create 3D renders and material specifications for your approval." },
  { step: "03", title: "Crafting", description: "Your furniture is handcrafted in our workshop using premium Nilambur teak." },
  { step: "04", title: "Installation", description: "Professional on-site installation and finishing by our trained team." },
];

export default function InteriorWorksPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"
          alt="Interior Works"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block text-teal-400 font-semibold tracking-widest text-xs sm:text-sm uppercase mb-3 sm:mb-4 bg-teal-500/10 px-4 py-2 rounded-full backdrop-blur-md border border-teal-500/20">
              Custom Interior Solutions
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-[1.1]">
              Interior Works
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8">
              From concept to creation — we design, craft, and install bespoke interiors using premium Nilambur teak and modern materials.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a href="#quote" className="bg-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-900/30 text-sm sm:text-base flex items-center justify-center gap-2">
                Get Free Quote <FiArrowRight />
              </a>
              <a href="#services" className="bg-white/10 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-white/20 transition-colors backdrop-blur-md border border-white/20 text-sm sm:text-base">
                Our Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-teal-600 font-semibold tracking-wider text-sm uppercase block mb-2">Why Choose Us</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy">Crafted With Precision</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: "🪵", title: "Genuine Teak", desc: "Premium Nilambur teak with certification for every piece." },
              { icon: "📐", title: "Custom Design", desc: "Every project is uniquely designed for your space and taste." },
              { icon: "🛡️", title: "5-Year Warranty", desc: "Comprehensive warranty on all furniture and installations." },
              { icon: "🚚", title: "Free Installation", desc: "Professional installation and setup at no extra cost." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 sm:p-8 bg-gray-50 rounded-2xl hover:shadow-lg hover:bg-white transition-all duration-300 group"
              >
                <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="font-bold text-navy text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 sm:py-24 scroll-mt-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-teal-600 font-semibold tracking-wider text-sm uppercase block mb-2">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy">Our Interior Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SERVICES.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-100"
              >
                <div className="relative h-52 sm:h-64 overflow-hidden">
                  <Image src={service.image} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-navy mb-2 group-hover:text-teal-600 transition-colors">{service.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-24 bg-navy text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-teal-400 font-semibold tracking-wider text-sm uppercase block mb-2">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold">Our Process</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {PROCESS_STEPS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-6xl sm:text-7xl font-serif font-bold text-teal-500/20 mb-2">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2 text-teal-500/30"><FiArrowRight size={24} /></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="quote" className="py-16 sm:py-24 scroll-mt-20">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 lg:p-12 border border-gray-100">
            <div className="text-center mb-8 sm:mb-10">
              <span className="text-teal-600 font-semibold tracking-wider text-sm uppercase block mb-2">Free Consultation</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy mb-2">Get Your Custom Quote</h2>
              <p className="text-gray-500 text-sm sm:text-base">Tell us about your project and we'll get back to you within 24 hours.</p>
            </div>

            {submitted ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                  <FiCheck size={40} />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-2">Quote Request Received!</h3>
                <p className="text-gray-500">Our design team will contact you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Your Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" placeholder="Full Name" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Phone Number *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" placeholder="+91 ..." />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm" placeholder="your@email.com" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Project Details *</label>
                  <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                    placeholder="Describe your interior project — room type, dimensions, style preferences, budget range..." />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={submitting}
                    className="w-full bg-navy text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-colors shadow-xl shadow-navy/20 disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiMail size={20} />}
                    {submitting ? "Sending..." : "Request Free Quote"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="bg-teal-700 text-white py-10 sm:py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <FiPhone size={24} className="text-teal-200" />
              <span className="font-semibold">+91 98765 43210</span>
              <span className="text-teal-200 text-xs">Call for instant consultation</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FiMail size={24} className="text-teal-200" />
              <span className="font-semibold">info@nilamburfurniture.com</span>
              <span className="text-teal-200 text-xs">Email us your requirements</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FiMapPin size={24} className="text-teal-200" />
              <span className="font-semibold">Trivandrum, Kerala</span>
              <span className="text-teal-200 text-xs">Visit our showroom</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
