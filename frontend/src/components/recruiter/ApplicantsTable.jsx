import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, CheckCircle, XCircle, Clock, FileText, Mail, Phone } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

const shortlistingStatus = [
    { label: "Accept", value: "Accepted", icon: CheckCircle, color: "text-green-600" },
    { label: "Reject", value: "Rejected", icon: XCircle, color: "text-red-600" }
];

const ApplicantsTable = ({ searchTerm, statusFilter, onRefresh }) => {
    const { applicants } = useSelector(store => store.application);

    const filteredApplicants = applicants?.applications?.filter(item => {
        const matchesSearch = searchTerm.toLowerCase() === '' || 
            item.applicant?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || 
            item.status.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/status/${id}/update`, 
                { status },
                { withCredentials: true }
            );
            
            if (res.data.success) {
                toast.success(res.data.message);
                onRefresh();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating status');
        }
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
            accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle },
            rejected: { color: "bg-red-100 text-red-800", icon: XCircle }
        };

        const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge variant="outline" className={`${config.color} flex items-center gap-1.5 px-2.5 py-1`}>
                <Icon className="h-3.5 w-3.5" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase() || '??';
    };

    if (!filteredApplicants?.length) {
        return (
            <div className="text-center py-12 px-4">
                <div className="text-gray-500 text-lg">
                    No applications found matching your criteria.
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50/50">
                        <TableHead>Applicant</TableHead>
                        <TableHead>Contact Information</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredApplicants.map((item) => (
                        <TableRow key={item._id} className="hover:bg-gray-50/50">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className="bg-purple-100 text-purple-700">
                                            {getInitials(item.applicant?.fullname)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900">
                                            {item.applicant?.fullname || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        {item.applicant?.email || 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                        <Phone className="h-4 w-4" />
                                        {item.applicant?.PhoneNumber || 'N/A'}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                {item.applicant?.resumeOriginalName ? (
                                    <a 
                                        className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700" 
                                        href={item.applicant.resume}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        <FileText className="h-4 w-4" />
                                        View Resume
                                    </a>
                                ) : (
                                    <span className="text-gray-400 flex items-center gap-1.5">
                                        <FileText className="h-4 w-4" />
                                        No Resume
                                    </span>
                                )}
                            </TableCell>
                            <TableCell>
                                {getStatusBadge(item.status)}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-gray-900">
                                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger>
                                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-2">
                                        {shortlistingStatus.map(({ label, value, icon: Icon, color }) => (
                                            <button
                                                key={value}
                                                onClick={() => statusHandler(value, item._id)}
                                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm
                                                         hover:bg-gray-100 rounded-lg transition-colors ${color}`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                {label} Candidate
                                            </button>
                                        ))}
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default ApplicantsTable