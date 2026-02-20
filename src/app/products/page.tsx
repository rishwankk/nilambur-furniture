"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiFilter, FiHeart, FiShoppingCart, FiStar, FiX } from "react-icons/fi";
import { useStore } from "@/store/store";
import { useSearchParams } from "next/navigation";

export interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  images: string[];
  image: string;
  stock: number;
  description?: string;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<number>(500000);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const { addToCart, toggleWishlist, wishlist } = useStore();

  // Read category from URL params (after categories are loaded)
  useEffect(() => {
    const category = searchParams.get("category");
    if (category && category !== "All") {
      setActiveCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && data.categories.length > 0) {
          setCategoryNames(["All", ...data.categories.map((c: any) => c.name)]);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

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

    fetchCategories();
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let results = dbProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesPrice = Number(product.price) <= priceRange;
      return matchesSearch && matchesCategory && matchesPrice;
    });
    if (sortBy === "price-low") results.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") results.sort((a, b) => b.price - a.price);
    else if (sortBy === "rating") results.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    else if (sortBy === "newest") results.sort((a, b) => b._id.localeCompare(a._id));
    return results;
  }, [search, activeCategory, priceRange, dbProducts, sortBy]);

  const activeFilterCount = (activeCategory !== "All" ? 1 : 0) + (priceRange < 500000 ? 1 : 0) + (search ? 1 : 0);

  return (
    <div className="min-h-screen bg-soft-bg">
      {/* Header */}
      <div className="bg-navy text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80" alt="Banner" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3">
            Premium Furniture Collection
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gray-300 max-w-xl text-sm sm:text-base">
            Discover our meticulously curated selection of high-end furniture designed for your unmatched comfort.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-2 mt-6">
            {categoryNames.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === cat ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30" : "bg-white/10 text-white/80 hover:bg-white/20 backdrop-blur-sm"}`}
              >{cat}</button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-navy font-semibold rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-sm relative">
              <FiFilter size={16} /> Filters
              {activeFilterCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{activeFilterCount}</span>}
            </button>
            <div className="relative flex-1 sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search furniture..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><FiX size={14} /></button>}
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <h2 className="text-sm font-medium text-gray-500 hidden sm:block">{loading ? "Loading..." : `${filteredProducts.length} products`}</h2>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer">
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
            <div className="mb-8">
              <h3 className="font-serif font-semibold text-lg text-navy mb-4">Categories</h3>
              <ul className="space-y-1.5">
                {categoryNames.map((cat) => (
                  <li key={cat}>
                    <button onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-300 flex justify-between items-center text-sm ${activeCategory === cat ? "bg-teal-600 text-white shadow-md shadow-teal-600/30" : "text-gray-600 hover:bg-gray-50"}`}>
                      {cat}
                      <span className={`text-xs ${activeCategory === cat ? "bg-white/20" : "bg-gray-100"} px-2 py-0.5 rounded-full`}>
                        {cat === "All" ? dbProducts.length : dbProducts.filter((p) => p.category === cat).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <h3 className="font-serif font-semibold text-lg text-navy mb-4">Max Price: ₹{priceRange.toLocaleString("en-IN")}</h3>
              <input type="range" min="0" max="500000" step="5000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full appearance-none h-2 bg-gray-200 rounded-lg outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-teal-600 [&::-webkit-slider-thumb]:rounded-full cursor-pointer" />
              <div className="flex justify-between text-xs text-gray-400 mt-2"><span>₹0</span><span>₹5,00,000+</span></div>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={() => { setSearch(""); setActiveCategory("All"); setPriceRange(500000); setSortBy("default"); }}
                className="w-full py-2.5 text-sm font-semibold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">Clear All Filters</button>
            )}
          </div>
        </aside>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
              <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 p-6 overflow-y-auto shadow-2xl lg:hidden">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-serif font-bold text-navy">Filters</h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"><FiX size={20} /></button>
                </div>
                <div className="mb-8">
                  <h3 className="font-semibold text-navy mb-3">Categories</h3>
                  <ul className="space-y-1.5">
                    {categoryNames.map((cat) => (
                      <li key={cat}>
                        <button onClick={() => { setActiveCategory(cat); setIsSidebarOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm flex justify-between items-center ${activeCategory === cat ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                          {cat}
                          <span className={`text-xs ${activeCategory === cat ? "bg-white/20" : "bg-gray-100"} px-2 py-0.5 rounded-full`}>
                            {cat === "All" ? dbProducts.length : dbProducts.filter((p) => p.category === cat).length}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-8">
                  <h3 className="font-semibold text-navy mb-3">Max Price: ₹{priceRange.toLocaleString("en-IN")}</h3>
                  <input type="range" min="0" max="500000" step="5000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full appearance-none h-2 bg-gray-200 rounded-lg outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-teal-600 [&::-webkit-slider-thumb]:rounded-full cursor-pointer" />
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={() => { setSearch(""); setActiveCategory("All"); setPriceRange(500000); setSortBy("default"); setIsSidebarOpen(false); }}
                    className="w-full py-3 text-sm font-semibold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">Clear All Filters</button>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} key={product.id}
                    className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-teal-100 flex flex-col">
                    <div className="relative h-44 sm:h-56 lg:h-64 w-full rounded-xl overflow-hidden mb-3 sm:mb-4 bg-gray-50">
                      <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <button onClick={() => toggleWishlist(product.id)}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 ${wishlist.includes(product.id) ? "bg-red-50 text-red-500" : "bg-white text-navy hover:bg-teal-600 hover:text-white"}`}>
                          <FiHeart size={18} className={wishlist.includes(product.id) ? "fill-current" : ""} />
                        </button>
                        <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category })}
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-600 rounded-full flex items-center justify-center text-white hover:bg-navy transition-colors shadow-lg">
                          <FiShoppingCart size={18} />
                        </button>
                      </div>
                      {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-100 text-red-600 text-[9px] sm:text-[10px] uppercase font-bold px-2 py-1 rounded-full">Only {product.stock} Left!</div>
                      )}
                    </div>
                    <Link href={`/products/${product.id}`} className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] sm:text-xs text-teal-600 font-medium tracking-wide uppercase">{product.category}</span>
                          <div className="flex items-center gap-1 text-luxury-gold text-[10px] sm:text-xs font-semibold"><FiStar className="fill-current" /> {product.rating || "5.0"}</div>
                        </div>
                        <h3 className="font-serif font-semibold text-sm sm:text-lg text-navy mb-1 sm:mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">{product.name}</h3>
                      </div>
                      <div className="flex flex-col mt-2 sm:mt-4">
                        {product.price === 0 ? (
                          <span className="text-base sm:text-xl font-bold text-navy">Get Quote</span>
                        ) : (
                          <span className="text-base sm:text-xl font-bold text-navy">₹{product.price.toLocaleString("en-IN")}</span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredProducts.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center flex flex-col items-center">
                  <div className="w-24 h-24 mb-6 bg-gray-50 rounded-full flex items-center justify-center text-gray-300"><FiSearch size={40} /></div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-navy mb-2">No products found</h3>
                  <p className="text-gray-500 text-sm sm:text-base">Try adjusting your filters or search terms.</p>
                  <button onClick={() => { setSearch(""); setActiveCategory("All"); setPriceRange(500000); setSortBy("default"); }}
                    className="mt-6 px-6 py-2 bg-teal-50 text-teal-700 font-semibold rounded-full hover:bg-teal-100 transition-colors">Clear All Filters</button>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div></div>}>
      <ProductsContent />
    </Suspense>
  );
}
