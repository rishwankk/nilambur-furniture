"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiShoppingCart, FiStar, FiHeart, FiSearch, FiShoppingBag, FiTruck, FiShield, FiCheckCircle, FiGrid, FiAward, FiClock, FiSmile } from "react-icons/fi";
import { useStore } from "@/store/store";
import { Product } from "@/app/products/page";

interface CategoryItem {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

/* Animated Counter */
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current = Math.floor(eased * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

/* Parallax Image Component */
function ParallaxImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="relative w-full h-[120%] -mt-[10%]">
        <Image src={src} alt={alt} fill className="object-cover" />
      </motion.div>
    </div>
  );
}

/* Section wrapper with scroll reveal */
function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [bannerItems, setBannerItems] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { addToCart } = useStore();

  // Parallax for hero
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setDbProducts(data.products.filter((p: any) => p.stock > 0).slice(0, 4).map((p: any) => ({
             ...p,
             id: p._id,
             image: p.images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"
          })));
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCoupons = async () => {
      try {
        const res = await fetch("/api/coupons");
        const data = await res.json();
        const items: string[] = [];
        if (data.success && data.coupons?.length > 0) {
          data.coupons.forEach((c: any) => {
            items.push(`✨ USE CODE: ${c.code} — ${c.discountPercentage}% OFF`);
          });
        }
        items.push("🚚 FREE DELIVERY IN TRIVANDRUM");
        items.push("🛋️ CUSTOM INTERIOR WORKS AVAILABLE");
        items.push("🪵 PREMIUM NILAMBUR TEAK FURNITURE");
        setBannerItems(items);
      } catch {
        setBannerItems([
          "🚚 FREE DELIVERY IN TRIVANDRUM",
          "🛋️ CUSTOM INTERIOR WORKS AVAILABLE",
          "🪵 PREMIUM NILAMBUR TEAK FURNITURE",
        ]);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchFeatured();
    fetchCoupons();
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      {/* HERO SECTION with Parallax */}
      <section ref={heroRef} className="relative min-h-[100svh] md:h-[90vh] flex items-center bg-gradient-to-br from-soft-bg via-white to-teal-50 overflow-hidden">
        {/* Animated decorative blobs */}
        <motion.div
          style={{ y: heroY }}
          className="absolute top-0 right-0 w-[60vw] h-[60vw] md:w-[50vw] md:h-[50vw] bg-gradient-to-br from-teal-100 to-teal-50 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2 pointer-events-none"
        />
        <div className="absolute bottom-10 left-0 w-[40vw] h-[40vw] bg-navy/5 blob opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[20vw] h-[20vw] bg-luxury-gold/5 rounded-full blur-2xl pointer-events-none float-delayed" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="container mx-auto px-4 md:px-8 z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-20 md:pt-0"
        >
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-4 md:gap-6 max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full w-max border border-teal-100 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span className="text-xs md:text-sm font-medium text-teal-800 tracking-wide">New Premium Collection</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-navy leading-[1.05]">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="block"
              >
                The Best Furniture
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-gradient block"
              >
                in Nedumangad
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-base md:text-lg lg:text-xl text-gray-600 font-light leading-relaxed"
            >
              Elevate your living space with Nilambur Interiors. Discover Trivandrum&apos;s finest handcrafted premium furniture and expert interior design.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-2 md:mt-4"
            >
              <Link
                href="/products"
                className="px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-navy to-navy-light text-white rounded-full font-medium tracking-wide hover:shadow-lg hover:shadow-navy/20 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <span>Shop Collection</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/interior-works"
                className="px-6 md:px-8 py-3.5 md:py-4 bg-white text-navy border border-gray-200 rounded-full font-medium tracking-wide hover:border-teal-600 hover:text-teal-700 transition-all duration-300 text-center shadow-sm"
              >
                Interior Works
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-6 md:gap-8 mt-4 md:mt-8 border-t border-gray-100 pt-6 md:pt-8"
            >
              <div className="text-center sm:text-left">
                <h4 className="text-2xl md:text-3xl font-serif font-bold text-teal-600">
                  <AnimatedCounter target={10} suffix="k+" />
                </h4>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Happy Customers</p>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center sm:text-left">
                <h4 className="text-2xl md:text-3xl font-serif font-bold text-teal-600">
                  <AnimatedCounter target={5} suffix="+" />
                </h4>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Years Warranty</p>
              </div>
              <div className="w-px bg-gray-200 hidden sm:block" />
              <div className="hidden sm:block text-center sm:text-left">
                <h4 className="text-2xl md:text-3xl font-serif font-bold text-teal-600">
                  <AnimatedCounter target={500} suffix="+" />
                </h4>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Products</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Image  */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[45vh] sm:h-[50vh] lg:h-[500px] w-full rounded-3xl lg:rounded-tr-[100px] lg:rounded-bl-[100px] overflow-hidden shadow-2xl border-4 border-white"
          >
            <Image 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" 
              alt="Premium Furniture Setup" 
              fill 
              className="object-cover"
              priority
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent mix-blend-multiply" />

            {/* Floating Badges */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-1/4 right-2 sm:right-4 glass px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-xl flex items-center gap-2 sm:gap-3 max-w-[180px]"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-luxury-gold/20 rounded-full flex items-center justify-center text-luxury-gold shrink-0">
                <FiStar size={16} className="fill-current" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Premium Quality</p>
                <p className="text-xs sm:text-sm font-bold text-navy">100% Solid Wood</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute bottom-8 left-2 sm:left-4 glass px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-xl flex items-center gap-2 sm:gap-3 max-w-[180px]"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-600/20 rounded-full flex items-center justify-center text-teal-600 shrink-0">
                <FiTruck size={16} />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Free Delivery</p>
                <p className="text-xs sm:text-sm font-bold text-navy">In Trivandrum</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border-2 border-gray-300 flex justify-center pt-1.5"
          >
            <div className="w-1 h-2 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE OFFERS BANNER */}
      {bannerItems.length > 0 && (
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 text-white overflow-hidden py-3 relative noise">
          <div className="marquee-track">
            {[...bannerItems, ...bannerItems, ...bannerItems, ...bannerItems].map((item, i) => (
              <span key={i} className="flex items-center gap-6 mx-8 whitespace-nowrap text-sm font-medium tracking-widest uppercase">
                <span>{item}</span>
                <span className="text-teal-400">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* TRUST BADGES — Horizontal scroll on mobile */}
      <section className="py-8 md:py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex md:grid md:grid-cols-4 gap-4 snap-scroll-x md:overflow-visible">
            {[
              { icon: <FiTruck size={22} />, title: "Free Delivery", desc: "Across Trivandrum" },
              { icon: <FiShield size={22} />, title: "5-Year Warranty", desc: "On all products" },
              { icon: <FiAward size={22} />, title: "Premium Quality", desc: "100% genuine wood" },
              { icon: <FiSmile size={22} />, title: "10K+ Customers", desc: "And counting" },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <div className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-gray-50 rounded-2xl hover:bg-teal-50 transition-colors duration-300 group min-w-[260px] md:min-w-0">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-teal-600 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY CATEGORY */}
      <section id="categories" className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <RevealSection>
            <div className="flex justify-between items-end mb-8 sm:mb-12">
              <div>
                <span className="text-teal-600 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">Our Collections</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-navy">Shop by Category</h2>
              </div>
              <Link href="/products" className="hidden sm:flex items-center gap-2 text-teal-600 font-semibold hover:text-navy transition-colors text-sm group">
                View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </RevealSection>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-56 sm:h-64 md:h-96 rounded-2xl shimmer" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                <FiGrid size={28} />
              </div>
              <p className="text-gray-500 font-medium">Categories coming soon!</p>
              <Link href="/products" className="inline-block mt-4 text-teal-600 font-semibold hover:underline">Browse All Products</Link>
            </div>
          ) : (
            <>
              {/* Mobile: Horizontal scroll */}
              <div className="md:hidden snap-scroll-x flex gap-4 -mx-4 px-4">
                {categories.map((cat, index) => (
                  <Link key={cat._id} href={`/products?category=${encodeURIComponent(cat.name)}`} className="block group shrink-0 w-[75vw] max-w-[300px]">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-500 flex flex-col"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100 rounded-t-3xl">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-teal-50 flex items-center justify-center text-teal-200">
                            <FiGrid size={48} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                      <div className="p-5 flex flex-col flex-1 items-center text-center">
                        <h3 className="text-lg font-serif font-bold text-navy mb-2 group-hover:text-teal-700 transition-colors">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{cat.description}</p>
                        )}
                        <div className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider">
                          Shop Collection <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Desktop: Grid */}
              <div className={`hidden md:grid gap-6 sm:gap-8 ${
                categories.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
                categories.length === 2 ? 'grid-cols-2 max-w-3xl mx-auto' :
                categories.length === 3 ? 'grid-cols-3 max-w-5xl mx-auto' :
                'grid-cols-2 lg:grid-cols-4'
              }`}>
                {categories.map((cat, index) => (
                  <Link key={cat._id} href={`/products?category=${encodeURIComponent(cat.name)}`} className="block group">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="h-full bg-white rounded-3xl overflow-hidden card-lift border border-transparent hover:border-gray-100 flex flex-col"
                    >
                      <div className="relative h-56 sm:h-64 overflow-hidden bg-gray-100 rounded-t-3xl">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-teal-50 flex items-center justify-center text-teal-200">
                            <FiGrid size={48} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <div className="p-6 sm:p-8 flex flex-col flex-1 items-center text-center bg-gray-50/50 group-hover:bg-white transition-colors duration-500">
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy mb-3 group-hover:text-teal-700 transition-colors">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-gray-500 text-sm line-clamp-2 mb-5 max-w-xs">{cat.description}</p>
                        )}
                        <div className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-teal-600 uppercase tracking-wider relative">
                          Shop Collection <FiArrowRight className="group-hover:translate-x-1.5 transition-transform duration-300" />
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300 ease-out" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <Link href="/products" className="sm:hidden mt-6 flex justify-center items-center gap-2 w-full py-3 bg-gray-50 rounded-xl text-teal-600 font-semibold hover:bg-gray-100 transition-colors text-sm">
            View All Products <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-12 sm:py-16 md:py-24 bg-soft-bg">
        <div className="container mx-auto px-4 md:px-8">
          <RevealSection>
            <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
              <span className="text-teal-600 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">Best Sellers</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-navy mb-3 md:mb-4">Featured Products</h2>
              <p className="text-gray-600 text-sm md:text-base">Discover our most loved pieces, handpicked for exceptional design and ultimate comfort.</p>
            </div>
          </RevealSection>

          {/* Mobile: Horizontal scroll | Desktop: Grid */}
          <div className="md:hidden snap-scroll-x flex gap-4 -mx-4 px-4">
            {dbProducts.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 shrink-0 w-[72vw] max-w-[280px]"
              >
                <div className="relative h-56 w-full bg-gray-50 overflow-hidden">
                  <Image 
                    src={product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"}
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  <Link href={`/products/${product.id}`} className="absolute inset-0 z-0"><span className="sr-only">View product</span></Link>
                  
                  {/* Quick Actions */}
                  <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-3">
                    <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-navy shadow-lg active:scale-95 transition-transform">
                      <FiHeart size={18} />
                    </button>
                    <button
                      onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80", category: product.category })}
                      className="w-10 h-10 bg-navy/90 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform z-20"
                    >
                      <FiShoppingBag size={18} />
                    </button>
                  </div>
                </div>
                <Link href={`/products/${product.id}`} className="block p-4">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-[10px] text-teal-600 font-medium tracking-wide border border-teal-100 bg-teal-50 px-2 py-0.5 rounded-full">{product.category}</span>
                    <div className="flex items-center gap-1 text-luxury-gold text-[10px] font-semibold">
                      <FiStar className="fill-current" /> {product.rating || 5.0}
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-navy mb-2 line-clamp-1">{product.name}</h3>
                  <span className="text-lg font-bold text-navy">₹{product.price.toLocaleString("en-IN")}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
            {dbProducts.map((product, i) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm card-lift border border-gray-100"
              >
                <div className="relative h-72 w-full bg-gray-50 overflow-hidden">
                  <Image 
                    src={product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"}
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  <Link href={`/products/${product.id}`} className="absolute inset-0 z-0"><span className="sr-only">View product</span></Link>
                  
                  <div className={`absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-4 transition-all duration-300 ${hoveredProduct === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy hover:bg-teal-600 hover:text-white transition-colors shadow-lg">
                      <FiHeart size={20} />
                    </button>
                    <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80", category: product.category })} className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white hover:bg-teal-600 transition-colors shadow-lg z-20">
                      <FiShoppingBag size={20} />
                    </button>
                    <Link href={`/products/${product.id}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-navy hover:bg-teal-600 hover:text-white transition-colors shadow-lg z-20">
                      <FiSearch size={20} />
                    </Link>
                  </div>
                </div>
                <Link href={`/products/${product.id}`} className="block p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-teal-600 font-medium tracking-wide border border-teal-100 bg-teal-50 px-2 py-1 rounded-full">{product.category}</span>
                    <div className="flex items-center gap-1 text-luxury-gold text-xs font-semibold">
                      <FiStar className="fill-current" /> {product.rating || 5.0}
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-navy mb-3 line-clamp-1">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-navy">₹{product.price.toLocaleString("en-IN")}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {dbProducts.length === 0 && (
            <div className="py-12 flex justify-center">
               <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
            </div>
          )}
            
          <RevealSection className="mt-10 md:mt-16 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-semibold text-teal-700 hover:text-navy transition-colors border-b-2 border-teal-200 hover:border-navy pb-1 group"
            >
              View All Products <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </RevealSection>
        </div>
      </section>
      
      {/* BRAND ETHOS / WHY CHOOSE US */}
      <section className="py-16 md:py-24 bg-navy text-white relative overflow-hidden noise">
        {/* Animated shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          className="absolute top-0 right-0 w-72 md:w-96 h-72 md:h-96 border border-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
          className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 border border-teal-500/20 rounded-full translate-y-1/2 -translate-x-1/2"
        />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <RevealSection className="flex flex-col gap-4 md:gap-6 order-2 md:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-tight">Crafting Comfort <br/>Since Inception</h2>
            <p className="text-gray-400 text-base md:text-lg font-light leading-relaxed">At Nilambur Interiors & Furniture, every piece is more than just wood and fabric. It&apos;s a promise of durability, a touch of elegance, and a commitment to your ultimate comfort.</p>
            
            <ul className="mt-4 md:mt-6 flex flex-col gap-3 md:gap-4">
               {[
                 "Premium Quality Materials",
                 "Expert Craftsmanship",
                 "Custom Interior Designs",
                 "Dedicated Customer Support"
               ].map((item, i) => (
                 <motion.li
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.1 }}
                   className="flex items-center gap-3"
                 >
                   <div className="w-6 h-6 rounded-full bg-teal-600/20 flex items-center justify-center text-teal-400 shrink-0">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <span className="font-medium text-gray-200 text-sm md:text-base">{item}</span>
                 </motion.li>
               ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-6"
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-colors border border-white/20 text-sm group"
              >
                Learn More <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </RevealSection>
          
          <RevealSection delay={0.2} className="relative h-[350px] sm:h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden glass-dark p-1.5 md:p-2 order-1 md:order-2">
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"
                alt="Interior Design"
                className="w-full h-full"
              />
            </div>
            {/* Play Button Mock */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 md:w-20 md:h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 hover:bg-teal-600 hover:border-teal-400 transition-all duration-300 shadow-2xl pl-1 md:pl-2"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </motion.button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* TESTIMONIALS / SOCIAL PROOF */}
      <section className="py-12 sm:py-16 md:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <RevealSection className="text-center mb-10 md:mb-16">
            <span className="text-teal-600 font-semibold tracking-wider text-xs sm:text-sm uppercase mb-2 block">Testimonials</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-navy mb-3">What Our Customers Say</h2>
          </RevealSection>

          <div className="snap-scroll-x md:overflow-visible flex md:grid md:grid-cols-3 gap-6 -mx-4 px-4 md:mx-0 md:px-0">
            {[
              {
                name: "Arun Krishnan",
                feedback: "Absolutely stunning furniture! The quality of the teak wood is outstanding. Best purchase we've ever made for our home.",
                rating: 5,
                location: "Trivandrum",
              },
              {
                name: "Priya Nair",
                feedback: "The interior design team transformed our living room completely. Professional service and premium materials. Highly recommend!",
                rating: 5,
                location: "Nedumangad",
              },
              {
                name: "Rajesh Menon",
                feedback: "From browsing to delivery, the experience was smooth. The dining table set we bought is the centerpiece of our home now.",
                rating: 5,
                location: "Thiruvananthapuram",
              },
            ].map((review, i) => (
              <RevealSection key={i} delay={i * 0.15}>
                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 hover:bg-white hover:shadow-xl transition-all duration-500 border border-transparent hover:border-gray-100 min-w-[280px] md:min-w-0 shrink-0 flex flex-col h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <FiStar key={j} size={14} className="text-luxury-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">&quot;{review.feedback}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy text-sm">{review.name}</h4>
                      <p className="text-xs text-gray-400">{review.location}</p>
                    </div>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-teal-700 via-teal-800 to-navy relative overflow-hidden noise">
        <div className="absolute inset-0 opacity-10">
          <Image src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=50" alt="" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <RevealSection>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 md:mb-6">
              Ready to Transform <br className="hidden sm:block" /> Your Space?
            </h2>
            <p className="text-teal-100 text-sm md:text-lg max-w-2xl mx-auto mb-6 md:mb-10">
              Visit our showroom at Valikkode, Nedumangad for a personalized consultation with our expert designers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/products"
                className="px-8 py-4 bg-white text-navy rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm md:text-base"
              >
                Browse Collection
              </Link>
              <Link
                href="/interior-works"
                className="px-8 py-4 bg-transparent text-white border-2 border-white/40 rounded-full font-bold hover:bg-white/10 transition-all duration-300 text-sm md:text-base"
              >
                Get Free Quote
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
