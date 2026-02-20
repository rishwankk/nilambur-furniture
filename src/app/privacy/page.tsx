import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-soft-bg pt-12 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <nav className="flex text-sm text-gray-400 mb-8 font-medium">
          <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-navy">Privacy Policy</span>
        </nav>

        <div className="bg-white rounded-3xl p-8 md:p-16 shadow-sm border border-gray-100 mb-12 prose prose-lg text-gray-600">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-navy mb-12">Privacy Policy</h1>
          
          <p className="lead text-xl text-navy font-medium mb-8">
            At Nilambur Furniture, we are committed to safeguarding your privacy. This Privacy Policy details how we collect, use, process, and securely store your personal data when you visit our website or make a purchase.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-12 mb-4">1. Information We Collect</h2>
          <p>
            When you visit the site, we automatically collect certain data about your device, including details about your web browser, IP address, timezone, and some cookies installed. Additionally, as you browse, we gather data about individual web pages or products you view. When you make a purchase or attempt to make a purchase, we collect necessary information from you, including your name, billing address, shipping address, email, and phone number.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-12 mb-4">2. How We Use Your Information</h2>
          <p>
            We use the Order Information to fulfill any orders placed through the website (including processing payment, arranging shipping, and sending invoices/order confirmations). Furthermore, we use this Order Information to communicate securely with you, screen orders for potential risk or fraud, and, based on your preferences, provide you with information or advertising relating to our furniture collections.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-12 mb-4">3. Data Security and Payment Processing</h2>
          <p>
            All critical transactions are executed over SSL-encrypted connections. For online payments, we use renowned gateways like Razorpay. Nilambur Furniture does NOT store your credit/debit card details on our servers natively. The payment gateways handle all sensitive billing data securely in compliance with PCI-DSS standards.
          </p>

          <h2 className="text-2xl font-bold text-navy mt-12 mb-4">4. Sharing Your Personal Data</h2>
          <p>
            We share your Personal Data with select third parties strictly to help us operate our store (e.g., our logistics and shipping partners). We also utilize Google Analytics to help us understand how customers use the Site. We may also share your Personal Data to comply with applicable local laws and regulations.
          </p>

           <h2 className="text-2xl font-bold text-navy mt-12 mb-4">5. Your Data Rights</h2>
          <p>
            If you are a resident accessing this service, you possess the right to govern the personal data we hold about you and to ask that your personal data be corrected, updated, or decisively deleted. If you would like to exercise this action, please reach out to us using the contact portal below.
          </p>

          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gray-50 rounded-2xl p-6">
             <p className="text-sm font-semibold mb-4 md:mb-0">Last Updated: October 2023</p>
             <Link href="/contact" className="text-teal-600 font-bold hover:underline">
               Contact Privacy Team
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
