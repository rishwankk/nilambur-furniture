"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiTwitter, FiArrowRight, FiHeart } from "react-icons/fi";

function FooterSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-navy text-white pt-12 md:pt-16 pb-24 md:pb-8 border-t-4 border-teal-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Newsletter CTA - Mobile only */}
        <FooterSection>
          <div className="md:hidden bg-gradient-to-r from-teal-800 to-teal-700 rounded-2xl p-6 mb-8 text-center">
            <h3 className="font-serif font-bold text-lg mb-2">Stay Updated</h3>
            <p className="text-teal-200 text-xs mb-4">Get notified about new arrivals & exclusive offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-sm text-white placeholder-teal-300/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[auto]"
              />
              <button className="px-4 py-3 bg-white text-teal-800 rounded-xl font-bold text-sm hover:bg-teal-50 transition-colors min-h-[auto]">
                <FiArrowRight size={18} />
              </button>
            </div>
          </div>
        </FooterSection>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-12">
          {/* Brand Info */}
          <FooterSection delay={0} className="col-span-2 lg:col-span-1 md:col-span-1">
            <div>
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="bg-white rounded-2xl p-2 shrink-0 shadow-lg border-2 border-teal-600/20 overflow-hidden flex items-center justify-center w-[80px] h-[80px] md:w-[100px] md:h-[100px]">
                  <Image src="/mainlogo.png" alt="Nilambur Interiors & Furniture Logo" width={80} height={80} className="object-contain" />
                </div>
              </div>
              <p className="text-gray-400 mb-4 md:mb-6 text-xs md:text-sm leading-relaxed">
                Designed for your comfort. We are the best furniture store in Nedumangad, Trivandrum, bringing luxury and elegance to your living spaces.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: <FiInstagram size={16} />, href: "#" },
                  { icon: <FiFacebook size={16} />, href: "#" },
                  { icon: <FiTwitter size={16} />, href: "#" },
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-navy-light flex items-center justify-center text-teal-400 hover:bg-teal-600 hover:text-white transition-all duration-300 min-h-[auto]"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </FooterSection>

          {/* Quick Links */}
          <FooterSection delay={0.1}>
            <div>
              <h3 className="text-sm md:text-lg font-serif font-semibold mb-4 md:mb-6 text-white border-b border-navy-light pb-2 inline-block">Quick Links</h3>
              <ul className="flex flex-col gap-2 md:gap-3 text-xs md:text-sm text-gray-400">
                {[
                  { name: "Home", href: "/" },
                  { name: "Shop Furniture", href: "/products" },
                  { name: "About Us", href: "/about" },
                  { name: "Contact Us", href: "/contact" },
                  { name: "Track Order", href: "/track" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-teal-400 transition-colors flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FooterSection>

          {/* Customer Service */}
          <FooterSection delay={0.15}>
            <div>
              <h3 className="text-sm md:text-lg font-serif font-semibold mb-4 md:mb-6 text-white border-b border-navy-light pb-2 inline-block">Customer Care</h3>
              <ul className="flex flex-col gap-2 md:gap-3 text-xs md:text-sm text-gray-400">
                {[
                  { name: "FAQ", href: "/faq" },
                  { name: "Shipping & Returns", href: "/shipping" },
                  { name: "Terms & Conditions", href: "/terms" },
                  { name: "Privacy Policy", href: "/privacy" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-teal-400 transition-colors flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-2 h-px bg-teal-400 transition-all duration-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FooterSection>

          {/* Contact */}
          <FooterSection delay={0.2} className="col-span-2 lg:col-span-1 md:col-span-1">
            <div>
              <h3 className="text-sm md:text-lg font-serif font-semibold mb-4 md:mb-6 text-white border-b border-navy-light pb-2 inline-block">Visit Us</h3>
              <ul className="flex flex-col gap-4 md:gap-5 text-xs md:text-sm text-gray-400">
                <li className="flex items-start gap-3 md:gap-4 hover:text-white transition-colors group">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-navy-light flex-shrink-0 flex items-center justify-center group-hover:bg-teal-600 transition-colors min-h-[auto]">
                    <FiMapPin className="text-teal-400 group-hover:text-white" size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-0.5 text-xs md:text-sm">Store Location</h4>
                    <p className="leading-relaxed text-[11px] md:text-xs">Nilambur Interiors & Furniture<br />Valikkode, Nedumangad<br />Trivandrum, Kerala</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 md:gap-4 hover:text-white transition-colors group">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-navy-light flex-shrink-0 flex items-center justify-center group-hover:bg-teal-600 transition-colors min-h-[auto]">
                    <FiPhone className="text-teal-400 group-hover:text-white" size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-0.5 text-xs md:text-sm">Call Us</h4>
                    <p className="text-[11px] md:text-xs">+91 96337 72866</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 md:gap-4 hover:text-white transition-colors group">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-navy-light flex-shrink-0 flex items-center justify-center group-hover:bg-teal-600 transition-colors min-h-[auto]">
                    <FiMail className="text-teal-400 group-hover:text-white" size={14} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-0.5 text-xs md:text-sm">Email Us</h4>
                    <p className="text-[11px] md:text-xs">nilamburfurniture.tvm@gmail.com</p>
                  </div>
                </li>
              </ul>
            </div>
          </FooterSection>
        </div>

        {/* Map Embed */}
        <FooterSection delay={0.25}>
          <div className="w-full h-[150px] md:h-[200px] mb-8 rounded-xl overflow-hidden shadow-lg border border-navy-light">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d75.11337684372177!3d9.976746764305966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05b9c8c6deec9d%3A0xa8d8985afe0aa989!2sNilambur%20Interiors%20%26%20Furniture!5e0!3m2!1sen!2sin!4v1771669887098!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            />
          </div>
        </FooterSection>

        <div className="border-t border-navy-light pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-[10px] md:text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Nilambur Interiors & Furniture. All rights reserved.</p>
          <a href="https://www.linkedin.com/in/rishwank" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-teal-400 transition-colors">
            <span>Made with </span>
            <FiHeart size={10} className="text-red-400 fill-current" />
            <span> by Rishwan</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
