import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const ApplyedJobs = () => {
  useGetAppliedJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const { allAppliedJobs } = useSelector(store => store.job);

  // Add fallback for undefined allAppliedJobs
  const filteredJobs = (allAppliedJobs || []).filter(job => {
    const matchesSearch = job.job?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || job.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.h1
            className="text-6xl font-extrabold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Applied Jobs
          </motion.h1>
        </div>
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg shadow-md w-full sm:w-1/2 focus:ring-2 focus:ring-purple-500 bg-white"
          />
          <div className="relative w-full sm:w-1/4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 p-3 w-full rounded-lg shadow-md focus:ring-2 focus:ring-purple-500 text-gray-700 bg-white"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableCaption>A list of your applied jobs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Job Role</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                filteredJobs.length <= 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      You haven't applied to any job yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredJobs.map((appliedJob) => (
                    <TableRow key={appliedJob._id}>
                      <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                      <TableCell>{appliedJob.job?.title}</TableCell>
                      <TableCell>{appliedJob.job?.company?.name}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>
                          {appliedJob.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )
              }
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ApplyedJobs;
