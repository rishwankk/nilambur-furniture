"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingBag, FiUser, FiHeart, FiMenu, FiX, FiSearch } from "react-icons/fi";
import CartDrawer from "@/components/cart/CartDrawer";
import { useStore } from "@/store/store";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "Track Order", href: "/track" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const { cart } = useStore();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center relative gap-4">
        {/* Logo */}
        <div className="flex-1 flex justify-start pointer-events-none">
          <Link href="/" className="flex items-center gap-2 group relative z-50 pointer-events-auto">
            <div className="flex items-center shrink-0 mix-blend-multiply mr-2">
              <Image src="/mainlogo.png" alt="Nilambur Interiors & Furniture Logo" width={100} height={100} className="object-contain transition-transform duration-300 group-hover:scale-105" priority />
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium tracking-wide relative group ${
                pathname === link.href ? "text-teal-600" : "text-navy-light hover:text-teal-600"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-teal-500 transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
          ))}
        </nav>

        {/* Icons */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-5 text-navy-light relative z-50 pointer-events-none [&>*]:pointer-events-auto">
          <button className="hover:text-teal-600 transition-colors"><FiSearch size={20} /></button>
          <Link href="/login" className="hover:text-teal-600 transition-colors"><FiUser size={20} /></Link>
          <Link href="/wishlist" className="hover:text-teal-600 transition-colors"><FiHeart size={20} /></Link>
          <button onClick={() => setIsCartOpen(true)} className="relative hover:text-teal-600 transition-colors">
            <FiShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-luxury-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-navy-light z-50"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-xl py-6 px-4 flex flex-col gap-4 border-t border-gray-100 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg text-navy py-2 border-b border-gray-50 flex items-center gap-3"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex justify-around pt-4 pb-2 text-teal-700">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-1"><FiUser size={20} /><span className="text-xs">Account</span></Link>
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col items-center gap-1"><FiHeart size={20} /><span className="text-xs">Wishlist</span></Link>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); setIsCartOpen(true); }} 
                className="flex flex-col items-center gap-1 relative"
              >
                <FiShoppingBag size={20} />
                <span className="text-xs">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 right-2 bg-luxury-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
