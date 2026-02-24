"use client";

import { motion } from "framer-motion";
import { FiSave, FiLock, FiMail, FiGlobe, FiPhone, FiMapPin, FiKey } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    adminEmail: "admin@nilambur.com",
    adminPassword: "admin123",
    storeName: "Nilambur Furniture",
    supportPhone: "+91 96337 72866",
    headOffice: "Nilambur, Kerala, India",
    currency: "INR (₹)"
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Send OTP
    try {
      const res = await fetch("/api/admin/otp/send", { method: "POST" });
      const data = await res.json();
      if(data.success) {
        setOtpSent(true);
      } else {
        toast.error("Failed to send OTP. Ensure SMTP works.");
      }
    } catch(err) {
      console.error(err);
      toast.error("Error sending OTP");
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    if(!otp) {
      toast.error("Enter OTP");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch("/api/admin/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          otp,
          newEmail: formData.adminEmail,
          newPassword: formData.adminPassword
        })
      });
      const data = await res.json();
      if(data.success) {
        toast.success("Settings and credentials saved successfully!");
        setOtpSent(false);
        setOtp("");
      } else {
        toast.error(data.message || "Failed to verify OTP");
      }
    } catch(err) {
      toast.error("Error verifying OTP");
    }
    setOtpLoading(false);
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
          {otpSent ? (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-4">
                <FiLock size={24} />
              </div>
              <h2 className="text-lg font-bold text-navy mb-2">Verify Your Identity</h2>
              <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">An OTP has been sent to your current admin email. Enter it below to save your changes.</p>
              <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)}
                className="w-full max-w-sm px-4 py-3 text-center tracking-widest font-mono font-bold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 mb-6 text-lg" />
              <div className="flex gap-4">
                <button onClick={() => setOtpSent(false)} className="px-6 py-3 font-semibold text-gray-500 hover:text-navy transition-colors">Cancel</button>
                <button onClick={handleVerify} disabled={otpLoading} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg disabled:opacity-50">
                  {otpLoading ? "Verifying..." : "Verify & Save"}
                </button>
              </div>
            </div>
          ) : (
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
                <h2 className="text-lg font-bold text-navy mb-4 border-b border-gray-100 pb-2">Administrator Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1 md:col-span-2 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 mb-2">
                    Changing the Admin Username (Email) or Password requires an OTP verification sent to your current registered email.
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2">
                      <FiMail className="text-gray-400" /> Admin Username (Email)
                    </label>
                    <input 
                      type="email" 
                      value={formData.adminEmail}
                      onChange={e => setFormData({...formData, adminEmail: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2">
                      <FiKey className="text-gray-400" /> Admin Password
                    </label>
                    <input 
                      type="text" 
                      value={formData.adminPassword}
                      onChange={e => setFormData({...formData, adminPassword: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-mono"
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
                  <FiSave size={18} /> {loading ? "Updating..." : "Save Settings (Requires OTP)"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Informational side panel */}
        <div className="lg:col-span-1">
           <div className="bg-gray-50 rounded-3xl p-6 md:p-8 shadow-inner border border-gray-100">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-teal-600 shadow-sm mb-4">
               <FiLock size={20} />
             </div>
             <h3 className="font-bold text-navy text-lg mb-2">Environment Controlled</h3>
             <p className="text-sm text-gray-500 leading-relaxed mb-6">
                Critical data points including the `JWT_SECRET` and Mongoose Connection URI are locked tightly within encrypted environment states. Admin credentials are now manageable via OTP verification.
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
