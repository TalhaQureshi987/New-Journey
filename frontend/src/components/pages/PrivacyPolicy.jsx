import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../shared/Navbar';
import Footer from '../shared/footer';
import { Shield, Lock, Eye, UserCheck, Server } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Shield,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, including:
        • Personal information (name, email, phone number)
        • Professional information (resume, work history)
        • Account credentials
        • Communication preferences`
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: `We use the collected information to:
        • Provide and maintain our services
        • Process job applications
        • Communicate with you
        • Improve our platform
        • Comply with legal obligations`
    },
    {
      icon: Eye,
      title: 'Information Sharing',
      content: `We may share your information with:
        • Employers when you apply for jobs
        • Service providers
        • Legal authorities when required
        • Business partners with your consent`
    },
    {
      icon: Server,
      title: 'Data Security',
      content: `We implement appropriate security measures to protect your information from unauthorized access, alteration, or destruction. However, no internet transmission is completely secure.`
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: `You have the right to:
        • Access your personal data
        • Correct inaccurate data
        • Request deletion of your data
        • Object to data processing
        • Data portability`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <Navbar />
        {/* Hero Section */}
        <section className="relative pt-20 pb-24">
          <div className="container mx-auto px-4 text-center text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Privacy Policy
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-blue-100 max-w-3xl mx-auto"
            >
              Last updated: {new Date().toLocaleDateString()}
            </motion.p>
          </div>
        </section>
      </div>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-8">
              <p className="text-gray-600 mb-8">
                This Privacy Policy describes how we collect, use, and handle your personal information
                when you use our services. We take your privacy seriously and are committed to protecting
                your personal information.
              </p>

              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-8"
                >
                  <div className="flex items-center mb-4">
                    <section.icon className="w-6 h-6 text-blue-600 mr-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{section.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy; 