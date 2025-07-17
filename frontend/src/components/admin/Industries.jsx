import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import LoadingSpinner from '../minicomponents/LoadingSpinner';

const API_URL = 'http://localhost:3000/api/v1/industry';

const Industries = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '' });
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [industryToDelete, setIndustryToDelete] = useState(null);

  // Fetch industries
  const { data: industries, isLoading } = useQuery({
    queryKey: ['industries'],
    queryFn: async () => {
      const response = await fetch(API_URL, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch industries');
      const data = await response.json();
      return data.data;
    }
  });

  // Add/Update industry mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      const url = selectedIndustry 
        ? `${API_URL}/${selectedIndustry._id}`
        : API_URL;
      
      const response = await fetch(url, {
        method: selectedIndustry ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['industries']);
      setShowDialog(false);
      setFormData({ name: '', description: '' });
      setSelectedIndustry(null);
      toast.success(selectedIndustry ? 'Industry updated successfully' : 'Industry added successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Delete industry mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete industry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['industries']);
      toast.success('Industry deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleEdit = (industry) => {
    setSelectedIndustry(industry);
    setFormData({
      name: industry.name,
      description: industry.description || ''
    });
    setShowDialog(true);
  };

  const handleDelete = (industry) => {
    setIndustryToDelete(industry);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (industryToDelete) {
      deleteMutation.mutate(industryToDelete._id);
      setShowDeleteDialog(false);
      setIndustryToDelete(null);
    }
  };

  const filteredIndustries = industries?.filter(industry => 
    industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    industry.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Industries Management</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button onClick={() => {
            setSelectedIndustry(null);
            setFormData({ name: '', description: '' });
            setShowDialog(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Industry
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {filteredIndustries?.length || 0} of {industries?.length || 0} industries
              {searchQuery && ` matching "${searchQuery}"`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredIndustries?.map((industry) => (
              <div 
                key={industry._id}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{industry.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(industry)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(industry)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {industry.description || 'No description provided'}
                </p>
                <div className="flex justify-between items-center">
                  <Badge variant={industry.status === 'active' ? 'success' : 'destructive'}>
                    {industry.status}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    Added: {new Date(industry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredIndustries?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900">No industries found</p>
              <p className="text-sm text-gray-500">
                {searchQuery 
                  ? 'Try adjusting your search query'
                  : 'Start by adding some industries'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedIndustry ? 'Edit Industry' : 'Add New Industry'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label>Industry Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  placeholder="Enter industry name"
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  placeholder="Enter description (optional)"
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? (
                  <LoadingSpinner className="h-4 w-4" />
                ) : selectedIndustry ? (
                  'Update Industry'
                ) : (
                  'Add Industry'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Industry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <p className="text-sm text-gray-600">
                Are you sure you want to delete{' '}
                <span className="font-semibold">{industryToDelete?.name}</span>?
                This action cannot be undone.
              </p>
            </div>
            {industryToDelete?.postedJobs?.length > 0 && (
              <div className="bg-yellow-50 p-3 rounded-md">
                <p className="text-sm text-yellow-800">
                  Warning: This industry has {industryToDelete.postedJobs.length} jobs associated with it.
                  Deleting it may affect these job listings.
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="sm:justify-start">
            <div className="flex gap-2 w-full justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setIndustryToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleteMutation.isLoading}
                className="gap-2"
              >
                {deleteMutation.isLoading ? (
                  <>
                    <LoadingSpinner className="h-4 w-4" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Industry
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Industries;