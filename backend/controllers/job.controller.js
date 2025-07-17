import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

// Move this function to the top of the file
const updateExpiredJobs = async() => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        await Job.updateMany({
            createdAt: { $lt: thirtyDaysAgo },
            status: 'active'
        }, {
            $set: { status: 'expired' }
        });
    } catch (error) {
        console.error("Error updating expired jobs:", error);
    }
};

// Post a new job
export const postJob = async(req, res) => {
    try {
        // Destructure fields from the request body
        const {
            title,
            description,
            skillRequired,
            companyName,
            salary,
            location,
            jobtype,
            experienceLevel,
            employmentType,
            educationRequired,
            industry,
            position,
            companyId,
        } = req.body;

        const userId = req.user._id; // Admin user ID

        console.log(req.body);

        // Validate required fields
        if (!title || !description || !salary || !jobtype || !location || !experienceLevel || !employmentType || !educationRequired || !position || !companyId) {
            return res.status(400).json({
                message: "Some required fields are missing",
                success: false,
            });
        }

        // Deduct job posting credit
        // const subscription = req.subscription;
        // subscription.jobPostingCredits -= 1;
        // subscription.usageHistory.push({
        //     action: 'Job Posted',
        //     type: 'debit',
        //     credits: 1,
        //     date: new Date()
        // });
        // await subscription.save();

        // Calculate expiry date (7 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        // Create the job using the provided data
        const job = await Job.create({
            title,
            description,
            companyName,
            skillRequired, // Array of skills
            salary: Number(salary),
            location,
            jobtype,
            experienceLevel, // Ensure experienceLevel is a valid string (e.g., "Entry", "Mid")
            employmentType, // Ensure employmentType is a valid string (e.g., "full-time")
            educationRequired, // Bachelor's, Master's, etc.
            industry, // Optional
            position: Number(position),
            company: companyId,
            created_by: userId, // Admin who created the job
            expiryDate, // Add expiry date
            status: 'active' // Start as active
        });

        // Schedule job status update
        setTimeout(async() => {
            try {
                const expiredJob = await Job.findById(job._id);
                if (expiredJob && expiredJob.status === 'active') {
                    expiredJob.status = 'expired';
                    await expiredJob.save();
                    console.log(`Job ${job._id} expired automatically`);
                }
            } catch (error) {
                console.error('Error updating expired job:', error);
            }
        }, 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds

        return res.status(201).json({
            message: "New job created successfully",
            job,
            success: true,
            // creditsRemaining: subscription.jobPostingCredits
        });
    } catch (error) {
        console.error("Error posting job:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const updateJob = async(req, res) => {
    try {
        // Get job ID from the request parameters
        const { id: jobId } = req.params;
        // console.log(jobId);


        // Destructure updatable fields from the request body
        const {
            title,
            description,
            skillRequired,
            companyName,
            salary,
            location,
            jobtype,
            experienceLevel,
            employmentType,
            educationRequired,
            industry,
            position,
            benefits,
            companyId
        } = req.body;

        // Validate required fields for updating a job
        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required",
                success: false
            });
        }

        // Find the job by ID
        const job = await Job.findById(jobId);

        // Check if the job exists
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Update only the fields that are provided in the request body
        if (title) job.title = title;
        if (description) job.description = description;
        if (skillRequired) job.skillRequired = skillRequired; // Should be an array of skills
        if (companyName) job.companyName = companyName;
        if (salary) job.salary = Number(salary);
        if (location) job.location = location;
        if (jobtype) job.jobtype = jobtype;
        if (experienceLevel) job.experienceLevel = experienceLevel; // Ensure it's a valid string
        if (employmentType) job.employmentType = employmentType; // Ensure it's a valid string
        if (educationRequired) job.educationRequired = educationRequired;
        if (industry) job.industry = industry;
        if (position) job.position = Number(position);
        if (benefits) job.benefits = benefits; // Should be an array of benefits
        if (companyId) job.company = companyId;

        // Save the updated job
        await job.save();

        return res.status(200).json({
            message: "Job updated successfully",
            job,
            success: true
        });
    } catch (error) {
        console.error("Error updating job:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get all jobs (public route)
export const getAllJobs = async(req, res) => {
    try {
        // First update any expired jobs
        await updateExpiredJobs();

        // const recruiterId = req.user._id;
        // const jobs = await Job.find({ recruiter: recruiterId })
        // Fetch all active jobs without requiring user authentication
        const jobs = await Job.find({ status: 'active' })
            .populate("company")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            jobs,
            message: "Jobs fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get job by ID (for students)
export const getJobById = async(req, res) => {
    try {
        const jobId = req.params._id;

        // Find job by ID
        const job = await Job.findById(jobId).populate("company");

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        return res.status(200).json({
            job,
            applicantCount: job.applications.length,
            success: true
        });


    } catch (error) {
        console.error("Error fetching job:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get all jobs created by the admin
export const getAdminJobs = async(req, res) => {
    try {
        const userId = req.user._id;
        console.log('Fetching jobs for user:', userId);

        const jobs = await Job.find({ created_by: userId })
            .populate('company')
            .sort({ createdAt: -1 });

        console.log('Found jobs:', {
            count: jobs.length,
            jobs: jobs.map(job => ({
                id: job._id,
                title: job.title,
                company: job.company ? job.company.name : null,
                status: job.status
            }))
        });

        return res.status(200).json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch jobs"
        });
    }
};

export const updateJobStatus = async(req, res) => {
    try {
        const { jobId } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['active', 'inactive', 'expired'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        // Update job status
        const updatedJob = await Job.findByIdAndUpdate(
            jobId, { status }, { new: true }
        ).populate('company');

        if (!updatedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Check company status without optional chaining
        const companyStatus = updatedJob.company && updatedJob.company.status;
        if (companyStatus === 'inactive' && status === 'active') {
            updatedJob.status = 'inactive';
            await updatedJob.save();

            return res.status(400).json({
                success: false,
                message: "Cannot activate job for inactive company"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job status updated successfully",
            job: updatedJob
        });

    } catch (error) {
        console.error("Error updating job status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update job status"
        });
    }
};

export const createJob = async(req, res) => {
    // existing code...
};

export const deleteJob = async(req, res) => {
    // existing code...
};