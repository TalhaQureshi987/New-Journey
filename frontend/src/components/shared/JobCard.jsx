import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Briefcase, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { formatDistanceToNow } from 'date-fns';

const JobCard = ({ job, compact = false }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/jobdescription/${job?._id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-lg shadow-md hover:shadow-lg 
                transition-all duration-300 border border-gray-200 cursor-pointer 
                ${compact ? 'p-4' : 'p-6'}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
        >
            <div className="flex flex-col gap-4">
                {/* Job Title and Badge */}
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
                            {job.title}
                        </h3>
                        {/* <p className="text-sm text-gray-600">{job.company?.name || 'Unknown Company'}</p> */}
                    </div>
                    <Badge
                        variant={job.type === 'Full Time' ? 'default' : 'outline'}
                        className="text-xs"
                    >
                        {job.jobtype}
                    </Badge>
                </div>

                {/* Job Details */}
                {!compact && (
                    <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span>{job.location || 'Remote'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-green-500" />
                            <span>{job.salary ? `${job.salary} LPA` : 'Not Disclosed'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-yellow-500" />
                            <span>{job.experienceLevel || 'Any Experience'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                        </div>
                    </div>
                )}

                {/* Skills */}
                {!compact && job.skillRequired && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {job.skillRequired.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-600">
                                {skill}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default JobCard;
