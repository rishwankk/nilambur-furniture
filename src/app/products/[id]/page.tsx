"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart, FiStar, FiTruck, FiShield, FiRotateCcw, FiMinus, FiPlus, FiCheck, FiChevronRight, FiShare2 } from "react-icons/fi";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useStore } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart, toggleWishlist, wishlist } = useStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct({ ...data.product, id: data.product._id });
          try {
            const relatedRes = await fetch('/api/products');
            const relatedData = await relatedRes.json();
            if (relatedData.success) {
              const filtered = relatedData.products
                .filter((p: any) => p.category === data.product.category && p._id !== data.product._id)
                .slice(0, 4)
                .map((p: any) => ({ ...p, id: p._id, image: p.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" }));
              setRelatedProducts(filtered);
            }
          } catch (err) { console.error(err); }
        }
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm font-medium animate-pulse">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] pt-20 px-4">
        <div className="w-24 h-24 mb-6 bg-white rounded-full flex items-center justify-center text-gray-300 shadow-sm">
          <FiShoppingCart size={40} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-navy font-bold mb-4 text-center">Product Not Found</h1>
        <p className="text-gray-500 mb-8 text-center text-sm sm:text-base">This premium piece might have been removed or doesn't exist.</p>
        <Link href="/products" className="px-8 py-3 bg-teal-600 text-white rounded-full font-medium hover:bg-navy transition-colors">Return to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
      category: product.category
    }, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => router.push("/checkout"), 500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url: window.location.href }); } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-[100vh] bg-[#F8FAFC] pt-20 sm:pt-28 pb-16 sm:pb-32">
      <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs sm:text-sm text-gray-500 mb-6 sm:mb-8 font-medium overflow-x-auto whitespace-nowrap no-scrollbar">
          <Link href="/" className="hover:text-teal-600 transition-colors shrink-0">Home</Link>
          <FiChevronRight className="mx-1.5 sm:mx-2 text-gray-400 shrink-0" size={14} />
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-teal-600 transition-colors shrink-0">{product.category}</Link>
          <FiChevronRight className="mx-1.5 sm:mx-2 text-gray-400 shrink-0" size={14} />
          <span className="text-navy font-semibold truncate max-w-[150px] sm:max-w-none">{product.name}</span>
        </nav>

        <div className="bg-white rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-10 mb-10 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Image Gallery */}
            <div className="flex flex-col-reverse lg:flex-row gap-3 sm:gap-4 lg:gap-6">
              {/* Thumbnails */}
              <div className="flex lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar py-1 lg:py-0 w-full lg:w-20 xl:w-24 shrink-0">
                {product.images?.length > 0 ? product.images.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-full lg:h-20 xl:lg:h-24 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-teal-600 opacity-100 shadow-md shadow-teal-600/20' : 'border-transparent opacity-60 hover:opacity-100 bg-gray-50'}`}
                  >
                    <Image src={img} alt={`${product.name} ${idx}`} fill className="object-cover" />
                  </button>
                )) : (
                  <button className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-full lg:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-teal-600">
                    <Image src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" alt="Placeholder" fill className="object-cover" />
                  </button>
                )}
              </div>

              {/* Main Image */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex-grow bg-gray-50/50 rounded-2xl sm:rounded-3xl overflow-hidden group h-[280px] sm:h-[400px] lg:h-[550px] xl:h-[600px] flex items-center justify-center p-3 sm:p-6 lg:p-8"
              >
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold text-teal-800 shadow-sm flex items-center gap-1.5 sm:gap-2 pointer-events-none transition-opacity group-hover:opacity-0">
                  <FiStar size={12} /> Hover & Scroll to zoom
                </div>
                
                <TransformWrapper initialScale={1} minScale={1} maxScale={4} centerOnInit>
                  <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Image
                      src={product.images?.[activeImage] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80"}
                      alt={product.name}
                      fill
                      className="object-contain drop-shadow-2xl transition-transform duration-500 mix-blend-multiply"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </motion.div>
            </div>

            {/* Product Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col h-full justify-center">
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="inline-block text-[10px] sm:text-xs font-bold text-teal-700 tracking-widest uppercase bg-teal-50 hover:bg-teal-100 transition-colors w-max px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                    {product.category}
                  </Link>
                  <button onClick={handleShare} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-navy transition-colors" title="Share">
                    <FiShare2 size={16} />
                  </button>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-navy leading-[1.1] mb-4 sm:mb-6">
                  {product.name}
                </h1>
                
                {/* Rating & Stock */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100">
                  <div className="flex items-center text-luxury-gold gap-0.5 sm:gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FiStar key={s} size={14} className={s <= Math.floor(product.rating || 5) ? "fill-current" : "text-gray-200"} />
                    ))}
                    <span className="text-navy font-bold ml-1">{product.rating || "5.0"}</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block"></span>
                  <span className="text-gray-500 font-medium text-xs sm:text-sm">
                    {product.reviews || Math.floor(Math.random() * 50 + 10)} Verified Reviews
                  </span>
                  <span className={`px-2 py-1 rounded-md text-[10px] sm:text-xs font-bold ${product.stock === 0 ? 'bg-red-50 text-red-600' : product.stock < 5 ? 'bg-orange-50 text-orange-600 border border-orange-200 animate-pulse' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                    {product.stock === 0 ? 'Out of Stock' : product.stock < 5 ? 'Hurry, Only a few left!' : 'In Stock'}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-4 sm:mb-6">
                  {product.price === 0 ? (
                    <span className="text-2xl sm:text-3xl font-bold text-teal-700">Get Custom Quote</span>
                  ) : (
                    <div className="flex items-end gap-3 sm:gap-4">
                      <span className="text-3xl sm:text-4xl font-serif font-bold text-navy tracking-tight">₹{product.price.toLocaleString("en-IN")}</span>
                      <div className="flex flex-col pb-1">
                        <span className="text-gray-400 text-xs sm:text-sm line-through font-medium">₹{Math.floor(product.price * 1.25).toLocaleString("en-IN")}</span>
                        <span className="text-red-500 text-[10px] sm:text-xs font-bold tracking-wider uppercase">Save 25%</span>
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-2 font-medium bg-gray-50 inline-block px-2 py-1 rounded">Inclusive of all taxes. Free delivery applied.</p>
                </div>

                <p className="text-gray-600 leading-relaxed text-sm sm:text-base font-medium mb-6 sm:mb-8">
                  {product.description}
                </p>
              </div>

              {/* Purchase Actions */}
              <div className="bg-gray-50/80 p-4 sm:p-6 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {/* Quantity */}
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-2 h-12 sm:h-14 w-full sm:w-36 shadow-sm">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-teal-600 transition-colors w-10 h-10 flex items-center justify-center rounded-lg hover:bg-teal-50">
                      <FiMinus size={16} />
                    </button>
                    <span className="font-bold text-lg text-navy w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock} className="text-gray-400 hover:text-teal-600 transition-colors w-10 h-10 flex items-center justify-center rounded-lg hover:bg-teal-50 disabled:opacity-50">
                      <FiPlus size={16} />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex gap-2">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} disabled={product.stock === 0}
                      className={`flex-1 h-12 sm:h-14 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm text-sm sm:text-base ${isAdded ? 'bg-teal-50 text-teal-700 border-2 border-teal-500' : 'bg-white text-navy border-2 border-navy hover:bg-navy hover:text-white disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'}`}>
                      {isAdded ? <FiCheck size={18} /> : <FiShoppingCart size={18} />}
                      {isAdded ? "Added!" : "Add to Cart"}
                    </motion.button>
                    <button onClick={() => toggleWishlist(product.id)}
                      className={`h-12 sm:h-14 w-12 sm:w-14 shrink-0 rounded-xl flex items-center justify-center border-2 transition-all shadow-sm ${wishlist.includes(product.id) ? "bg-red-50 border-red-100 text-red-500" : "bg-white border-transparent text-gray-400 hover:bg-gray-100 hover:text-red-500"}`}>
                      <FiHeart size={20} className={wishlist.includes(product.id) ? "fill-current" : ""} />
                    </button>
                  </div>
                </div>
                
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleBuyNow} disabled={product.stock === 0}
                  className="w-full h-12 sm:h-14 mt-3 sm:mt-4 bg-teal-700 text-white rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-navy transition-colors shadow-lg shadow-teal-900/20 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none">
                  {product.stock === 0 ? "Currently Unavailable" : "Buy It Now"}
                </motion.button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-auto">
                <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-gray-100 rounded-xl sm:rounded-2xl">
                  <div className="text-teal-600 bg-teal-50/50 p-2 sm:p-2.5 rounded-xl"><FiTruck size={18} /></div>
                  <div>
                    <h4 className="font-bold text-[11px] sm:text-sm text-navy">Free Setup</h4>
                    <p className="text-[9px] sm:text-[11px] text-gray-500 font-medium mt-0.5 hidden sm:block">Premium Delivery</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-gray-100 rounded-xl sm:rounded-2xl">
                  <div className="text-teal-600 bg-teal-50/50 p-2 sm:p-2.5 rounded-xl"><FiShield size={18} /></div>
                  <div>
                    <h4 className="font-bold text-[11px] sm:text-sm text-navy">5 Yr Warranty</h4>
                    <p className="text-[9px] sm:text-[11px] text-gray-500 font-medium mt-0.5 hidden sm:block">Certified Wood</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white border border-gray-100 rounded-xl sm:rounded-2xl">
                  <div className="text-teal-600 bg-teal-50/50 p-2 sm:p-2.5 rounded-xl"><FiRotateCcw size={18} /></div>
                  <div>
                    <h4 className="font-bold text-[11px] sm:text-sm text-navy">Easy Returns</h4>
                    <p className="text-[9px] sm:text-[11px] text-gray-500 font-medium mt-0.5 hidden sm:block">No questions</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-24">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy">You May Also Like</h2>
                <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">More from our {product.category} collection.</p>
              </div>
              <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hidden md:flex items-center gap-2 text-teal-600 font-bold hover:text-navy transition-colors text-sm">
                View All <FiChevronRight />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-500 group border border-transparent hover:border-teal-100 flex flex-col">
                  <div className="relative h-36 sm:h-56 w-full rounded-xl overflow-hidden mb-3 sm:mb-4 bg-gray-50">
                    <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <Link href={`/products/${item.id}`} className="absolute inset-0 z-10"><span className="sr-only">View product</span></Link>
                  </div>
                  <Link href={`/products/${item.id}`} className="flex-grow flex flex-col justify-between z-20">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] sm:text-xs text-teal-600 font-bold tracking-wide uppercase px-1.5 sm:px-2 py-0.5 bg-teal-50 rounded">{item.category}</span>
                        <div className="flex items-center gap-0.5 text-luxury-gold text-[9px] sm:text-xs font-bold"><FiStar className="fill-current" size={10} /> {item.rating || "5.0"}</div>
                      </div>
                      <h3 className="font-serif font-semibold text-sm sm:text-lg text-navy mb-1 sm:mb-2 line-clamp-1 group-hover:text-teal-600 transition-colors">{item.name}</h3>
                    </div>
                    <div className="flex flex-col mt-1 sm:mt-2">
                      {item.price === 0 ? (
                        <span className="text-sm sm:text-lg font-bold text-teal-700">Get Quote</span>
                      ) : (
                        <span className="text-sm sm:text-xl font-bold text-navy">₹{item.price.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="md:hidden mt-6 sm:mt-8 flex justify-center items-center gap-2 w-full py-3 sm:py-4 bg-white rounded-xl text-teal-600 font-bold hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm text-sm">
              View All {product.category} <FiChevronRight />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
