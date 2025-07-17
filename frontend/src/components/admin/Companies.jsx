import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  MoreVertical,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import LoadingSpinner from '../minicomponents/LoadingSpinner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import StatusToggle from '../shared/StatusToggle';

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Enhanced query with proper error handling
  const { data: companies, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-companies'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/api/v1/admin/companies', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch companies');
      }
      
      const data = await response.json();
      return data.companies;
    }
  });

  // Filter and search logic
  const filteredCompanies = React.useMemo(() => {
    if (!companies) return [];
    
    return companies.filter(company => {
      const matchesSearch = searchQuery.trim() === '' || 
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'all' || company.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [companies, searchQuery, filterStatus]);

  // Enhanced search handler with debounce
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Enhanced status toggle with modal update
  const handleStatusToggle = async (companyId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/companies/${companyId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus })
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      // Update the selected company if we're in the modal
      if (selectedCompany && selectedCompany._id === companyId) {
        setSelectedCompany({
          ...selectedCompany,
          status: newStatus
        });
      }

      toast.success(`Company ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Enhanced delete with modal
  const handleDeleteClick = (company) => {
    setSelectedCompany(company);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/companies/${selectedCompany._id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete company');
      }

      toast.success('Company deleted successfully');
      setShowDeleteDialog(false);
      refetch();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Enhanced view details
  const handleViewDetails = async (companyId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/companies/${companyId}`,
        { credentials: 'include' }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch company details');
      }
      
      const data = await response.json();
      setSelectedCompany(data.company);
      setShowDetailsDialog(true);
    } catch (error) {
      console.error('View details error:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header and Search/Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Companies Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search companies..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 w-full"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto border rounded-md px-3 py-2 bg-white hover:bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Companies Table with Results Summary */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Results Summary */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="text-sm text-gray-500">
            Showing {filteredCompanies.length} of {companies?.length || 0} companies
            {searchQuery && ` matching "${searchQuery}"`}
            {filterStatus !== 'all' && ` with status "${filterStatus}"`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[140px]">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={company.logo || '/company-placeholder.png'}
                        alt={company.name}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="lg:hidden text-sm text-gray-500">{company.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{company.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center">
                      <StatusToggle 
                        status={company.status}
                        onToggle={() => handleStatusToggle(company._id, company.status)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem onClick={() => handleViewDetails(company._id)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(company)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Company
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete {selectedCompany?.name}?</p>
            <p className="text-sm text-gray-500">
              This action cannot be undone. All associated data will be permanently removed.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Company Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[95%] max-w-[1200px] h-[85vh] p-0">
          <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-white z-10 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Company Details</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowDetailsDialog(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="h-[calc(85vh-4rem)] overflow-y-auto scrollbar-hide px-6 py-4">
              {/* Company Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedCompany.logo || '/company-placeholder.png'}
                    alt={selectedCompany.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{selectedCompany.name}</h3>
                    <p className="text-sm text-gray-500">{selectedCompany.location}</p>
                  </div>
                </div>
                <Badge variant={selectedCompany.status === 'active' ? 'success' : 'secondary'}>
                  {selectedCompany.status}
                </Badge>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Contact Information */}
                <div className="bg-gray-50/80 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Email</span>
                      <a href={`mailto:${selectedCompany.contactEmail}`} className="text-blue-600 hover:underline">
                        {selectedCompany.contactEmail}
                      </a>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Phone</span>
                      <span className="text-gray-900">{selectedCompany.contactPhone || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Website</span>
                      {selectedCompany.website ? (
                        <a 
                          href={selectedCompany.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      ) : (
                        <span className="text-gray-900">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Company Stats */}
                <div className="bg-gray-50/80 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Company Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Total Jobs Posted</span>
                      <span className="text-gray-900">{selectedCompany.jobsCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Member Since</span>
                      <span className="text-gray-900">
                        {new Date(selectedCompany.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Last Updated</span>
                      <span className="text-gray-900">
                        {new Date(selectedCompany.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              {selectedCompany.description && (
                <div className="bg-gray-50/80 rounded-lg p-5">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">About Company</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedCompany.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Companies; 