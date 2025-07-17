import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Briefcase, Edit2, Users, MoreHorizontal, AlertCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAllAdminJobs } from '@/redux/jobSlice';

const AdminJobsTable = ({ statusFilter, searchJobByText }) => {
    const { isLoading } = useGetAllAdminJobs();
    const { allAdminJobs = [] } = useSelector(store => store.job);
    const { user, token } = useSelector(store => store.auth);
    const [filterJobs, setFilterJobs] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('AdminJobsTable mounted:', {
            user: user?._id,
            jobsAvailable: allAdminJobs?.length > 0,
            isLoading
        });
    }, []);

    useEffect(() => {
        if (!allAdminJobs) {
            setFilterJobs([]);
            return;
        }

        const filteredJobs = allAdminJobs.filter((job) => {
            if (!job) return false;

            const matchesSearch = !searchJobByText || 
                job.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
                job.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

            // Check if company is active
            const isCompanyActive = job.company?.status === 'active';
            
            // If company is inactive, job should be inactive
            if (!isCompanyActive && job.status !== 'inactive') {
                updateJobStatus(job._id, 'inactive');
                return statusFilter === 'inactive';
            }

            return matchesSearch && matchesStatus;
        });

        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText, statusFilter]);

    const updateJobStatus = async (jobId, status) => {
        try {
            const response = await axios.patch(
                `${JOB_API_END_POINT}/${jobId}/status`,
                { status },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                }
            );

            if (response.data.success) {
                toast.success("Job status updated successfully");
                await refetchJobs();
            }
        } catch (error) {
            console.error('Error updating job status:', error);
            toast.error(error.response?.data?.message || "Failed to update job status");
        }
    };

    const refetchJobs = async () => {
        try {
            const response = await axios.get(`${JOB_API_END_POINT}/admin/jobs`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            if (response.data.success) {
                dispatch(setAllAdminJobs(response.data.jobs));
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error("Failed to refresh jobs list");
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-yellow-100 text-yellow-800",
            expired: "bg-red-100 text-red-800"
        };
        return `inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${statusConfig[status] || statusConfig.inactive}`;
    };

    if (!user) {
        return (
            <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                    <p className="text-sm text-gray-500">Please login to view jobs</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="text-sm text-gray-500">Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead>Job Details</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applicants</TableHead>
                        <TableHead>Posted Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.map((job) => (
                        <TableRow key={job._id} className="hover:bg-gray-50">
                            <TableCell>
                                <div className="space-y-1">
                                    <p className="font-medium text-gray-900">{job.title}</p>
                                    <p className="text-sm text-gray-500">{job.jobType}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <Briefcase className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">
                                            {job.company?.name}
                                        </span>
                                        {job.company?.status === 'inactive' && (
                                            <span className="text-xs text-red-500">
                                                Company Inactive
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge 
                                    variant={job.status === 'active' ? 'success' : 'secondary'}
                                    className={`${
                                        job.status === 'active' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {job.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-1">
                                    <Users className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {job.applications?.length || 0}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-gray-500">
                                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-56" align="end">
                                        <div className="space-y-1">
                                            <button
                                                onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
                                                className="w-full flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md group"
                                            >
                                                <Users className="mr-2 h-4 w-4 text-indigo-500 group-hover:text-indigo-600" />
                                                <div className="flex flex-col items-start">
                                                    <span>View Applicants</span>
                                                    <span className="text-xs text-gray-500">
                                                        {job.applications?.length || 0} total applications
                                                    </span>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => navigate(`/recruiter/jobs/create/${job._id}`)}
                                                className="w-full flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md group"
                                            >
                                                <Edit2 className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-600" />
                                                <span>Edit Job Details</span>
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                    {filterJobs?.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                                <div className="flex flex-col items-center text-gray-500">
                                    <Briefcase className="h-12 w-12 mb-2 text-gray-400" />
                                    <p className="text-lg font-medium">No jobs found</p>
                                    <p className="text-sm text-gray-500">
                                        {statusFilter !== 'all' 
                                            ? `No ${statusFilter} jobs found. Try changing the filter.`
                                            : 'Get started by posting a new job'}
                                    </p>
                                    <Button 
                                        onClick={() => navigate("/recruiter/jobs/create")}
                                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        Post New Job
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;
