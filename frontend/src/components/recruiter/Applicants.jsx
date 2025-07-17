import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { 
  ArrowLeft, Search, Filter, RefreshCw, 
  Users, CheckCircle, XCircle, Clock 
} from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";

const Applicants = () => {
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Calculate statistics
    const stats = {
        total: applicants?.applications?.length || 0,
        pending: applicants?.applications?.filter(app => app.status === 'pending').length || 0,
        accepted: applicants?.applications?.filter(app => app.status === 'accepted').length || 0,
        rejected: applicants?.applications?.filter(app => app.status === 'rejected').length || 0
    };

    const fetchAllApplicants = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(
                `${APPLICATION_API_END_POINT}/${params.id}/applicants`, 
                { withCredentials: true }
            );
            
            if (res.data.success) {
                dispatch(setAllApplicants(res.data.job));
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching applicants');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchAllApplicants();
        }
    }, [params.id, dispatch]);

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                {/* Header Section */}
                <div className="space-y-8">
                    <div className="flex flex-col gap-4">
                        <Button 
                            onClick={() => navigate(-1)}
                            variant="ghost" 
                            className="w-fit text-gray-600 hover:text-gray-900 -ml-2"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Jobs
                        </Button>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Applicants Overview
                                </h1>
                                <p className="text-gray-500">
                                    Manage and track all job applications
                                </p>
                            </div>
                            <Button
                                onClick={fetchAllApplicants}
                                variant="outline"
                                className="text-purple-600 hover:text-purple-700 border-purple-200 hover:border-purple-300"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh List
                            </Button>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100 rounded-xl">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Total Applicants</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-yellow-100 rounded-xl">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Pending Review</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-xl">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Accepted</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-100 rounded-xl">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Rejected</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Filters Section */}
                    <Card className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>

                    {/* Content Section */}
                    <Card className="overflow-hidden border-0 shadow-sm">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <div className="text-red-500 mb-2">{error}</div>
                                <Button 
                                    variant="outline" 
                                    onClick={fetchAllApplicants}
                                    className="mt-2"
                                >
                                    Try Again
                                </Button>
                            </div>
                        ) : (
                            <ApplicantsTable 
                                searchTerm={searchTerm} 
                                statusFilter={statusFilter} 
                                onRefresh={fetchAllApplicants}
                            />
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Applicants