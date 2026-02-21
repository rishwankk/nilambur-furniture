"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCheck, FiPhone, FiMail, FiMapPin, FiPlay } from "react-icons/fi";

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
  { step: "01", title: "Consultation", description: "Share your vision and requirements with our design experts.", icon: "💬" },
  { step: "02", title: "Design & Plan", description: "We create 3D renders and material specifications for your approval.", icon: "📐" },
  { step: "03", title: "Crafting", description: "Your furniture is handcrafted in our workshop using premium Nilambur teak.", icon: "🪵" },
  { step: "04", title: "Installation", description: "Professional on-site installation and finishing by our trained team.", icon: "🏠" },
];

export default function InteriorWorksPage() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 md:pb-0">
      {/* Hero */}
      <section className="relative min-h-[70vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"
          alt="Interior Works"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/80 via-navy/60 to-navy/90" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-teal-400 font-semibold tracking-widest text-[10px] sm:text-xs uppercase mb-3 sm:mb-4 bg-teal-500/10 px-4 py-2 rounded-full backdrop-blur-md border border-teal-500/20"
            >
              Custom Interior Solutions
            </motion.span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-3 sm:mb-6 leading-[1.1]">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block"
              >
                Interior Works
              </motion.span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8"
            >
              From concept to creation — we design, craft, and install bespoke interiors using premium Nilambur teak and modern materials.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            >
              <a href="#quote" className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-teal-900/30 text-sm sm:text-base flex items-center justify-center gap-2 group">
                Get Free Quote <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#services" className="bg-white/10 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 text-sm sm:text-base text-center">
                Our Services
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <RevealSection className="text-center mb-10 sm:mb-12 md:mb-16">
            <span className="text-teal-600 font-semibold tracking-wider text-xs sm:text-sm uppercase block mb-2">Why Choose Us</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-navy">Crafted With Precision</h2>
          </RevealSection>

          {/* Mobile: horizontal scroll */}
          <div className="md:hidden snap-scroll-x flex gap-4 -mx-4 px-4">
            {[
              { icon: "🪵", title: "Genuine Teak", desc: "Premium Nilambur teak with certification for every piece." },
              { icon: "📐", title: "Custom Design", desc: "Every project is uniquely designed for your space and taste." },
              { icon: "🛡️", title: "5-Year Warranty", desc: "Comprehensive warranty on all furniture and installations." },
              { icon: "🚚", title: "Free Installation", desc: "Professional installation and setup at no extra cost." },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg hover:bg-white transition-all duration-300 group min-w-[220px] shrink-0">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="font-bold text-navy text-sm mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: "🪵", title: "Genuine Teak", desc: "Premium Nilambur teak with certification for every piece." },
              { icon: "📐", title: "Custom Design", desc: "Every project is uniquely designed for your space and taste." },
              { icon: "🛡️", title: "5-Year Warranty", desc: "Comprehensive warranty on all furniture and installations." },
              { icon: "🚚", title: "Free Installation", desc: "Professional installation and setup at no extra cost." },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div className="text-center p-6 sm:p-8 bg-gray-50 rounded-2xl hover:shadow-lg hover:bg-white transition-all duration-300 group card-lift">
                  <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                  <h3 className="font-bold text-navy text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-12 sm:py-16 md:py-24 scroll-mt-20">
        <div className="container mx-auto px-4 md:px-8">
          <RevealSection className="text-center mb-10 sm:mb-12 md:mb-16">
            <span className="text-teal-600 font-semibold tracking-wider text-xs sm:text-sm uppercase block mb-2">What We Offer</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-navy">Our Interior Services</h2>
          </RevealSection>

          {/* Mobile: 1 column | Desktop: 3 column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {SERVICES.map((service, i) => (
              <RevealSection key={i} delay={i * 0.08}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-100 card-lift">
                  <div className="relative h-48 sm:h-52 md:h-64 overflow-hidden">
                    <Image src={service.image} alt={service.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-navy text-xs font-bold px-3 py-1 rounded-full">
                        {service.title}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="font-serif font-bold text-base sm:text-lg md:text-xl text-navy mb-2 group-hover:text-teal-600 transition-colors">{service.title}</h3>
                    <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process — Timeline style */}
      <section className="py-12 sm:py-16 md:py-24 bg-navy text-white relative overflow-hidden noise">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          className="absolute top-0 right-0 w-72 md:w-96 h-72 md:h-96 border border-white/5 rounded-full -translate-y-1/2 translate-x-1/2"
        />
        <div className="container mx-auto px-4 md:px-8">
          <RevealSection className="text-center mb-10 sm:mb-12 md:mb-16">
            <span className="text-teal-400 font-semibold tracking-wider text-xs sm:text-sm uppercase block mb-2">How It Works</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold">Our Process</h2>
          </RevealSection>

          {/* Mobile: Vertical timeline | Desktop: Horizontal */}
          <div className="md:hidden space-y-6">
            {PROCESS_STEPS.map((item, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-teal-600/20 rounded-2xl flex items-center justify-center text-2xl shrink-0">
                      {item.icon}
                    </div>
                    {i < PROCESS_STEPS.length - 1 && (
                      <div className="w-px h-full bg-teal-500/20 my-2" />
                    )}
                  </div>
                  <div className="pb-6">
                    <span className="text-teal-500/40 font-serif font-bold text-xl">{item.step}</span>
                    <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>

          {/* Desktop: Horizontal */}
          <div className="hidden md:grid grid-cols-4 gap-6 sm:gap-8">
            {PROCESS_STEPS.map((item, i) => (
              <RevealSection key={i} delay={i * 0.15}>
                <div className="relative text-center">
                  <div className="w-16 h-16 bg-teal-600/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="text-5xl sm:text-6xl font-serif font-bold text-teal-500/15 mb-1">{item.step}</div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2 text-teal-500/30"><FiArrowRight size={24} /></div>
                  )}
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="quote" className="py-12 sm:py-16 md:py-24 scroll-mt-20">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <RevealSection>
            <div className="bg-white rounded-3xl shadow-xl p-5 sm:p-8 lg:p-12 border border-gray-100">
              <div className="text-center mb-6 sm:mb-8 md:mb-10">
                <span className="text-teal-600 font-semibold tracking-wider text-xs sm:text-sm uppercase block mb-2">Free Consultation</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-navy mb-2">Get Your Custom Quote</h2>
                <p className="text-gray-500 text-xs sm:text-sm md:text-base">Tell us about your project and we&apos;ll get back to you within 24 hours.</p>
              </div>

              {submitted ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 md:py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, delay: 0.2 }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6"
                  >
                    <FiCheck size={36} />
                  </motion.div>
                  <h3 className="text-xl md:text-2xl font-bold text-navy mb-2">Quote Request Received!</h3>
                  <p className="text-gray-500 text-sm">Our design team will contact you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1.5 md:mb-2">Your Name *</label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm transition-all" placeholder="Full Name" />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1.5 md:mb-2">Phone Number *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm transition-all" placeholder="+91 ..." />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1.5 md:mb-2">Email Address</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm transition-all" placeholder="your@email.com" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs sm:text-sm font-semibold text-gray-700 block mb-1.5 md:mb-2">Project Details *</label>
                    <textarea required rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-sm resize-none transition-all"
                      placeholder="Describe your interior project — room type, dimensions, style preferences, budget range..." />
                  </div>
                  <div className="sm:col-span-2">
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full bg-gradient-to-r from-navy to-navy-light text-white py-4 rounded-xl font-bold text-base md:text-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiMail size={20} />}
                      {submitting ? "Sending..." : "Request Free Quote"}
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="bg-gradient-to-r from-teal-700 via-teal-600 to-teal-700 text-white py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              { icon: <FiPhone size={20} />, main: "+91 96337 72866", sub: "Call for instant consultation" },
              { icon: <FiMail size={20} />, main: "info@nilamburfurniture.com", sub: "Email us your requirements" },
              { icon: <FiMapPin size={20} />, main: "Trivandrum, Kerala", sub: "Visit our showroom" },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div className="flex flex-row sm:flex-col items-center sm:text-center gap-3 sm:gap-2 bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-white/10">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-teal-200 shrink-0 min-h-[auto]">
                    {item.icon}
                  </div>
                  <div>
                    <span className="font-semibold text-sm block">{item.main}</span>
                    <span className="text-teal-200 text-xs">{item.sub}</span>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
