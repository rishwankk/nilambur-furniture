"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/store";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-navy flex items-center gap-2">
                Your Cart
                <span className="bg-teal-100 text-teal-800 text-xs py-0.5 px-2 rounded-full font-sans">{cart.length} items</span>
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-navy">
                <FiX size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-gray-500">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <FiShoppingCart size={32} className="text-gray-300" />
                  </div>
                  <p>Your cart is empty.</p>
                  <button onClick={onClose} className="text-teal-600 font-semibold border-b border-teal-600 pb-1">Continue Shopping</button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div layout key={item.id} className="flex gap-4 border-b border-gray-50 pb-6 group">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-semibold text-navy text-sm leading-snug">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 shrink-0">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-teal-700">₹{item.price.toLocaleString("en-IN")}</span>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-3 py-1 border border-gray-100">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-navy transition-colors">
                            <FiMinus size={14} />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-navy transition-colors">
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-xl font-bold text-navy">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6 font-light">Shipping and taxes calculated at checkout.</p>
                
                <Link href="/checkout" onClick={onClose}>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-navy text-white hover:bg-teal-700 transition-colors py-4 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg shadow-navy/20"
                  >
                    Proceed to Checkout <FiArrowRight />
                  </motion.button>
                </Link>
                <div className="mt-4 text-center">
                  <button onClick={onClose} className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors">
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
