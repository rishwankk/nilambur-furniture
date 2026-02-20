import Link from "next/link";
import Image from "next/image";
import { FiMapPin, FiPhone, FiMail, FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-navy text-white pt-16 pb-8 border-t-4 border-teal-600">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-white rounded-2xl p-2 shrink-0 shadow-lg border-2 border-teal-600/20 overflow-hidden flex items-center justify-center w-[120px] h-[120px]">
                <Image src="/mainlogo.png" alt="Nilambur Interiors & Furniture Logo" width={100} height={100} className="object-contain" />
              </div>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Designed for your comfort. We are the best furniture store in Nedumangad, Trivandrum, bringing luxury and elegance to your living spaces with our premium handcrafted collection.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center text-teal-400 hover:bg-teal-600 hover:text-white transition-all duration-300">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center text-teal-400 hover:bg-teal-600 hover:text-white transition-all duration-300">
                <FiFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-navy-light flex items-center justify-center text-teal-400 hover:bg-teal-600 hover:text-white transition-all duration-300">
                <FiTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6 text-white border-b border-navy-light pb-2 inline-block">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><Link href="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-teal-400 transition-colors">Shop Furniture</Link></li>
              <li><Link href="/about" className="hover:text-teal-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/track" className="hover:text-teal-400 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6 text-white border-b border-navy-light pb-2 inline-block">Customer Care</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><Link href="/faq" className="hover:text-teal-400 transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-teal-400 transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-6 text-white border-b border-navy-light pb-2 inline-block">Visit Us</h3>
            <ul className="flex flex-col gap-5 text-sm text-gray-400">
              <li className="flex items-start gap-4 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-navy-light flex-shrink-0 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                  <FiMapPin className="text-teal-400 group-hover:text-white" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Store Location</h4>
                  <p className="leading-relaxed">Nilambur Interiors & Furniture<br />Valikkode, Nedumangad<br />Trivandrum, Kerala</p>
                </div>
              </li>
              <li className="flex items-start gap-4 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-navy-light flex-shrink-0 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                  <FiPhone className="text-teal-400 group-hover:text-white" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Call Us</h4>
                  <p>+91 XXXXXXXXXX</p>
                </div>
              </li>
              <li className="flex items-start gap-4 hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-full bg-navy-light flex-shrink-0 flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                  <FiMail className="text-teal-400 group-hover:text-white" size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Email Us</h4>
                  <p>info@nilamburinteriors.com</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Small Map Embed (Optional placeholder) */}
        <div className="w-full h-[200px] mb-8 rounded-xl overflow-hidden shadow-lg border border-navy-light">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.334053641154!2d76.9945!3d8.6015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzYnMDkuNiJOIDc2wrA1OSczOS4wIkU!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </div>

        <div className="border-t border-navy-light pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Nilambur Interiors & Furniture. All rights reserved.</p>
          <div className="flex gap-4">
             <span>Designed for your comfort.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
