"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/store";
import { FiCheckCircle, FiPackage, FiCreditCard, FiMessageCircle, FiLock, FiTag, FiX, FiLoader, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const [formData, setFormData] = useState({
    email: "", name: "", phone: "", address: "", city: "", postalCode: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; percentage: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim().toUpperCase(), cartTotal: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({ code: data.code, discount: data.discount, percentage: data.discountPercentage });
        setCouponError("");
      } else {
        setCouponError(data.message || "Invalid coupon");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!formData.email || !formData.name || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      alert("Please fill in all required fields.");
      return;
    }

    const newOrderId = `NIL-${Math.floor(Math.random() * 90000) + 10000}`;
    setOrderId(newOrderId);

    const saveOrderToDB = async (paymentStatus: string, rzpDetails?: any) => {
      const orderPayload = {
        orderId: newOrderId,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        items: cart,
        subtotal: subtotal,
        total: total,
        discountAmount: discount,
        couponCode: appliedCoupon?.code || undefined,
        paymentMethod: paymentMethod === "razorpay" ? "Razorpay" : paymentMethod === "cod" ? "COD" : "WhatsApp",
        paymentStatus,
        razorpayOrderId: rzpDetails?.razorpay_order_id,
        razorpayPaymentId: rzpDetails?.razorpay_payment_id,
      };

      try {
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
      } catch (error) {
        console.error("Failed to save order", error);
      }
    };

    if (paymentMethod === "razorpay") {
      setIsProcessing(true);
      const res = await loadRazorpay();
      if (!res) {
        alert("Razorpay SDK failed to load. Please check your connection.");
        setIsProcessing(false);
        return;
      }

      try {
        // 1. Create order on your backend
        const orderResponse = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        });
        const orderData = await orderResponse.json();

        if (orderData.error) {
          alert("Could not create Razorpay order.");
          setIsProcessing(false);
          return;
        }

        // 2. Open Razorpay Widget
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Nilambur Interiors & Furniture",
          description: `Order ${newOrderId}`,
          order_id: orderData.id,
          handler: async function (response: any) {
             // 3. Verify payment signature
             setIsProcessing(true);
             const verifyRes = await fetch("/api/razorpay/verify", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(response),
             });
             const verifyData = await verifyRes.json();
             
             if (verifyData.success) {
               await saveOrderToDB("Paid", response);
               setIsProcessing(false);
               setIsSuccess(true);
               clearCart();
             } else {
               alert("Payment verification failed. Please contact support.");
               await saveOrderToDB("Failed", response);
               setIsProcessing(false);
             }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#0f766e" },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const paymentObject = new (window as any).Razorpay(options);
        paymentObject.open();

      } catch (err) {
        console.error(err);
        alert("An error occurred starting payment.");
        setIsProcessing(false);
      }
      return;
    }

    // COD & WhatsApp Flow
    setIsProcessing(true);
    await saveOrderToDB("Pending");
    setIsProcessing(false);

    if (paymentMethod === "whatsapp") {
      let message = `*New Order: ${newOrderId}*\n\n`;
      message += `*Customer:*\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${formData.address}, ${formData.city} - ${formData.postalCode}\n\n`;
      message += `*Items:*\n`;
      cart.forEach((item) => {
        message += `- ${item.name} x${item.quantity} (₹${item.price.toLocaleString("en-IN")})\n`;
      });
      if (appliedCoupon) message += `\n*Coupon:* ${appliedCoupon.code} (-₹${discount.toLocaleString("en-IN")})\n`;
      message += `\n*Total:* ₹${total.toLocaleString("en-IN")}`;
      
      window.open(`https://wa.me/919633772866?text=${encodeURIComponent(message)}`, "_blank");
      setIsSuccess(true);
      clearCart();
      return;
    }

    // COD Flow
    setIsSuccess(true);
    clearCart();
  };

  // === SUCCESS SCREEN ===
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-20 sm:pt-24 pb-16 sm:pb-24 flex items-center justify-center px-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 sm:p-12 md:p-16 rounded-3xl shadow-lg text-center max-w-lg w-full border border-gray-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={44} className="text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy mb-3 sm:mb-4">Order Confirmed!</h1>
          <p className="text-gray-500 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
            {paymentMethod === "whatsapp" 
              ? "We've redirected you to WhatsApp to confirm your order." 
              : "Thank you! A confirmation email has been sent to your email address."}
          </p>
          <div className="bg-gray-50 p-5 sm:p-6 rounded-2xl mb-6 sm:mb-8 flex justify-between items-center text-left border border-gray-100">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Order ID</p>
              <p className="font-bold text-navy text-sm sm:text-base">#{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total</p>
              <p className="font-bold text-teal-600 text-sm sm:text-base">₹{total.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/products" className="flex-1 text-center bg-navy text-white px-5 py-3.5 sm:py-4 rounded-full font-semibold hover:bg-teal-700 transition-colors shadow-lg text-sm">
              Continue Shopping
            </Link>
            <Link href={`/track?id=${orderId}`} className="flex-1 text-center bg-gray-100 text-navy px-5 py-3.5 sm:py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors text-sm">
              Track Order
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // === EMPTY CART ===
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-20 sm:pt-24 pb-16 sm:pb-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
            <FiShoppingBag size={36} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-navy mb-3">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-6 text-sm">Add some products before checking out.</p>
          <Link href="/products" className="inline-block bg-navy text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-700 transition-colors shadow-lg text-sm">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-10 sm:pt-16 pb-16 sm:pb-24 relative">
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[100] flex items-center justify-center text-white"
          >
            <div className="bg-white text-navy p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm w-[90%]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mb-5 sm:mb-6"></div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mb-2">Connecting to Razorpay</h2>
              <p className="text-gray-500 text-sm">Please do not refresh or close this window.</p>
              <div className="mt-5 flex items-center gap-2 text-xs text-gray-400 font-semibold bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <FiLock size={12} /> 256-bit SSL Secure
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Back Link */}
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-teal-600 transition-colors mb-4 sm:mb-6 font-medium">
          <FiArrowLeft size={14} /> Back to Shopping
        </Link>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy mb-6 sm:mb-8">Secure Checkout</h1>

        {/* Mobile Order Summary (shown above form on mobile) */}
        <div className="lg:hidden mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-navy text-base">Order Summary</h2>
              <span className="text-sm font-bold text-navy">{cart.length} item{cart.length > 1 ? "s" : ""}</span>
            </div>
            <div className="flex flex-col gap-3 mb-4 max-h-32 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-1 -right-1 bg-navy text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-navy truncate">{item.name}</h3>
                    <span className="text-xs font-bold text-teal-700">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-base font-bold text-navy">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left — Form (3 cols) */}
          <div className="lg:col-span-3 space-y-5 sm:space-y-6">
            
            {/* Step 1: Contact */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs sm:text-sm font-bold">1</div>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Email Address *</label>
                  <input type="email" required placeholder="you@email.com" className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-gray-50/50" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Phone Number *</label>
                  <input type="tel" required placeholder="+91 96337 72866" className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-gray-50/50" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs sm:text-sm font-bold">2</div>
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Full Name *</label>
                  <input type="text" required placeholder="John Doe" className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-gray-50/50" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1.5">Street Address *</label>
                  <input type="text" required placeholder="123 Main Street" className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-gray-50/50" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">City *</label>
                    <input type="text" required placeholder="Trivandrum" className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-gray-50/50" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1.5">Postal Code *</label>
                    <input type="text" required placeholder="695001" className="w-full px-3.5 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-gray-50/50" value={formData.postalCode} onChange={(e) => setFormData({...formData, postalCode: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment */}
            <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs sm:text-sm font-bold">3</div>
                Payment Method
              </h2>
              
              <div className="flex flex-col gap-3">
                <label className={`flex items-center gap-3 p-3.5 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-teal-500 bg-teal-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'}`}>
                  <input type="radio" name="payment" value="razorpay" checked={paymentMethod === "razorpay"} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 accent-teal-600" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-navy block text-sm">Online Payment</span>
                    <span className="text-[11px] sm:text-xs text-gray-500">UPI, Credit Card, NetBanking</span>
                  </div>
                  <FiCreditCard size={20} className="text-teal-600 shrink-0" />
                </label>

                <label className={`flex items-center gap-3 p-3.5 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-teal-500 bg-teal-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 accent-teal-600" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-navy block text-sm">Cash on Delivery</span>
                    <span className="text-[11px] sm:text-xs text-gray-500">Pay at your doorstep</span>
                  </div>
                  <FiPackage size={20} className="text-gray-400 shrink-0" />
                </label>

                <label className={`flex items-center gap-3 p-3.5 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'whatsapp' ? 'border-green-500 bg-green-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'}`}>
                  <input type="radio" name="payment" value="whatsapp" checked={paymentMethod === "whatsapp"} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 accent-green-600" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-navy block text-sm">Order via WhatsApp</span>
                    <span className="text-[11px] sm:text-xs text-gray-500">Send details to our team</span>
                  </div>
                  <FiMessageCircle size={20} className="text-green-600 shrink-0" />
                </label>
              </div>

              {/* Place Order Button — visible on mobile below payment */}
              <button 
                onClick={handlePlaceOrder}
                className={`w-full mt-5 sm:mt-6 text-white py-3.5 sm:py-4 rounded-xl font-bold text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] ${paymentMethod === "whatsapp" ? "bg-green-600 hover:bg-green-700 shadow-green-600/20" : "bg-navy hover:bg-teal-700 shadow-navy/20"}`}
              >
                {paymentMethod === 'whatsapp' ? 'Send to WhatsApp' : `Pay ₹${total.toLocaleString("en-IN")}`}
              </button>
            </div>
          </div>

          {/* Right — Order Summary Sidebar (2 cols, desktop only) */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-navy mb-5 flex items-center justify-between">
                Order Summary
                <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2.5 py-1 rounded-full">{cart.length} item{cart.length > 1 ? "s" : ""}</span>
              </h2>
              
              {/* Cart Items */}
              <div className="flex flex-col gap-4 mb-5 max-h-[30vh] overflow-y-auto pr-1 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 bg-navy text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold leading-none" style={{ width: 18, height: 18 }}>{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="font-medium text-navy text-sm leading-tight truncate">{item.name}</h3>
                      <span className="font-bold text-teal-700 text-sm mt-0.5">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section — properly framed */}
              <div className="bg-gradient-to-br from-gray-50 to-teal-50/30 rounded-xl p-4 border border-gray-200/80 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                    <FiTag size={12} className="text-teal-600" />
                  </div>
                  <span className="text-sm font-bold text-navy">Have a coupon?</span>
                </div>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-white border-2 border-green-300 rounded-xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <FiCheckCircle size={16} className="text-green-600" />
                      <div>
                        <span className="font-bold text-green-700 text-sm">{appliedCoupon.code}</span>
                        <span className="text-green-600 text-xs ml-1.5 bg-green-50 px-1.5 py-0.5 rounded">{appliedCoupon.percentage}% off</span>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 transition-colors p-1"><FiX size={16} /></button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER CODE"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      className="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm uppercase font-bold tracking-wider placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2.5 bg-navy text-white rounded-xl font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 min-w-[70px] flex items-center justify-center"
                    >
                      {couponLoading ? <FiLoader className="animate-spin" size={14} /> : "Apply"}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                    <FiX size={12} /> {couponError}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-navy">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                {discount > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex justify-between text-gray-500">
                    <span className="flex items-center gap-1">Discount <span className="text-[10px] text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded font-bold">{appliedCoupon?.code}</span></span>
                    <span className="font-semibold text-red-500">-₹{discount.toLocaleString("en-IN")}</span>
                  </motion.div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between items-end">
                <span className="font-bold text-navy text-base">Total</span>
                <div className="text-right">
                  {discount > 0 && <span className="text-xs text-gray-400 line-through block">₹{subtotal.toLocaleString("en-IN")}</span>}
                  <span className="font-bold text-2xl text-navy">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium">
                <FiLock size={12} /> Secure checkout powered by 256-bit SSL
              </div>
            </div>
          </div>

          {/* Mobile Coupon + Total (below form, above footer) */}
          <div className="lg:hidden">
            {/* Coupon Section — Mobile */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
                  <FiTag size={12} className="text-teal-600" />
                </div>
                <span className="text-sm font-bold text-navy">Have a coupon code?</span>
              </div>
              
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FiCheckCircle size={16} className="text-green-600" />
                    <span className="font-bold text-green-700 text-sm">{appliedCoupon.code}</span>
                    <span className="text-green-600 text-xs bg-green-100 px-1.5 py-0.5 rounded">{appliedCoupon.percentage}% off</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-gray-400 hover:text-red-500 p-1"><FiX size={16} /></button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="ENTER CODE"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm uppercase font-bold tracking-wider placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2.5 bg-navy text-white rounded-xl font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-40 shrink-0 min-w-[70px] flex items-center justify-center"
                  >
                    {couponLoading ? <FiLoader className="animate-spin" size={14} /> : "Apply"}
                  </button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-xs mt-2 font-medium">{couponError}</p>}
            </div>

            {/* Mobile Total */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-navy">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-gray-500">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold text-red-500">-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-center">
                <span className="font-bold text-navy">Total</span>
                <span className="font-bold text-xl text-navy">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
