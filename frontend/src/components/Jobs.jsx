import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import { motion } from 'framer-motion'
import { Search, MapPin, Filter, ChevronDown } from 'lucide-react'
import Footer from './shared/footer'
import { useSelector } from 'react-redux'
import JobCard from './minicomponents/jobcard'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import axios from 'axios'

const FilterDropdown = ({ label, options, value, onChange }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <ChevronDown size={16} />
      </div>
    </div>
  </div>
)

const Jobs = () => {
  useGetAllJobs();
  const {allJobs} = useSelector(store=>store.job)
  const [searchTerm, setSearchTerm] = useState('')
  const [industries, setIndustries] = useState([])
  const [filters, setFilters] = useState({
    industry: '',
    type: '',
    experience: '',
    location: '',
    employmentType: ''
  })
  const [filteredJobs, setFilteredJobs] = useState([])
  const [visibleJobs, setVisibleJobs] = useState(6)
  const [locations, setLocations] = useState([])

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/industry');
        if (response.data && response.data.data) {
          const industryNames = response.data.data.map(ind => ind.name);
          setIndustries(industryNames);
        }
      } catch (error) {
        console.error('Error fetching industries:', error);
        setIndustries([]);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    if (allJobs) {
      const uniqueLocations = [...new Set(allJobs
        .map(job => job.location)
        .filter(Boolean)
      )];
      setLocations(uniqueLocations.sort());
    }
  }, [allJobs]);

  useEffect(() => {
    if (allJobs) {
      const filtered = allJobs.filter(job => {
        const searchTermLower = searchTerm.toLowerCase();
        
        const matchesSearch = searchTerm === '' || 
          job.title?.toLowerCase().includes(searchTermLower) ||
          job.company?.name?.toLowerCase().includes(searchTermLower) ||
          job.skillRequired?.some(skill => skill.toLowerCase().includes(searchTermLower)) ||
          job.description?.toLowerCase().includes(searchTermLower) ||
          false;
        
        const matchesIndustry = !filters.industry || job.industry === filters.industry;
        const matchesType = !filters.type || job.jobtype === filters.type;
        const matchesExperience = !filters.experience || job.experienceLevel === filters.experience;
        const matchesLocation = !filters.location || job.location === filters.location;
        const matchesEmploymentType = !filters.employmentType || 
          job.employmentType === filters.employmentType;

        return matchesSearch && matchesIndustry && matchesType && 
               matchesExperience && matchesLocation && matchesEmploymentType;
      });
      
      setFilteredJobs(filtered);
    }
  }, [allJobs, searchTerm, filters]);

  useEffect(() => {
    console.log('Current filters:', filters);
    console.log('Available industries:', industries);
    console.log('Filtered jobs:', filteredJobs);
  }, [filters, industries, filteredJobs]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setVisibleJobs(6);
  };

  const handleFilterChange = (category, value) => {
    console.log(`Changing ${category} to:`, value);
    setFilters(prev => ({ ...prev, [category]: value }));
  };

  const loadMoreJobs = () => {
    setVisibleJobs(prev => prev + 6)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-center"
          >
            Discover Your Dream Job
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-center mb-8 text-blue-100"
          >
            Find the perfect opportunity to advance your career
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for jobs, skills, or companies..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 pl-12 sm:pl-14 pr-24 sm:pr-32 rounded-full bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border-2 border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent shadow-lg text-sm sm:text-base transition-all duration-300 text-white placeholder-white placeholder-opacity-75"
              />
              <Search className="absolute left-4 sm:left-5 top-3 sm:top-4 text-white opacity-75" size={20} />
              <button 
                onClick={() => setSearchTerm(searchTerm)}
                className="absolute right-2 top-2 bg-white text-blue-600 py-1 sm:py-2 px-4 sm:px-6 rounded-full hover:bg-opacity-90 transition-colors duration-300 text-sm sm:text-base font-semibold"
              >
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <FilterDropdown
              label="Industry"
              options={industries}
              value={filters.industry}
              onChange={(value) => handleFilterChange('industry', value)}
            />
            <FilterDropdown
              label="Job Type"
              options={['Remote', 'On-site', 'Hybrid']}
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
            />
            <FilterDropdown
              label="Experience Level"
              options={['Entry', 'Mid', 'Senior', 'Lead', 'Executive']}
              value={filters.experience}
              onChange={(value) => handleFilterChange('experience', value)}
            />
            <FilterDropdown
              label="Employment Type"
              options={['full-time', 'part-time', 'contract', 'internship', 'freelance']}
              value={filters.employmentType}
              onChange={(value) => handleFilterChange('employmentType', value)}
            />
            <FilterDropdown
              label="Location"
              options={locations}
              value={filters.location}
              onChange={(value) => handleFilterChange('location', value)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({
                industry: '',
                type: '',
                experience: '',
                location: '',
                employmentType: ''
              })}
              className="text-blue-600 hover:text-blue-800"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredJobs.slice(0, visibleJobs).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>

        {/* Load More Button */}
        {filteredJobs.length > visibleJobs && (
          <div className="text-center mb-16">
            <button
              onClick={loadMoreJobs}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Show More
            </button>
          </div>
        )}

        {/* No Results Message */}
        {filteredJobs.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 my-16 bg-white p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200 max-w-3xl mx-auto"
          >
            <Search size={48} className="mx-auto text-blue-500 mb-4" />
            <p className="text-lg sm:text-xl font-semibold mb-2">No jobs found matching your criteria.</p>
            <p className="text-base">Try adjusting your search or filters to find more opportunities.</p>
          </motion.div>
        )}
      </div>
      <div className="pb-12"></div>
      <Footer />
    </div>
  )
}

export default Jobs