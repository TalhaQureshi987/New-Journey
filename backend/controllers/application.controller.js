import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";


export const applyjob = async(req, res) => {
    try {
        const userId = req.user._id;
        const jobId = req.params.id;
        // console.log(jobId);
        // console.log(userId);



        console.log('Apply Job Request:', { userId, jobId });

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required",
                success: false
            });
        }

        if (!userId) {
            return res.status(400).json({
                message: "User must be logged in",
                success: false
            });
        }

        // Check if the job exists first
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        // Check if the user has already applied for this job
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            status: 'pending'
        });

        // Update job applications array
        if (!job.applications) {
            job.applications = [];
        }

        job.applications.push(newApplication.applicant);
        await job.save();

        console.log('Application created:', newApplication);

        return res.status(201).json({
            message: "Job applied successfully",
            success: true,
            application: newApplication
        });
    } catch (error) {
        console.error("Error in applyjob:", error);
        return res.status(500).json({
            message: "An error occurred while applying for the job",
            success: false,
            error: error.message
        });
    }
};


export const getAppliedJobs = async(req, res) => {
    try {
        const userId = req.user._id;
        // console.log(userId);

        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });

        if (!application) {
            return res.status(404).json({
                message: "No Applications",
                success: false
            })
        };
        return res.status(200).json({
            application,
            success: true
        })
    } catch (error) {
        console.log(error);

    }
}

export const getApplicants = async(req, res) => {
    try {
        const jobId = req.params.id;
        console.log('Fetching applicants for job:', jobId);

        // Find all applications for this job and populate applicant details
        const applications = await Application.find({ job: jobId })
            .populate({
                path: 'applicant',
                select: 'fullname email PhoneNumber createdAt profile resume resumeOriginalName'
            })
            .sort({ createdAt: -1 });

        if (!applications) {
            return res.status(404).json({
                message: "No applications found",
                success: false
            });
        }

        console.log('Found applications:', applications);

        return res.status(200).json({
            job: { applications }, // Maintain the same response structure
            success: true
        });

    } catch (error) {
        console.error("Error in getApplicants:", error);
        return res.status(500).json({
            message: "Error fetching applicants",
            success: false,
            error: error.message
        });
    }
}

export const updateStatus = async(req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({
                message: "Status is required",
                success: false
            })
        };

        //find the application by applicants

        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Application not found",
                success: false
            })
        }

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message: "Status updated successfully",
            success: true
        })

    } catch (error) {
        console.log(error);

    }
}

export const checkApplicationStatus = async(req, res) => {
    try {
        const userId = req._id;
        const jobId = req.params.jobId;

        if (!userId || !jobId) {
            return res.status(400).json({
                message: "User ID and Job ID are required",
                success: false
            });
        }

        // Check if an application exists for this user and job
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        return res.status(200).json({
            success: true,
            hasApplied: !!existingApplication // Convert to boolean
        });

    } catch (error) {
        console.error("Error checking application status:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const getApplications = async(req, res) => {
    try {
        const userId = req._id;

        const applications = await Application.find({ applicant: userId })
            .populate('job')
            .select('job status createdAt')
            .lean();

        return res.status(200).json({
            success: true,
            application: applications,
            message: "Applications fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching applications:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};