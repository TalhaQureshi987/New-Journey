import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Briefcase, MapPin, DollarSign, Clock, Users, 
  GraduationCap, Building, Calendar, Globe,
  CheckCircle, AlertCircle
} from 'lucide-react';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Button } from './ui/button';
import useGetSingleJob from '@/hooks/useGetSingleJob'
// import { setAllApplicants } from '@/redux/applicationSlice';.
// import useGetSingleJob from '@/hooks/useGetSingleJob';

const DEFAULT_COMPANY_LOGO = "https://www.svgrepo.com/show/499962/building.svg";

const JobInfoCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 sm:p-5 bg-white rounded-xl 
                 shadow-lg hover:shadow-xl transition-all duration-300 
                 transform hover:-translate-y-1 w-full overflow-hidden">
    <div className="flex-shrink-0 p-2.5 bg-purple-50 rounded-lg">
      <Icon className="w-5 h-5 text-purple-600" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
      <p className="text-base font-semibold text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

const SkillBadge = ({ skill }) => (
  <span className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 
                 rounded-lg text-sm font-medium transition-all duration-200
                 hover:bg-purple-100 max-w-full truncate">
    {skill}
  </span>
);

const JobDescription = () => {
  const params = useParams();
  const jobId = params._id;
  const dispatch = useDispatch();
  const { singleJob } = useSelector(store => store.job);
  const { user } = useSelector(store => store.auth);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // console.log(jobId);
  // console.log(user._id);
  
  

  useGetSingleJob(jobId);
  // Check if user has already applied
  useEffect(() => { 
    const checkApplicationStatus = async () => {
      try {
        if (!user?._id || !singleJob?._id) {
          setIsApplied(false);
          return;
        }

        // Check if user's ID exists in the applications array
        const hasApplied = Array.isArray(singleJob.applications) && 
          singleJob.applications.some(applicantId => applicantId === user._id);
        //  console.log( singleJob.applications.some(applicantId => applicantId === user.id));
        
        // Debug log
        console.log('Application Check:', {
          userId: user._id,
          applications: singleJob.applications,
          hasApplied
        });
        
        setIsApplied(hasApplied);
      } catch (error) {
        console.error("Error checking application status:", error);
        setIsApplied(false);
      }
    };

    checkApplicationStatus();
  }, [user?._id, singleJob]);

  // Enhanced apply job handler
  const applyJobHandler = async () => {
    if (!user) {
      toast.error('Please login to apply for this job');
      return;
    }

    if (isApplied) {
      toast.info('You have already applied for this job');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Applying for job:', jobId); // Debug log
      
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        {},
        { withCredentials: true }
      );
      
      if (res.data.success) {
        setIsApplied(true);
        
        // Update Redux store with new application
        const updatedJob = {
          ...singleJob,
          applications: [...(singleJob.applications || []), user._id]
        };
        dispatch(setSingleJob(updatedJob));
        
        toast.success('Successfully applied for the job!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to apply for the job';
      toast.error(errorMessage);
      console.error("Error applying for job:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced button render
  const renderApplyButton = () => {
    let buttonText = 'Apply Now';
    let buttonClass = 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white';
    let isDisabled = false;

    if (!user) {
      buttonText = 'Login to Apply';
      buttonClass = 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white';
    } else if (isApplied) {
      buttonText = 'Already Applied';
      buttonClass = 'bg-gray-200 text-gray-500 cursor-not-allowed';
      isDisabled = true;
    }

    if (isLoading) {
      buttonText = 'Applying...';
      isDisabled = true;
    }

    return (
      <Button
        onClick={applyJobHandler}
        disabled={isDisabled}
        className={`w-full py-6 text-lg font-semibold rounded-xl transition-all duration-300 ${buttonClass} 
          ${isDisabled ? '' : 'shadow-lg hover:shadow-purple-500/25'}`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {buttonText}
          </div>
        ) : buttonText}
      </Button>
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (jobId) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [jobId]);

  // useEffect(() => {
  //   const fetchSingleJob = async () => {
  //     if (!jobId) return;
      
  //     try {
  //       const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`);
  //       if (res.data.success) {
  //         dispatch(setSingleJob(res.data.job));
  //       } else {
  //         toast.error(res.data.message || 'Failed to fetch job details');
  //       }
  //     } catch (error) {
  //       console.error("Error fetching job:", error);
  //       toast.error(error.response?.data?.message || 'An error occurred while fetching the job');
  //     } 
  //   };

  //   fetchSingleJob();
  // }, [jobId, dispatch]);

  if (!singleJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Navbar />
        <div className="pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-xl mb-6"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-1/2"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const jobStatus = singleJob.status === 'active' ? (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
      <CheckCircle className="w-4 h-4 mr-1" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
      <AlertCircle className="w-4 h-4 mr-1" /> {singleJob.status.charAt(0).toUpperCase() + singleJob.status.slice(1)}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 pt-10 pb-20">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:16px]" />
      <Navbar />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 sm:py-16 lg:py-20">
            {/* Company Info Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              {/* Company Logo */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex-shrink-0
                            bg-white rounded-2xl shadow-lg p-3 transform hover:scale-105 
                            transition-all duration-300">
                <img
                  src={singleJob?.company?.logo || DEFAULT_COMPANY_LOGO}
                  alt={singleJob?.companyName}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Job Title and Company Info */}
              <div className="flex-grow space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white 
                             tracking-tight leading-tight">
                  {singleJob?.title}
                </h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <p className="text-lg text-white/90 font-medium">
                    {singleJob?.companyName}
                  </p>
                  <div className="hidden sm:block text-white/60">•</div>
                  <p className="text-white/80 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {singleJob?.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container - Adjusted positioning */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        {/* Key Information Cards - Removed negative margin, added z-index */}
        <div className="relative z-10 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <JobInfoCard 
              icon={DollarSign} 
              label="Annual Package" 
              value={`${singleJob?.salary} LPA`} 
            />
            <JobInfoCard 
              icon={Briefcase} 
              label="Work Type" 
              value={singleJob?.jobtype} 
            />
            <JobInfoCard 
              icon={Clock} 
              label="Experience Level" 
              value={singleJob?.experienceLevel} 
            />
            <JobInfoCard 
              icon={Users} 
              label="Total Applicants" 
              value={singleJob?.applications?.length || 0} 
            />
          </div>
        </div>

        {/* Content Grid - Fixed mobile layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          {/* Left Column - Job Description and Skills */}
          <div className="lg:col-span-2 space-y-6 w-full">
            {/* Job Description Card - Fixed overflow */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm w-full overflow-hidden">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose prose-sm sm:prose lg:prose-lg max-w-full 
                            text-gray-600 break-words overflow-wrap-anywhere">
                {singleJob?.description}
              </div>
            </div>

            {/* Required Skills Card */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm w-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {singleJob?.skillRequired?.map((skill, index) => (
                  <SkillBadge key={index} skill={skill} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Job Details */}
          <div className="lg:col-span-1 w-full">
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm sticky top-24 w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Job Details
              </h3>
              <div className="space-y-4">
                <DetailItem
                  icon={GraduationCap}
                  label="Education"
                  value={singleJob?.educationRequired}
                />
                <DetailItem
                  icon={Building}
                  label="Industry"
                  value={singleJob?.industry}
                />
                <DetailItem
                  icon={Calendar}
                  label="Posted Date"
                  value={formatDate(singleJob?.postedDate)}
                />
                <DetailItem
                  icon={Globe}
                  label="Employment Type"
                  value={singleJob?.employmentType}
                />
                
                {/* Apply Button */}
                <div className="pt-6">
                  {renderApplyButton()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

// Updated helper components with better mobile handling
const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 
                 hover:bg-purple-50 transition-colors duration-200 w-full overflow-hidden">
    <div className="flex-shrink-0">
      <Icon className="w-5 h-5 text-purple-600" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm text-gray-500 truncate">{label}</p>
      <p className="font-medium text-gray-900 truncate">{value}</p>
    </div>
  </div>
);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default JobDescription;
