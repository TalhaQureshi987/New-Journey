import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminJobsTable from './AdminJobsTable';
import { setSearchJobByText } from '@/redux/jobSlice';
import { Briefcase, Plus, Search, Filter } from 'lucide-react';
import { Card } from '../ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

const AdminJobs = () => {
    const [input, setInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { allAdminJobs } = useSelector(store => store.job);

    // Calculate stats
    const stats = {
        total: allAdminJobs?.length || 0,
        active: allAdminJobs?.filter(job => job.status === 'active')?.length || 0,
        inactive: allAdminJobs?.filter(job => job.status === 'inactive')?.length || 0,
        expired: allAdminJobs?.filter(job => job.status === 'expired')?.length || 0
    };

    useEffect(() => {
        dispatch(setSearchJobByText(input));
    }, [input, dispatch]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Briefcase className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Jobs</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Briefcase className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-xl">
                                <Briefcase className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Inactive Jobs</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-xl">
                                <Briefcase className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Expired Jobs</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.expired}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-gray-900">Job Listings</h1>
                            <p className="text-gray-500">
                                Manage and track all your job postings
                            </p>
                        </div>
                        <Button 
                            onClick={() => navigate("/recruiter/jobs/create")}
                            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 mt-4 sm:mt-0"
                        >
                            <Plus className="h-4 w-4" />
                            Post New Job
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                className="pl-10 w-full bg-gray-50 border-gray-200"
                                placeholder="Search jobs by title or company..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <AdminJobsTable 
                        statusFilter={statusFilter} 
                        searchJobByText={input}
                    />
                </Card>
            </div>
        </div>
    );
};

export default AdminJobs;