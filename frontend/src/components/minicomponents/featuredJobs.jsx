import { useInView } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import JobCard from './jobcard';

const featuredJobs = () => {
    
  return (
    <section className="py-16 bg-gray-100">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        Featured Job Opportunities
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
   
      </div>
      <div className="text-center mt-12">
        <button className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center mx-auto">
          <Briefcase size={20} className="mr-2" />
          View All Jobs
        </button>
      </div>
    </div>
  </section>
  )
}

export default featuredJobs