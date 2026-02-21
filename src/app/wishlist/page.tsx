"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiShoppingCart, FiStar, FiTrash2, FiSearch } from "react-icons/fi";
import { useStore } from "@/store/store";
import { Product } from "@/app/products/page";

function WishlistContent() {
  const { toggleWishlist, wishlist, addToCart } = useStore();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setDbProducts(data.products.map((p: any) => ({
            ...p,
            id: p._id,
            image: p.images[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"
          })));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const wishlistedProducts = useMemo(() => {
    return dbProducts.filter((product) => wishlist.includes(product.id));
  }, [dbProducts, wishlist]);

  return (
    <div className="min-h-screen bg-soft-bg pb-16 md:pb-0 pt-0">
      {/* Header Section */}
      <div className="bg-navy text-white py-12 md:py-16 relative overflow-hidden mt-[70px] md:mt-[90px]">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80" alt="Wishlist Banner" fill className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy/50" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center backdrop-blur-sm mt-3 border border-teal-500/30">
               <FiHeart className="text-teal-400 fill-current" size={20} />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mt-3">My Wishlist</h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-300 max-w-xl text-sm md:text-base">
            Your personal collection of favorite furniture pieces. Save them for later or add them to your cart.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10 md:py-16">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="h-40 sm:h-52 md:h-64 shimmer" />
                <div className="p-3 sm:p-4 space-y-2">
                  <div className="h-3 w-16 shimmer rounded" />
                  <div className="h-4 w-3/4 shimmer rounded" />
                  <div className="h-5 w-20 shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence>
              {wishlistedProducts.map((product) => (
                <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} key={product.id}
                  className="bg-white rounded-2xl p-2 sm:p-3 md:p-4 shadow-sm hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-teal-100 flex flex-col relative overflow-hidden">
                  
                  {/* Remove Button */}
                  <button onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur shadow-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <FiTrash2 size={16} />
                  </button>

                  <div className="relative h-40 sm:h-52 lg:h-60 rounded-xl overflow-hidden mb-3 md:mb-4 bg-gray-50">
                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    
                    {/* Add to Cart Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden md:block">
                       <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, category: product.category })}
                        className="w-full py-2.5 bg-teal-600/95 backdrop-blur-sm text-white rounded-xl font-semibold shadow-lg hover:bg-teal-700 flex items-center justify-center gap-2">
                        <FiShoppingCart /> Add to Cart
                       </button>
                    </div>

                    {product.stock < 5 && product.stock > 0 && (
                      <div className="absolute top-2 left-2 bg-red-100 text-red-600 text-[9px] md:text-[10px] uppercase font-bold px-2 py-1 rounded-full">Low Stock</div>
                    )}
                  </div>

                  <Link href={`/products/${product.id}`} className="flex-grow flex flex-col justify-between pt-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] md:text-xs text-teal-600 font-medium tracking-wide uppercase">{product.category}</span>
                        <div className="flex items-center gap-0.5 text-luxury-gold text-[10px] md:text-xs font-semibold"><FiStar className="fill-current" /> {product.rating || "5.0"}</div>
                      </div>
                      <h3 className="font-serif font-semibold text-xs sm:text-sm md:text-lg text-navy mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">{product.name}</h3>
                    </div>
                    <div className="flex flex-col mt-2">
                        {product.price === 0 ? (
                          <span className="text-sm sm:text-base md:text-xl font-bold text-navy">Get Quote</span>
                        ) : (
                          <span className="text-sm sm:text-base md:text-xl font-bold text-navy">₹{product.price.toLocaleString("en-IN")}</span>
                        )}
                    </div>
                  </Link>

                  {/* Mobile Add to Cart Button */}
                  <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image, category: product.category })}
                    className="mt-3 w-full py-2 bg-teal-50 text-teal-700 rounded-xl font-semibold active:bg-teal-100 flex items-center justify-center gap-2 md:hidden text-sm">
                    <FiShoppingCart size={14} /> Add to Cart
                  </button>

                </motion.div>
              ))}
            </AnimatePresence>

            {wishlistedProducts.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 md:py-32 text-center flex flex-col items-center">
                <div className="w-24 h-24 mb-6 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <FiHeart size={40} />
                </div>
                <h3 className="text-xl md:text-3xl font-serif font-bold text-navy mb-3">Your wishlist is empty</h3>
                <p className="text-gray-500 text-sm md:text-base mb-8 max-w-sm text-center mx-auto">
                  Save your favorite items here so you don't lose track of them.
                </p>
                <Link href="/products" className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/30">
                  Explore Products
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" /></div>}>
      <WishlistContent />
    </Suspense>
  );
}
