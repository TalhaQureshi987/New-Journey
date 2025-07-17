import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Briefcase, Building2, Loader2, MapPin, GraduationCap, Clock, Users } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector, useDispatch } from 'react-redux';
import { setSingleJob } from '@/redux/jobSlice';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const PostJob = () => {
    const { id: jobId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { singleJob } = useSelector((store) => store.job);
    const { companies } = useSelector((store) => store.company);
    const { user } = useSelector((store) => store.auth);
    const [loading, setLoading] = useState(false);
    const [industries, setIndustries] = useState([]);

    const [input, setInput] = useState({
        title: "",
        description: "",
        companyId: "",
        skillRequired: "",
        educationRequired: "High School",
        salary: "",
        employmentType: "full-time",
        experienceLevel: "Entry",
        location: "",
        jobtype: "Onsite",
        position: "",
    });

    useEffect(() => {
        const fetchJob = async () => {
            if (jobId) {
                try {
                    setLoading(true);
                    const response = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { 
                        withCredentials: true 
                    });
                    if (response.data.success) {
                        dispatch(setSingleJob(response.data.job));
                    } else {
                        toast.error("Failed to fetch job details");
                        navigate('/recruiter/jobs');
                    }
                } catch (error) {
                    console.error("Failed to fetch job data:", error);
                    toast.error(error.response?.data?.message || "Failed to fetch job details");
                    navigate('/recruiter/jobs');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchJob();
    }, [jobId, dispatch, navigate]);

    useEffect(() => {
        if (singleJob && jobId) {
            setInput({
                title: singleJob.title || "",
                description: singleJob.description || "",
                companyId: singleJob.company._id || "",
                skillRequired: singleJob.skillRequired?.join(", ") || "",
                educationRequired: singleJob.educationRequired || "",
                salary: singleJob.salary || "",
                employmentType: singleJob.employmentType || "full-time",
                experienceLevel: singleJob.experienceLevel || "Entry",
                location: singleJob.location || "",
                industry: singleJob.industry || "",
                jobtype: singleJob.jobtype || "Onsite",
                position: singleJob.position || "",
            });
        }
    }, [singleJob, jobId]);

    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/v1/industry', {
                    withCredentials: true
                });
                if (response.data.success) {
                    setIndustries(response.data.data);
                    console.log('Fetched industries:', response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch industries:", error);
                toast.error("Failed to load industries");
            }
        };
        fetchIndustries();
    }, []);

    useEffect(() => {
        console.log('Current Redux State:', {
            companies,
            user,
            filteredCompanies: companies?.filter(company => 
                company.status === 'active' && 
                String(company.user) === String(user?._id)
            )
        });
    }, [companies, user]);

    useEffect(() => {
        console.log('Redux State:', {
            companies,
            user,
            companiesArray: Array.isArray(companies),
            userCompanies: companies?.filter(c => c.user === user?._id)
        });
    }, [companies, user]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        setInput({ ...input, companyId: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!input.title.trim() || !input.companyId) {
            toast.error("Job title and company are required");
            return;
        }

        const jobData = {
            ...input,
            skillRequired: input.skillRequired.split(",").map(skill => skill.trim()),
        };

        try {
            setLoading(true);
            const endpoint = jobId 
                ? `${JOB_API_END_POINT}/update/${jobId}`
                : `${JOB_API_END_POINT}/post`;
                
            const response = await axios.post(endpoint, jobData, { 
                withCredentials: true 
            });

            if (response.data.success) {
                toast.success(response.data.message);
                dispatch(setSingleJob(null));
                navigate("/recruiter/jobs");
            } else {
                toast.error(response.data.message || "Failed to save job");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred while saving the job");
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = (e) => {
        e.preventDefault();
        navigate('/recruiter/jobs');
    };

    const debugCompanyFilter = (companies, userId) => {
        console.log('Detailed Company Debug:');
        companies?.forEach(company => {
            console.log({
                companyName: company.name,
                companyUserId: company.user,
                companyUserIdType: typeof company.user,
                currentUserId: userId,
                currentUserIdType: typeof userId,
                isMatch: String(company.user) === String(userId),
                status: company.status
            });
        });
    };

    const renderCompanySelect = () => {
        debugCompanyFilter(companies, user?._id);

        const userCompanies = companies?.filter(company => {
            const isUserCompany = String(company.user) === String(user?._id);
            const isActive = company.status === 'active';
            
            console.log(`Company ${company.name}:`, {
                companyUser: company.user,
                userId: user?._id,
                isUserMatch: isUserCompany,
                status: company.status,
                isActive
            });
            
            return isActive && isUserCompany;
        });

        return (
            <div className="space-y-2">
                <Label className="text-gray-700">Company</Label>
                <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Select 
                        onValueChange={selectChangeHandler} 
                        value={input.companyId}
                    >
                        <SelectTrigger className="w-full pl-10">
                            <SelectValue placeholder="Select a Company" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {companies
                                    ?.filter(company => {
                                        const isMatch = 
                                            company.user === user?._id || // Direct comparison
                                            String(company.user) === String(user?._id) || // String comparison
                                            company?.userId?.toString() === user?._id.toString(); // toString comparison
                                        
                                        return company.status === 'active' && isMatch;
                                    })
                                    .map((company) => (
                                        <SelectItem
                                            key={company._id}
                                            value={company._id}
                                            className="p-2 hover:bg-purple-50 hover:text-purple-600"
                                        >
                                            {company.name}
                                        </SelectItem>
                                    ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {(!userCompanies || userCompanies.length === 0) && (
                    <div className="mt-2">
                        <Button 
                            type="button"
                            variant="outline" 
                            onClick={() => navigate('/recruiter/companies/create')}
                            className="w-full text-purple-600 hover:bg-purple-50"
                        >
                            Register a new company
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackClick}
                    className="mb-8 text-gray-600 hover:text-gray-900 flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Jobs
                </Button>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center justify-center mb-8">
                        <div className="bg-indigo-100 rounded-full p-4">
                            <Briefcase className="h-8 w-8 text-indigo-600" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        {jobId ? "Edit Job Posting" : "Create New Job Posting"}
                    </h1>

                    <form onSubmit={submitHandler} className="space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-700">Job Title</Label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            type="text"
                                            name="title"
                                            value={input.title}
                                            onChange={changeEventHandler}
                                            className="pl-10"
                                            placeholder="e.g., Senior Software Engineer"
                                        />
                                    </div>
                                </div>

                                {renderCompanySelect()}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700">Job Description</Label>
                                <Textarea
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    className="min-h-[150px]"
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                />
                            </div>
                        </div>

                        {/* Requirements Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-700">Required Skills</Label>
                                    <Input
                                        type="text"
                                        name="skillRequired"
                                        value={input.skillRequired}
                                        onChange={changeEventHandler}
                                        placeholder="e.g., React, Node.js, MongoDB"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700">Education Level</Label>
                                    <Select 
                                        value={input.educationRequired} 
                                        onValueChange={(value) => setInput(prev => ({ ...prev, educationRequired: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select education level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="High School">High School</SelectItem>
                                            <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                                            <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                                            <SelectItem value="Doctorate">Doctorate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700">Experience Level</Label>
                                    <Select 
                                        value={input.experienceLevel} 
                                        onValueChange={(value) => setInput(prev => ({ ...prev, experienceLevel: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select experience level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Entry">Entry Level</SelectItem>
                                            <SelectItem value="Mid">Mid Level</SelectItem>
                                            <SelectItem value="Senior">Senior Level</SelectItem>
                                            <SelectItem value="Lead">Lead</SelectItem>
                                            <SelectItem value="Executive">Executive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Job Details Section */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-700">Salary</Label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            name="salary"
                                            value={input.salary}
                                            onChange={changeEventHandler}
                                            className="pr-16"
                                            placeholder="e.g., 12.5"
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            LPA
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700">Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            type="text"
                                            name="location"
                                            value={input.location}
                                            onChange={changeEventHandler}
                                            className="pl-10"
                                            placeholder="e.g., New York, NY"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700">Employment Type</Label>
                                    <Select 
                                        value={input.employmentType} 
                                        onValueChange={(value) => setInput(prev => ({ ...prev, employmentType: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select employment type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full-time">Full Time</SelectItem>
                                            <SelectItem value="part-time">Part Time</SelectItem>
                                            <SelectItem value="contract">Contract</SelectItem>
                                            <SelectItem value="internship">Internship</SelectItem>
                                            <SelectItem value="freelance">Freelance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700">Work Type</Label>
                                    <Select 
                                        value={input.jobtype} 
                                        onValueChange={(value) => setInput(prev => ({ ...prev, jobtype: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select work type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Onsite">Onsite</SelectItem>
                                            <SelectItem value="Remote">Remote</SelectItem>
                                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700">Industry</Label>
                                    <Select 
                                        value={input.industry}
                                        onValueChange={(value) => setInput(prev => ({ ...prev, industry: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {industries && industries.length > 0 ? (
                                                industries
                                                    .filter(industry => industry.status === 'active')
                                                    .map((industry) => (
                                                        <SelectItem 
                                                            key={industry._id} 
                                                            value={industry.name || industry._id}
                                                        >
                                                            {industry.name}
                                                        </SelectItem>
                                                    ))
                                            ) : (
                                                <SelectItem value="no-industries" disabled>
                                                    No industries available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-700">Number of Positions</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                        <Input
                                            type="number"
                                            name="position"
                                            value={input.position}
                                            onChange={changeEventHandler}
                                            className="pl-10"
                                            placeholder="e.g., 2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[150px]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {jobId ? "Updating..." : "Posting..."}
                                    </>
                                ) : (
                                    jobId ? "Update Job" : "Post Job"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
