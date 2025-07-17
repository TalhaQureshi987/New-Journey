import { useInView,motion } from "framer-motion";
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, Star, Users, Heart, ChevronDown, Zap } from 'lucide-react'
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const JobCard = ({ job }) => {
  if (!job) return null;

  const navigate = useNavigate();
  const  jobId = "";
  const [isSaved, setIsSaved] = useState(false)
      
  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave(job.id)
  }
  return(
      
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${job.featured ? 'border-t-4 border-blue-500' : ''}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <img 
              src={job.company?.logo || '/default-company-logo.png'} 
              alt={`${job.company?.name || 'Company'} logo`} 
              className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-gray-200"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{job.title || 'Untitled Position'}</h2>
              <p className="text-blue-600 font-semibold">{job.company?.name || 'Company Name'}</p>
            </div>
          </div>
          {job.featured && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center">
              <Zap size={12} className="mr-1" />
              Featured
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-2 text-blue-500" />
            <span>{job.location || 'Location not specified'}</span>
          </div>
          {job.salary && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign size={16} className="mr-2 text-green-500" />
              <span>{job.salary} LPA</span>
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <Briefcase size={16} className="mr-2 text-purple-500" />
            <span>{job.jobtype}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-red-500" />
            <span>{job.experienceLevel}</span>
          </div>
        </div>
        <div></div>
        <div className='flex gap-4'>
        <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Required Education:</h3>
            <div className="flex flex-wrap gap-2">
              {
            <span>{job.educationRequired}</span>
      
              }
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Employment Type:</h3>
            <div className="flex flex-wrap gap-2">
              {
            <span>{job.employmentType}</span>
      
              }
            </div>
          </div>
          </div>
        {job.skillRequired && job.skillRequired.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {job.skillRequired.map((skill, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Users size={16} className="mr-2 text-blue-500" />
            <span>{job.applications.length} applicants</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-2 text-green-500" />
            <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center">
          <button onClick={()=>navigate(`/jobdescription/${job?._id}`)} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center">
            <Briefcase size={18} className="mr-2" />
            View Details
          </button>
          {/* <button 
            onClick={handleSave}
            className={`p-2 rounded-full transition-colors duration-300 ${isSaved ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'} hover:bg-red-200`}
          >
            <Heart size={20} className={isSaved ? 'fill-current' : ''} />
          </button> */}
        </div>
      </div>
    </motion.div>
  )
}

export default JobCard;