"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FiHome, FiBox, FiShoppingBag, FiTag, FiLogOut, FiSettings, FiMenu, FiX, FiList } from "react-icons/fi";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const links = [
    { name: "Dashboard", href: "/admin", icon: FiHome },
    { name: "Products", href: "/admin/products", icon: FiBox },
    { name: "Categories", href: "/admin/categories", icon: FiList },
    { name: "Orders", href: "/admin/orders", icon: FiShoppingBag },
    { name: "Coupons", href: "/admin/coupons", icon: FiTag },
    { name: "Settings", href: "/admin/settings", icon: FiSettings },
  ];

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)} 
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-teal-600 text-white p-4 rounded-full shadow-2xl"
      >
        {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy text-white shadow-xl flex flex-col lg:static transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
            <div className="p-6 border-b border-navy-light flex items-center justify-center">
              <div className="bg-white rounded-2xl overflow-hidden shadow-inner flex items-center justify-center w-[100px] h-[100px]">
                <Image src="/mainlogo.png" alt="Nilambur Admin Logo" width={90} height={90} className="object-contain" priority />
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-gray-400 hover:bg-navy-light hover:text-white'}`}
                  >
                    <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-navy-light">
              <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium">
                <FiLogOut size={20} />
                Logout
              </button>
            </div>
      </aside>

      {/* Main Content Overlay for Mobile */}
      {isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)} 
          className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-30 lg:hidden"
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white px-8 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
          <h1 className="text-xl font-bold text-navy hidden md:block">
            {links.find(l => l.href === pathname)?.name || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-navy">Admin User</span>
              <span className="text-xs text-teal-600 font-medium">Superadmin</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border-2 border-teal-500">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-soft-bg scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
