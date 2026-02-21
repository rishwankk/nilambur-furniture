"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiAward, FiHeart, FiShield, FiUsers, FiArrowRight } from "react-icons/fi";

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

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

export default function AboutPage() {
  const values = [
    { icon: <FiAward size={24} />, title: "Premium Quality", desc: "Only the finest Nilambur teak and materials used in every piece." },
    { icon: <FiHeart size={24} />, title: "Crafted with Love", desc: "Each piece is handcrafted by master artisans with decades of experience." },
    { icon: <FiShield size={24} />, title: "5-Year Warranty", desc: "We stand behind our work with comprehensive structural warranty." },
    { icon: <FiUsers size={24} />, title: "10K+ Happy Homes", desc: "Trusted by thousands of families across Trivandrum and Kerala." },
  ];

  return (
    <div className="min-h-screen bg-soft-bg pb-20 md:pb-24">
      {/* Hero Section */}
      <section className="relative h-[40vh] sm:h-[45vh] md:h-[50vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1600&q=80"
          alt="Woodworking Craftsman"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <nav className="flex text-xs sm:text-sm text-gray-300 mb-4 md:mb-6 justify-center font-medium">
              <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-white">About Us</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-3 md:mb-4">Our Legacy of Craftsmanship</h1>
            <p className="text-gray-300 max-w-xl mx-auto text-sm md:text-base">Where tradition meets modern design</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl -mt-12 md:-mt-16 relative z-10">
        
        {/* Intro card */}
        <RevealSection>
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-xl border border-gray-100 mb-10 md:mb-16 text-center">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              At Nilambur Furniture, we don&apos;t just build furniture; we craft legacies. Rooted in the rich teak forests of Kerala, our journey spans generations of mastering the art of premium woodwork.
            </p>
          </div>
        </RevealSection>

        {/* Values Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-20">
          {values.map((item, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <div className="bg-white rounded-2xl p-5 md:p-6 text-center border border-gray-100 hover:border-teal-100 hover:shadow-lg transition-all duration-500 group h-full flex flex-col items-center card-lift">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-3 md:mb-4 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="font-bold text-navy text-sm md:text-base mb-1 md:mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-20">
          <RevealSection>
            <div className="relative h-[300px] sm:h-[350px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-lg border-4 border-gray-50 group">
              <Image
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80"
                fill
                alt="Woodworking Craftsman"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Floating badge */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg"
              >
                <p className="text-xs font-bold text-navy">Established Since</p>
                <p className="text-lg font-serif font-bold text-teal-600">2018</p>
              </motion.div>
            </div>
          </RevealSection>

          <RevealSection delay={0.2} className="space-y-4 md:space-y-6">
            <span className="text-teal-600 font-semibold tracking-wider text-xs uppercase">Our Story</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-navy">Authentic Teak, Uncompromising Quality</h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Every piece we create is a testament to the unparalleled durability and beauty of authentic Nilambur Teak. Our artisans combine traditional hand-carving techniques with modern precision engineering to ensure your furniture lasts a lifetime.
            </p>
            <ul className="space-y-3 md:space-y-4 text-gray-700 font-medium text-sm md:text-base">
              {[
                "100% Genuine Solid Wood",
                "Ethical & Sustainable Sourcing",
                "5-Year Structural Warranty",
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </RevealSection>
        </div>

        {/* CTA */}
        <RevealSection>
          <div className="text-center bg-gradient-to-br from-gray-50 to-teal-50/30 rounded-3xl p-8 md:p-12 border border-gray-200 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy mb-3 md:mb-6">Experience the Difference</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8 text-sm md:text-lg">
              Step into our world of luxury interiors. Let us help you transform your house into a bespoke home.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-700 to-teal-600 text-white font-bold py-3.5 md:py-4 px-8 md:px-10 rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300 group text-sm md:text-base"
            >
              Explore Collections <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}
