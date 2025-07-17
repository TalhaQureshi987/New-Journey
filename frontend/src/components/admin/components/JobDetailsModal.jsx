import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Clock, MapPin, DollarSign, Briefcase, Users } from 'lucide-react';

const JobDetailsModal = ({ job, isOpen, onClose }) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Job Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
              <p className="text-gray-500">{job.company}</p>
            </div>
            <Badge variant={job.status === 'active' ? 'success' : 'secondary'}>
              {job.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              {job.type}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-2" />
              {job.salary}
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-5 w-5 mr-2" />
              {job.experience}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Requirements</h3>
            <ul className="list-disc list-inside text-gray-600">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              {job.applicants} Applicants
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => handleEditJob(job._id)}>
                Edit Job
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal; 