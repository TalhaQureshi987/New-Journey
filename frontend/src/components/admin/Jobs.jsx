import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminHeader from './components/AdminHeader';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import StatusToggle from '../shared/StatusToggle';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [selectedStatus, sortBy]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/jobs?status=${selectedStatus}&sort=${sortBy}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      
      if (response.ok) {
        setJobs(data.jobs);
        setTotalJobs(data.total);
      } else {
        toast.error(data.message || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/job/${jobId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        toast.success(`Job status updated to ${newStatus}`);
        fetchJobs();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteJob = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/job/${selectedJobId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Job deleted successfully');
        fetchJobs();
        setShowDeleteDialog(false);
      } else {
        toast.error(data.message || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const handleViewDetails = async (jobId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/job/${jobId}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      
      if (response.ok) {
        setSelectedJob(data.job);
        setShowDetailsDialog(true);
      } else {
        toast.error(data.message || 'Failed to fetch job details');
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to fetch job details');
    }
  };

  const handleStatusToggle = async (jobId) => {
    try {
      const job = jobs.find(j => j._id === jobId);
      if (!job) return;

      const newStatus = job.status === 'active' ? 'inactive' : 'active';

      await handleStatusChange(jobId, newStatus);
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        title="Jobs Management"
        subtitle="Manage and monitor all job postings"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto border rounded-lg px-3 py-2 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto border rounded-lg px-3 py-2 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 sm:px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted Date
                  </th>
                  <th className="px-4 py-3 sm:px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">{job.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={job.company?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company?.name || 'Company')}&background=random`}
                            alt={job.company?.name}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company?.name || 'Company')}&background=random`;
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {job.company?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <StatusToggle 
                          status={job.status}
                          onToggle={() => handleStatusToggle(job._id)}
                          disabled={isLoading}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(job._id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                        onClick={() => {
                          setSelectedJobId(job._id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing {filteredJobs.length} of {totalJobs} jobs
          </p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this job? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteJob}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Updated Job Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="w-[95%] max-w-[1200px] h-[85vh] p-0 bg-white rounded-lg">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="text-lg font-semibold">Job Details</DialogTitle>
          </DialogHeader>
          
          {selectedJob && (
            <div className="h-[calc(85vh-80px)] overflow-y-auto scrollbar-hide px-6 py-4">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedJob.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <img
                      className="h-7 w-7 rounded-full"
                      src={selectedJob.company?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedJob.company?.name || 'Company')}`}
                      alt={selectedJob.company?.name}
                    />
                    <span className="text-sm text-gray-600">{selectedJob.company?.name}</span>
                  </div>
                </div>
                <Badge variant={selectedJob.status === 'active' ? 'success' : 'secondary'}>
                  {selectedJob.status}
                </Badge>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                {/* Job Details Card */}
                <div className="bg-gray-50/80 rounded-lg p-5 h-fit">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Job Details</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Employment Type', value: selectedJob.employmentType },
                      { label: 'Job Type', value: selectedJob.jobtype },
                      { label: 'Location', value: selectedJob.location },
                      { label: 'Salary', value: `${selectedJob.salary?.toLocaleString()} LPA` },
                      { label: 'Experience Level', value: selectedJob.experienceLevel },
                      { label: 'Education', value: selectedJob.educationRequired },
                      { label: 'Positions', value: selectedJob.position }
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">{label}</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Info Card */}
                <div className="bg-gray-50/80 rounded-lg p-5 h-fit">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Additional Information</h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Industry', value: selectedJob.industry },
                      { label: 'Applications', value: selectedJob.applications?.length || 0 },
                      { label: 'Posted Date', value: new Date(selectedJob.createdAt).toLocaleDateString() },
                      { label: 'Last Updated', value: new Date(selectedJob.updatedAt).toLocaleDateString() }
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-medium">{label}</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-gray-50/80 rounded-lg p-5 mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Description</h4>
                <div className="text-sm text-gray-600 leading-relaxed">
                  {selectedJob.description}
                </div>
              </div>

              {/* Skills Section */}
              <div className="bg-gray-50/80 rounded-lg p-5">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skillRequired?.map((skill, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="bg-white/90 text-xs font-medium px-3 py-1"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add this CSS to your global styles or component */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Jobs;