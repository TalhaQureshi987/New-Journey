import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Building2, Edit2, MoreHorizontal, Plus, Search, Globe } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Card } from '../ui/card';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';

const CompaniesTable = () => {
    useGetAllCompanies();
    const { companies, error, loading } = useSelector(state => state.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const [input, setInput] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        const filteredCompany = companies?.filter((company) => {
            const matchesSearch = !input || company?.name?.toLowerCase().includes(input.toLowerCase());
            const matchesStatus = statusFilter === 'all' || company?.status === statusFilter;
            return matchesSearch && matchesStatus;
        }) || [];
        setFilterCompany(filteredCompany);
    }, [companies, input, statusFilter]);

    // Stats calculation
    const stats = {
        total: companies?.length || 0,
        active: companies?.filter(company => company.status === 'active')?.length || 0,
        inactive: companies?.filter(company => company.status === 'inactive')?.length || 0
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: "inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800",
            inactive: "inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-medium text-red-800"
        };
        return statusConfig[status] || statusConfig.inactive;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                    <Card className="p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="space-y-3">
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className="h-20 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                    <Card className="p-6 text-center">
                        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading companies</h3>
                        <p className="mt-1 text-sm text-gray-500">{error}</p>
                        <Button
                            className="mt-4"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-xl">
                                <Building2 className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Companies</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <Building2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Companies</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-xl">
                                <Building2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Inactive Companies</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div className="space-y-1 mb-4 sm:mb-0">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Companies
                            </h1>
                            <p className="text-sm text-gray-500">
                                Manage and track all registered companies
                            </p>
                        </div>
                        <Button 
                            onClick={() => navigate("/recruiter/companies/create")}
                            className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Company
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                className="pl-10 w-full bg-gray-50 border-gray-200"
                                placeholder="Search companies..."
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
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-[100px]">Logo</TableHead>
                                    <TableHead>Company Details</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filterCompany?.map((company) => (
                                    <TableRow key={company._id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={company.logo} alt={company.name} />
                                                <AvatarFallback className="bg-purple-100 text-purple-700">
                                                    <Building2 className="h-6 w-6" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="font-medium text-gray-900">{company.name}</p>
                                                <a 
                                                    href={company.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                                                >
                                                    <Globe className="h-3 w-3" />
                                                    {company.website}
                                                </a>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800">
                                                {company.location || 'Not specified'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={getStatusBadge(company.status)}>
                                                {company.status?.charAt(0).toUpperCase() + company.status?.slice(1)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-40" align="end">
                                                    <button
                                                        onClick={() => company.status === 'active' && navigate(`/recruiter/companies/${company._id}`)}
                                                        className={`w-full flex items-center px-2 py-2 text-sm rounded-md
                                                            ${company.status === 'active' 
                                                                ? 'text-gray-700 hover:bg-gray-100 cursor-pointer' 
                                                                : 'text-gray-400 cursor-not-allowed'}`}
                                                        disabled={company.status !== 'active'}
                                                    >
                                                        <Edit2 className="mr-2 h-4 w-4" />
                                                        Edit Details
                                                    </button>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filterCompany?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex flex-col items-center text-gray-500">
                                                <Building2 className="h-12 w-12 mb-2" />
                                                <p className="text-lg font-medium">No companies found</p>
                                                <p className="text-sm">Try adjusting your search or filters</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CompaniesTable;
