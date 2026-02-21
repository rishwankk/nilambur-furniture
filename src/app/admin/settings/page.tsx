"use client";

import { motion } from "framer-motion";
import { FiSave, FiLock, FiMail, FiGlobe, FiPhone, FiMapPin } from "react-icons/fi";
import { useState } from "react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    adminEmail: "admin@nilambur.com",
    storeName: "Nilambur Furniture",
    supportPhone: "+91 96337 72866",
    headOffice: "Nilambur, Kerala, India",
    currency: "INR (₹)"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate save
    setTimeout(() => {
      setLoading(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Store Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure global application variables and security protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
            
            {/* General Info */}
            <section>
              <h2 className="text-lg font-bold text-navy mb-4 border-b border-gray-100 pb-2">General Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2">
                    <FiGlobe className="text-gray-400" /> Store Name
                  </label>
                  <input 
                    type="text" 
                    value={formData.storeName}
                    onChange={e => setFormData({...formData, storeName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2">
                    <span className="text-gray-400 font-bold">₹</span> Default Currency
                  </label>
                  <input 
                    type="text" 
                    value={formData.currency}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Contact Details */}
            <section>
              <h2 className="text-lg font-bold text-navy mb-4 border-b border-gray-100 pb-2">Public Contact Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2">
                    <FiPhone className="text-gray-400" /> Support Phone
                  </label>
                  <input 
                    type="text" 
                    value={formData.supportPhone}
                    onChange={e => setFormData({...formData, supportPhone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2">
                    <FiMapPin className="text-gray-400" /> Head Office
                  </label>
                  <input 
                    type="text" 
                    value={formData.headOffice}
                    onChange={e => setFormData({...formData, headOffice: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                  />
                </div>
              </div>
            </section>

            {/* Admin Security */}
            <section>
              <h2 className="text-lg font-bold text-navy mb-4 border-b border-gray-100 pb-2">Administrator Access (ENV Locked)</h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-orange-800 mb-2">
                  Admin credentials can only be updated securely by modifying the environment variables (`.env.local`) on the deployment server.
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2">
                    <FiMail className="text-gray-400" /> Registered Admin Email
                  </label>
                  <input 
                    type="email" 
                    value={formData.adminEmail}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed text-sm font-mono"
                  />
                </div>
              </div>
            </section>

            <div className="pt-4 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-navy text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-teal-700 transition-colors shadow-lg disabled:opacity-50"
              >
                <FiSave size={18} /> {loading ? "Applying Changes..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>

        {/* Informational side panel */}
        <div className="lg:col-span-1">
           <div className="bg-gray-50 rounded-3xl p-6 md:p-8 shadow-inner border border-gray-100">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-sm mb-4">
               <FiLock size={20} />
             </div>
             <h3 className="font-bold text-navy text-lg mb-2">Environment Controlled</h3>
             <p className="text-sm text-gray-500 leading-relaxed mb-6">
                For maximum security, critical data points including the `JWT_SECRET`, Mongoose Connection URI, and Admin Root passwords are not exposed to this GUI. They are locked tightly within encrypted environment states.
             </p>
             <h4 className="font-semibold text-gray-700 text-sm mb-2">Database Connection:</h4>
             <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-lg text-xs font-mono font-bold">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               cluster0.mongodb.net
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
