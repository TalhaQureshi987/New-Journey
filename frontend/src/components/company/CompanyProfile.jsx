import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import { motion } from 'framer-motion';
import { MapPin, Globe, Mail, Phone, Users, Briefcase, Building2 } from 'lucide-react';
import JobCard from '../shared/JobCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { toast } from 'react-hot-toast';

const CompanyProfile = () => {
    const { id } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/v1/company/get/${id}`);
                if (response.data.success) {
                    setCompany(response.data.company);
                    // Fetch company jobs
                    const jobsResponse = await axios.get(`http://localhost:3000/api/v1/company/${id}/jobs`);
                    if (jobsResponse.data.success) {
                        setJobs(jobsResponse.data.jobs);
                    }
                }
            } catch (error) {
                console.error('Error fetching company details:', error);
                toast.error('Failed to fetch company details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCompanyDetails();
        }
    }, [id]);

    if (loading) {
        return <CompanyProfileSkeleton />;
    }

    if (!company) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900">Company not found</h2>
                        <p className="mt-2 text-gray-600">The company you're looking for doesn't exist or has been removed.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                {/* Company Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md p-6 mb-8"
                >
                    <div className="flex items-center gap-6">
                        <img 
                            src={company.logo || "/company-placeholder.png"}
                            alt={company.name}
                            className="w-24 h-24 rounded-lg object-contain bg-gray-50 p-2"
                            onError={(e) => {
                                e.target.src = "/company-placeholder.png";
                                e.target.onerror = null;
                            }}
                        />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {company.name || "Company Name Not Available"}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600">
                                {company.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{company.location}</span>
                                    </div>
                                )}
                                {company.website && (
                                    <a 
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                                    >
                                        <Globe className="w-4 h-4" />
                                        <span>Website</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs Section */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-white p-1 rounded-lg shadow-sm">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
                        <TabsTrigger value="about">About</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-xl shadow-md p-6"
                            >
                                <h2 className="text-xl font-semibold mb-4">Company Information</h2>
                                <div className="space-y-4">
                                    {company.industry && (
                                        <InfoItem icon={Building2} label="Industry" value={company.industry} />
                                    )}
                                    {company.size && (
                                        <InfoItem icon={Users} label="Company Size" value={company.size} />
                                    )}
                                    {company.contactEmail && (
                                        <InfoItem icon={Mail} label="Contact Email" value={company.contactEmail} />
                                    )}
                                    {company.contactPhone && (
                                        <InfoItem icon={Phone} label="Contact Phone" value={company.contactPhone} />
                                    )}
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-xl shadow-md p-6"
                            >
                                <h2 className="text-xl font-semibold mb-4">Recent Job Postings</h2>
                                <div className="space-y-4">
                                    {jobs.length > 0 ? (
                                        jobs.slice(0, 3).map(job => (
                                            <JobCard key={job._id} job={job} compact />
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No job postings available</p>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </TabsContent>

                    <TabsContent value="jobs">
                        <div className="space-y-6">
                            {jobs.length > 0 ? (
                                jobs.map(job => (
                                    <JobCard key={job._id} job={job} />
                                ))
                            ) : (
                                <div className="text-center py-8 bg-white rounded-xl shadow-md">
                                    <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs available</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        This company hasn't posted any jobs yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="about">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-xl shadow-md p-6"
                        >
                            <h2 className="text-xl font-semibold mb-4">About {company.name}</h2>
                            {company.description ? (
                                <p className="text-gray-600 whitespace-pre-line">{company.description}</p>
                            ) : (
                                <p className="text-gray-500">No company description available.</p>
                            )}
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }) => {
    if (!value) return null;
    return (
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-400" />
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-gray-900">{value}</p>
            </div>
        </div>
    );
};

const CompanyProfileSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                <Skeleton className="h-40 rounded-xl mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-64 rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile; 