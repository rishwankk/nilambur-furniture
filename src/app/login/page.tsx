"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

function LoginContent() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: tokenResponse.access_token
          }),
        });
        const data = await res.json();
        if (data.success) {
          setTimeout(() => {
            router.push("/");
            router.refresh();
          }, 1000);
        } else {
          setIsGoogleLoading(false);
          alert(data.message || "Google Login failed");
        }
      } catch (e) {
        console.error(e);
        setIsGoogleLoading(false);
        alert("Server error during Google Login");
      }
    },
    onError: () => {
      console.error("Google login failed");
      setIsGoogleLoading(false);
      alert("Failed to connect to Google");
    }
  });

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    loginGoogle();
  };

  return (
    <div className="min-h-screen bg-soft-bg pt-12 pb-24 flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-8 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[1000px] bg-white rounded-[2rem] shadow-2xl shadow-navy/5 overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left Side - Image/Banner */}
          <div className="w-full md:w-1/2 bg-navy relative hidden md:flex items-center justify-center overflow-hidden p-12">
            <div className="absolute inset-0 opacity-40">
              <Image 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80" 
                alt="Login Banner" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent"></div>
            
            <div className="relative z-10 text-white flex flex-col h-full justify-between">
              <div>
                <Link href="/" className="inline-flex items-center gap-2 group mb-16">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-teal-700 font-serif font-bold text-xl group-hover:bg-luxury-gold transition-colors duration-300">
                    N
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-xl font-bold tracking-wide">
                      Nilambur
                    </span>
                    <span className="text-[10px] text-teal-400 uppercase tracking-widest leading-none">
                      Interiors & Furniture
                    </span>
                  </div>
                </Link>
                
                <h2 className="text-4xl font-serif font-bold mb-4 leading-tight">Welcome Back to <br/> Premium Living.</h2>
                <p className="text-gray-300">Log in to track orders, manage your wishlist, and check out faster with saved addresses.</p>
              </div>
              
              <div className="mt-8 flex gap-3">
                <div className="h-1 w-8 bg-teal-500 rounded-full"></div>
                <div className="h-1 w-4 bg-white/30 rounded-full"></div>
                <div className="h-1 w-4 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white relative">
            <div className="w-full max-w-sm mx-auto">
              <h1 className="text-3xl font-serif font-bold text-navy mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h1>
              <p className="text-gray-500 mb-8 text-sm">
                {isLogin ? "Enter your credentials to access your account." : "Join us setup your luxury space."}
              </p>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                
                {!isLogin && (
                  <div>
                    <label className="text-sm font-semibold text-navy mb-2 block">Full Name</label>
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm font-medium" 
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-navy mb-2 block">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm font-medium" 
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-semibold text-navy mb-2 flex justify-between">
                    <span>Password</span>
                    {isLogin && <a href="#" className="font-medium text-teal-600 hover:text-navy transition-colors">Forgot?</a>}
                  </label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm font-medium" 
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  className="w-full bg-navy text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-navy/10 mt-6"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="h-px bg-gray-100 flex-1"></div>
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Or continue with</span>
                <div className="h-px bg-gray-100 flex-1"></div>
              </div>

              {/* Google Log In */}
              <button 
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-navy text-sm shadow-sm disabled:opacity-50"
              >
                {isGoogleLoading ? (
                  <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                )}
                {isGoogleLoading ? "Connecting..." : "Google"}
              </button>

              {/* Toggle Mode */}
              <p className="text-center mt-8 text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="font-bold text-teal-600 hover:text-navy transition-colors underline underline-offset-4"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "6393450982-mock912384v2.apps.googleusercontent.com"}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
}
