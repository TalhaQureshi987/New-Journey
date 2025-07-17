import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../shared/Navbar';
import Footer from '../shared/footer';
import { Users, Building, Globe, Target, Award, Briefcase } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { icon: Users, value: '100K+', label: 'Job Seekers' },
    { icon: Building, value: '10K+', label: 'Companies' },
    { icon: Briefcase, value: '50K+', label: 'Jobs Posted' },
    { icon: Globe, value: '50+', label: 'Countries' },
  ];

  const values = [
    { 
      icon: Target,
      title: 'Our Mission',
      description: 'To connect talented individuals with their dream careers and help companies find the perfect candidates.'
    },
    {
      icon: Award,
      title: 'Our Vision',
      description: "To become the world's most trusted and effective platform for career development and recruitment."
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
              About Us
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-blue-100 max-w-3xl mx-auto"
            >
              Connecting talent with opportunity, transforming careers, and helping businesses grow.
            </motion.p>
          </div>
        </section>
      </div>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <value.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in 2020, our platform emerged from a simple yet powerful idea: to revolutionize 
                how people find jobs and how companies discover talent. What started as a small startup 
                has grown into a global platform connecting millions of job seekers with opportunities 
                worldwide.
              </p>
              <p>
                Today, we continue to innovate and expand our services, leveraging cutting-edge 
                technology to make job searching and recruitment more efficient, transparent, and 
                successful for everyone involved.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs; 