"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiPackage, FiCheck, FiTruck, FiStar, FiX } from "react-icons/fi";
import Image from "next/image";

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery) return;
    
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/${orderQuery.trim()}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.order);
      } else {
        setError(data.message || "Order not found. Please check your tracking number.");
      }
    } catch (err) {
      setError("Failed to track order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (item: any) => {
    setSelectedProduct(item);
    setReviewData({ rating: 5, comment: "" });
    setReviewSuccess(false);
    setReviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!selectedProduct || !selectedProduct.product || reviewData.comment.trim() === "") return;
    
    setReviewSubmitting(true);
    try {
      const res = await fetch(`/api/products/${selectedProduct.product}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: order.customerInfo?.name || order.shippingAddress?.name || "Verified Buyer",
          rating: reviewData.rating,
          comment: reviewData.comment
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviewSuccess(true);
        setTimeout(() => setReviewModalOpen(false), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-soft-bg pt-28 pb-32">
      <div className="container mx-auto px-4 md:px-8 max-w-[1000px]">
        
        {/* Header / Search */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12 mb-8 text-center">
          <h1 className="text-4xl font-serif font-bold text-navy mb-4">Track Your Order</h1>
          <p className="text-gray-500 mb-8 max-w-xl mx-auto">Enter your Order ID (e.g. NIL-12345) below to see real-time updates on your luxury furniture delivery.</p>
          
          <form onSubmit={handleTrack} className="w-full max-w-lg mx-auto relative group">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-teal-600 w-6 h-6 z-10" />
            <input 
              type="text" 
              placeholder="e.g. NIL-54321" 
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              className="w-full pl-16 pr-36 py-5 bg-gray-50 border-2 border-gray-100 rounded-full focus:outline-none focus:ring-4 focus:ring-teal-50 focus:border-teal-500 focus:bg-white transition-all text-lg font-bold text-navy uppercase placeholder:normal-case placeholder:font-normal placeholder:text-gray-400"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-navy text-white px-8 rounded-full font-bold hover:bg-teal-700 transition-colors shadow-lg disabled:opacity-50"
            >
              {loading ? "Locating..." : "Track Order"}
            </button>
          </form>

          {error && <p className="text-red-500 font-bold mt-6">{error}</p>}
        </div>

        {/* Order Details Banner */}
        {order && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-teal-600"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-navy">Order <span className="text-teal-600">#{order.orderId || order._id.slice(-6).toUpperCase()}</span></h2>
                    <p className="text-gray-500 font-medium mt-1">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 text-center w-full md:w-auto">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Status</p>
                    <p className={`font-bold text-lg ${order.orderStatus === 'Delivered' ? 'text-green-600' : 'text-teal-600'}`}>
                      {order.orderStatus}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-3xl mx-auto mb-12 relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                  
                  {/* Dynamic progress bar fill */}
                  <div className="absolute top-1/2 left-0 h-1 bg-teal-600 -translate-y-1/2 rounded-full z-0 transition-all duration-1000" style={{ 
                    width: order.orderStatus === 'Pending' ? '0%' : 
                           order.orderStatus === 'Confirmed' ? '33%' : 
                           order.orderStatus === 'Shipped' ? '66%' : 
                           order.orderStatus === 'Delivered' ? '100%' : '0%' 
                  }}></div>

                  <div className="relative z-10 flex justify-between">
                     <div className="flex flex-col items-center gap-3">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${['Pending', 'Confirmed', 'Shipped', 'Delivered'].includes(order.orderStatus) ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-400'}`}><FiPackage size={20} /></div>
                       <span className={`text-xs font-bold uppercase tracking-wide ${['Pending', 'Confirmed', 'Shipped', 'Delivered'].includes(order.orderStatus) ? 'text-teal-700' : 'text-gray-400'}`}>Placed</span>
                     </div>
                     <div className="flex flex-col items-center gap-3">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${['Confirmed', 'Shipped', 'Delivered'].includes(order.orderStatus) ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-400'}`}><FiCheck size={20} /></div>
                       <span className={`text-xs font-bold uppercase tracking-wide ${['Confirmed', 'Shipped', 'Delivered'].includes(order.orderStatus) ? 'text-teal-700' : 'text-gray-400'}`}>Confirmed</span>
                     </div>
                     <div className="flex flex-col items-center gap-3">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${['Shipped', 'Delivered'].includes(order.orderStatus) ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-400'}`}><FiTruck size={20} /></div>
                       <span className={`text-xs font-bold uppercase tracking-wide ${['Shipped', 'Delivered'].includes(order.orderStatus) ? 'text-teal-700' : 'text-gray-400'}`}>Shipped</span>
                     </div>
                     <div className="flex flex-col items-center gap-3">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-colors ${order.orderStatus === 'Delivered' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}><FiCheck size={20} /></div>
                       <span className={`text-xs font-bold uppercase tracking-wide ${order.orderStatus === 'Delivered' ? 'text-green-600' : 'text-gray-400'}`}>Delivered</span>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Delivery Address</h3>
                    <p className="font-bold text-navy text-lg">{order.shippingAddress?.name || order.customerInfo?.name}</p>
                    <p className="text-gray-500 font-medium mt-1">{order.shippingAddress?.address || order.shippingAddress?.street}</p>
                    <p className="text-gray-500 font-medium">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode || order.shippingAddress?.zipCode}</p>
                    <p className="text-gray-500 font-medium">Phone: {order.shippingAddress?.phone || order.customerInfo?.phone}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Summary</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-gray-600 font-medium"><p>Method</p><p className="uppercase text-navy font-bold">{order.paymentMethod}</p></div>
                      <div className="flex justify-between text-gray-600 font-medium"><p>Payment Status</p><p className={`${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-500'} font-bold`}>{order.paymentStatus}</p></div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                       <p className="font-bold text-navy">Total Paid</p>
                       <p className="text-2xl font-bold text-teal-700">₹{(order.total || order.totalAmount).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </div>
            </div>

            {/* Items Included */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">
                <h3 className="text-2xl font-serif font-bold text-navy mb-8">Items in your Order</h3>
                
                <div className="space-y-6">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm border border-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                        <h4 className="font-bold text-navy text-lg line-clamp-1">{item.name}</h4>
                        <p className="text-gray-500 font-medium mt-1">Quantity: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                      </div>

                      {order.orderStatus === "Delivered" && (
                        <button 
                          onClick={() => openReviewModal(item)}
                          className="bg-white border-2 border-teal-600 text-teal-700 px-6 py-3 rounded-full font-bold shadow-sm hover:bg-teal-60 transition-colors w-full sm:w-auto"
                        >
                          Write a Review
                        </button>
                      )}
                    </div>
                  ))}
                </div>
            </div>

          </motion.div>
        )}

      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col relative"
            >
              <button 
                onClick={() => setReviewModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-navy transition-colors bg-gray-50 w-10 h-10 rounded-full flex items-center justify-center"
              >
                 <FiX size={20} />
              </button>

              <div className="p-8 md:p-10">
                <h3 className="text-2xl font-serif font-bold text-navy mb-2">Rate & Review</h3>
                <p className="text-gray-500 font-medium mb-8">Share your experience with the {selectedProduct?.name}</p>

                {reviewSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                      <FiCheck size={40} />
                    </div>
                    <h4 className="text-2xl font-bold text-navy mb-2">Review Submitted!</h4>
                    <p className="text-gray-500">Thank you for sharing your premium experience.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-navy uppercase tracking-widest block mb-4">Overall Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star}
                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <FiStar size={32} className={`${star <= reviewData.rating ? "fill-luxury-gold text-luxury-gold" : "text-gray-200"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-bold text-navy uppercase tracking-widest block mb-4">Your Experience</label>
                      <textarea 
                        value={reviewData.comment}
                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                        placeholder="What do you love about this piece? How does it look in your space?"
                        rows={4}
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all font-medium text-navy resize-none"
                      />
                    </div>

                    <button 
                      onClick={submitReview}
                      disabled={reviewSubmitting || reviewData.comment.trim() === ""}
                      className="w-full bg-navy text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-teal-700 transition-colors shadow-lg shadow-navy/20 disabled:opacity-50 mt-4"
                    >
                      {reviewSubmitting ? "Submitting..." : "Publish Review"}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
