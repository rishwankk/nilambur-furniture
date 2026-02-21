"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiMessageCircle } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
    <div className="min-h-screen bg-soft-bg pb-20 md:pb-24">
      {/* Hero */}
      <section className="relative h-[35vh] sm:h-[40vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"
          alt="Contact Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <nav className="flex text-xs sm:text-sm text-gray-300 mb-3 md:mb-4 justify-center font-medium">
              <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Contact Us</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-2 md:mb-3">Get in Touch</h1>
            <p className="text-gray-300 max-w-xl mx-auto text-xs sm:text-sm md:text-base">
              We&apos;d love to hear from you. Our dedicated team is ready to help.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl -mt-8 md:-mt-12 relative z-10">
        
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
          {[
            { icon: <FiPhone size={20} />, title: "Call Us", info: "+91 96337 72866", subtext: "Mon-Sat, 9AM-6PM", href: "tel:+919633772866", color: "from-teal-500 to-teal-600" },
            { icon: <FiMail size={20} />, title: "Email Us", info: "nilamburfurniture.tvm@gmail.com", subtext: "24/7 support", href: "mailto:nilamburfurniture.tvm@gmail.com", color: "from-blue-500 to-blue-600" },
            { icon: <FiMessageCircle size={20} />, title: "WhatsApp", info: "Quick Chat", subtext: "Instant reply", href: "https://wa.me/919633772866", color: "from-green-500 to-green-600" },
          ].map((item, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <a href={item.href} target="_blank" rel="noreferrer" className="block">
                <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-4 group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-sm md:text-base">{item.title}</h3>
                    <p className="text-teal-600 font-semibold text-xs md:text-sm">{item.info}</p>
                    <p className="text-gray-400 text-[10px] md:text-xs">{item.subtext}</p>
                  </div>
                </div>
              </a>
            </RevealSection>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          
          {/* Contact Details */}
          <RevealSection className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 h-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-navy mb-2">Reach Out Directly</h2>
              <p className="text-gray-500 mb-6 md:mb-8 text-xs md:text-sm">We value your inquiries and aim to provide prompt, personalized responses.</p>
              
              <div className="space-y-5 md:space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-teal-100 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                    <FiMapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-navy mb-0.5">Head Office</h3>
                    <p className="text-gray-600 leading-relaxed text-xs md:text-sm">near Reliance Petrol Pump, Valikode, Nedumangad, <br/>Kerala 695541</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-teal-100 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                    <FiClock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-navy mb-0.5">Working Hours</h3>
                    <p className="text-gray-600 text-xs md:text-sm">Mon - Sat: 9:00 AM - 8:00 PM<br/>Sunday: Closed</p>
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 md:mt-8 pt-6 border-t border-gray-100">
                <a
                  href="https://wa.me/919633772866"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-6 md:px-8 rounded-full shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 text-sm"
                >
                  <FiMessageCircle size={18} />
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </RevealSection>

          {/* Contact Form */}
          <RevealSection delay={0.2} className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              {success ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col justify-center items-center text-center space-y-4 py-12 md:py-16">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, delay: 0.2 }}
                    className="w-16 h-16 md:w-20 md:h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2"
                  >
                    <FiSend size={28} />
                  </motion.div>
                  <h2 className="text-xl md:text-2xl font-bold text-navy font-serif">Message Sent Successfully!</h2>
                  <p className="text-gray-500 text-sm max-w-sm">Thank you for contacting Nilambur Furniture. Our experts will get back to you within 24 working hours.</p>
                  <button onClick={() => setSuccess(false)} className="mt-4 border-b-2 border-teal-600 text-teal-700 font-bold hover:text-navy transition-colors pb-1 text-sm">Send Another Message</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  <h3 className="text-xl md:text-2xl font-bold text-navy font-serif border-b border-gray-100 pb-4 mb-2">Drop a Quick Message</h3>
                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-1.5 md:mb-2">Your Full Name</label>
                    <input required placeholder="E.g., Manoj Kumar" type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm shadow-sm" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                    <div>
                      <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-1.5 md:mb-2">Email Address</label>
                      <input required placeholder="E.g., hello@mail.com" type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm shadow-sm" />
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-1.5 md:mb-2">Phone Number</label>
                      <input placeholder="(Optional)" type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-1.5 md:mb-2">Inquiry Type</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm shadow-sm">
                      <option>Product Inquiry</option>
                      <option>Custom Interior Design</option>
                      <option>Bulk Order/B2B</option>
                      <option>Order Tracking</option>
                      <option>Warranty & Support</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-1.5 md:mb-2">Your Message</label>
                    <textarea required placeholder="How can we help you craft your dream space?" rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm shadow-sm resize-none" />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full bg-gradient-to-r from-navy to-navy-light text-white text-base md:text-lg py-4 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>Send Request <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </RevealSection>
        </div>
      </div>
    </div>
  );
}
