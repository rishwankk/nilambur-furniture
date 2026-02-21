"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingBag, FiUser, FiHeart, FiMenu, FiX, FiSearch, FiHome, FiGrid, FiPhone } from "react-icons/fi";
import CartDrawer from "@/components/cart/CartDrawer";
import { useStore } from "@/store/store";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      // Hide header on scroll down, show on scroll up (mobile)
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/", icon: <FiHome size={18} /> },
    { name: "Shop", href: "/products", icon: <FiGrid size={18} /> },
    { name: "Track Order", href: "/track", icon: <FiSearch size={18} /> },
    { name: "About Us", href: "/about", icon: <FiUser size={18} /> },
    { name: "Contact", href: "/contact", icon: <FiPhone size={18} /> },
  ];

  const { cart } = useStore();

  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 200,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: "100%",
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    closed: { opacity: 0, x: 40, y: 10 },
    open: { opacity: 1, x: 0, y: 0, transition: { type: "spring" as const, damping: 20 } },
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          !headerVisible ? "-translate-y-full" : "translate-y-0"
        } ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] py-2 md:py-3"
            : "bg-transparent py-4 md:py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center relative gap-4">
          {/* Logo */}
          <div className="flex-1 flex justify-start pointer-events-none">
            <Link href="/" className="flex items-center gap-2 group relative z-50 pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center shrink-0 mix-blend-multiply mr-2"
              >
                <Image
                  src="/mainlogo.png"
                  alt="Nilambur Interiors & Furniture Logo"
                  width={isScrolled ? 70 : 90}
                  height={isScrolled ? 70 : 90}
                  className="object-contain transition-all duration-300 group-hover:scale-105"
                  priority
                />
              </motion.div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  className={`text-sm font-medium tracking-wide relative group py-2 ${
                    pathname === link.href ? "text-teal-600" : "text-navy-light hover:text-teal-600"
                  } transition-colors duration-300`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-300 rounded-full ${
                      pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-5 text-navy-light relative z-50 pointer-events-none [&>*]:pointer-events-auto">
            <button className="hover:text-teal-600 transition-colors p-2 hover:bg-teal-50 rounded-full">
              <FiSearch size={20} />
            </button>
            <Link href="/login" className="hover:text-teal-600 transition-colors p-2 hover:bg-teal-50 rounded-full">
              <FiUser size={20} />
            </Link>
            <Link href="/wishlist" className="hover:text-teal-600 transition-colors p-2 hover:bg-teal-50 rounded-full">
              <FiHeart size={20} />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-teal-600 transition-colors p-2 hover:bg-teal-50 rounded-full"
            >
              <FiShoppingBag size={20} />
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg shadow-teal-600/30"
                >
                  {cart.length}
                </motion.span>
              )}
            </button>
          </div>

          {/* Mobile Icons */}
          <div className="flex md:hidden items-center gap-2 z-50">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-navy-light hover:text-teal-600"
            >
              <FiShoppingBag size={22} />
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold"
                >
                  {cart.length}
                </motion.span>
              )}
            </button>
            <button
              className="p-2 text-navy-light z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <FiX size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <FiMenu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Slide-in Panel */}
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="exit"
                className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[380px] bg-white z-50 md:hidden flex flex-col shadow-2xl"
              >
                {/* Menu Header */}
                <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center text-white">
                      <Image src="/mainlogo.png" alt="Logo" width={32} height={32} className="object-contain" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-navy text-lg leading-tight">Nilambur</h3>
                      <p className="text-xs text-gray-400">Interiors</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 -mr-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                {/* Nav Links */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <motion.div key={link.name} variants={itemVariants}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                            pathname === link.href
                              ? "bg-gradient-to-r from-teal-50 to-teal-100/50 text-teal-700 font-semibold"
                              : "text-navy hover:bg-gray-50"
                          }`}
                        >
                          <span className={`${pathname === link.href ? "text-teal-600" : "text-gray-400"}`}>
                            {link.icon}
                          </span>
                          <span className="text-[15px]">{link.name}</span>
                          {pathname === link.href && (
                            <motion.div
                              layoutId="activeLink"
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600"
                            />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  {/* Quick Actions */}
                  <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-teal-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 group-hover:text-teal-600 transition-colors">
                        <FiUser size={18} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">Account</span>
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-red-50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 group-hover:text-red-500 transition-colors">
                        <FiHeart size={18} />
                      </div>
                      <span className="text-xs font-medium text-gray-600">Wishlist</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsCartOpen(true);
                      }}
                      className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-teal-50 transition-colors group relative"
                    >
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 group-hover:text-teal-600 transition-colors relative">
                        <FiShoppingBag size={18} />
                        {cart.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                            {cart.length}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-600">Cart</span>
                    </button>
                  </motion.div>
                </div>

                {/* Menu Footer */}
                <motion.div
                  variants={itemVariants}
                  className="p-6 pt-4 border-t border-gray-100 bg-gray-50/50"
                >
                  <Link
                    href="/interior-works"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-navy to-navy-light text-white py-4 rounded-2xl font-semibold text-sm shadow-lg shadow-navy/20 hover:shadow-xl transition-shadow"
                  >
                    ✨ Get Free Interior Quote
                  </Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 mobile-bottom-nav md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe sm:pb-0">
        <div className="flex items-center justify-around px-2 py-2">
          {[
            { name: "Home", href: "/", icon: <FiHome size={20} /> },
            { name: "Shop", href: "/products", icon: <FiGrid size={20} /> },
            { name: "Search", href: "/products", icon: <FiSearch size={20} /> },
            { name: "Wishlist", href: "/wishlist", icon: <FiHeart size={20} /> },
            { name: "Account", href: "/login", icon: <FiUser size={20} /> },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all duration-300 min-h-[auto] ${
                pathname === item.href
                  ? "text-teal-600"
                  : "text-gray-400 hover:text-navy"
              }`}
            >
              <span className={pathname === item.href ? "scale-110 transition-transform" : "transition-transform"}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium">{item.name}</span>
              {pathname === item.href && (
                <motion.div
                  layoutId="bottomNav"
                  className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-teal-600 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
