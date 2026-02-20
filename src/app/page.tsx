"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight, FiShoppingCart, FiStar, FiHeart, FiSearch, FiShoppingBag, FiTruck, FiShield, FiCheckCircle, FiGrid } from "react-icons/fi";
import { useStore } from "@/store/store";
import { Product } from "@/app/products/page";

interface CategoryItem {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

export default function Home() {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [bannerItems, setBannerItems] = useState<string[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { addToCart } = useStore();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setDbProducts(data.products.slice(0, 4).map((p: any) => ({
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
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION with 3D Integration */}
      <section className="relative h-[85vh] md:h-[90vh] flex items-center bg-gradient-to-br from-soft-bg via-white to-teal-50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-teal-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-navy/5 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

        <div className="container mx-auto px-4 md:px-8 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6 max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full w-max border border-teal-100 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
              <span className="text-sm font-medium text-teal-800 tracking-wide">New Premium Collection</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-navy leading-[1.1]">
              The Best Furniture <br className="hidden md:block" />
              <span className="text-gradient">in Nedumangad</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
              Elevate your living space with Nilambur Interiors. Discover Trivandrum's finest handcrafted premium furniture and expert interior design, exclusively at our Valikkode showroom.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-4 mt-4"
            >
              <Link
                href="/products"
                className="px-8 py-4 bg-navy text-white rounded-full font-medium tracking-wide hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-900/20 transition-all duration-300 flex items-center gap-3 overflow-hidden group"
              >
                <span>Shop Collection</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/interior-works"
                className="px-8 py-4 bg-white text-navy border border-gray-200 rounded-full font-medium tracking-wide hover:border-teal-600 hover:text-teal-700 transition-all duration-300"
              >
                Interior Works
              </Link>
            </motion.div>

            {/* Stats / Trust */}
            <div className="flex gap-8 mt-8 border-t border-gray-100 pt-8">
              <div>
                <h4 className="text-3xl font-serif font-bold text-teal-600">10k+</h4>
                <p className="text-sm text-gray-500 mt-1">Happy Customers</p>
              </div>
              <div className="w-px bg-gray-200"></div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-teal-600">5+</h4>
                <p className="text-sm text-gray-500 mt-1">Years Warranty</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block h-[500px] w-full relative rounded-tr-[100px] rounded-bl-[100px] overflow-hidden shadow-2xl border-4 border-white"
          >
            <Image 
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" 
              alt="Premium Furniture Setup" 
              fill 
              className="object-cover"
              priority
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent mix-blend-multiply"></div>

            {/* Floating Badge */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-1/4 right-0 glass px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-luxury-gold/20 rounded-full flex items-center justify-center text-luxury-gold">
                <FiStar size={20} className="fill-current" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Premium Quality</p>
                <p className="text-sm font-bold text-navy">100% Solid Wood</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* LATEST OFFERS BANNER */}
      {bannerItems.length > 0 && (
        <div className="bg-teal-800 text-white overflow-hidden py-3 whitespace-nowrap relative flex">
          <motion.div
            animate={{ x: [0, -1500] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
            className="flex gap-16 items-center text-sm font-medium tracking-widest uppercase"
          >
            {[...bannerItems, ...bannerItems].map((item, i) => (
              <span key={i} className="flex items-center gap-4">
                <span>{item}</span>
                {i < [...bannerItems, ...bannerItems].length - 1 && <span className="text-teal-400">•</span>}
              </span>
            ))}
          </motion.div>
        </div>
      )}

      {/* SHOP BY CATEGORY */}
      {/* SHOP BY CATEGORY — only admin-added categories */}
      <section id="categories" className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-8 sm:mb-12">
            <div>
              <span className="text-teal-600 font-semibold tracking-wider text-sm uppercase mb-2 block">Our Collections</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy">Shop by Category</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-teal-600 font-semibold hover:text-navy transition-colors text-sm">
              View All <FiArrowRight />
            </Link>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 sm:h-96 rounded-2xl bg-gray-100 animate-pulse"></div>
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
            <div className={`grid gap-6 sm:gap-8 ${
              categories.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
              categories.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto' :
              categories.length === 3 ? 'grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
              {categories.map((cat, index) => (
                <Link key={cat._id} href={`/products?category=${encodeURIComponent(cat.name)}`} className="block group">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="h-full bg-white rounded-3xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-transparent hover:border-gray-100 transition-all duration-500 flex flex-col"
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
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300 ease-out"></span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

          <Link href="/products" className="sm:hidden mt-6 flex justify-center items-center gap-2 w-full py-3 bg-gray-50 rounded-xl text-teal-600 font-semibold hover:bg-gray-100 transition-colors text-sm">
            View All Products <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 bg-soft-bg">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-teal-600 font-semibold tracking-wider text-sm uppercase mb-2 block">Best Sellers</span>
            <h2 className="text-4xl font-serif font-bold text-navy mb-4">Featured Products</h2>
            <p className="text-gray-600">Discover our most loved pieces, handpicked for exceptional design and ultimate comfort.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {dbProducts.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              <div className="relative h-72 w-full bg-gray-50 overflow-hidden">
                <Image 
                  src={product.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"}
                  alt={product.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                />
                <Link href={`/products/${product.id}`} className="absolute inset-0 z-0"><span className="sr-only">View product</span></Link>
                
                {/* Actions Overlay */}
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
          {dbProducts.length === 0 && (
            <div className="col-span-full py-12 flex justify-center">
               <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
          
          <div className="mt-16 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-semibold text-teal-700 hover:text-navy transition-colors border-b-2 border-teal-200 hover:border-navy pb-1"
            >
              View All Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
      
      {/* BRAND ETHOS / WHY CHOOSE US */}
      <section className="py-24 bg-navy text-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 border border-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 border border-teal-500/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">Crafting Comfort <br/> Since Inception</h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed">At Nilambur Interiors & Furniture, every piece is more than just wood and fabric. It's a promise of durability, a touch of elegance, and a commitment to your ultimate comfort. Our expertly crafted designs bring a premium aura to your home.</p>
            
            <ul className="mt-6 flex flex-col gap-4">
               {[
                 "Premium Quality Materials",
                 "Expert Craftsmanship",
                 "Custom Interior Designs",
                 "Dedicated Customer Support"
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-teal-600/20 flex items-center justify-center text-teal-400">
                     <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                   </div>
                   <span className="font-medium text-gray-200">{item}</span>
                 </li>
               ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] w-full rounded-2xl overflow-hidden glass-dark p-2"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" 
                alt="Interior Design" 
                fill 
                className="object-cover"
              />
            </div>
            {/* Play Button Mock */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 hover:bg-teal-600 hover:border-teal-400 transition-all duration-300 shadow-2xl pl-2">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
