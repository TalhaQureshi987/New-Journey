import { Company } from "../models/company.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { updateJobStatusByCompany } from '../utils/jobUtils.js';
import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

export const registerCompany = async(req, res) => {
    try {
        const { companyName } = req.body;
        const userId = req.userId;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required.",
                success: false
            });
        }

        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "Company with this name already exists.",
                success: false
            });
        }

        company = await Company.create({
            name: companyName,
            userId: userId
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.error("Register company error:", error);
        return res.status(500).json({
            message: "Failed to register company.",
            success: false,
            error: error.message
        });
    }
};

export const getCompany = async(req, res) => {
        try {
            const userId = req.id; // logged in user id
            const companies = await Company.find({ userId });
            if (!companies) {
                return res.status(404).json({
                    message: "Companies not found.",
                    success: false
                })
            }
            return res.status(200).json({
                companies,
                success: true
            })
        } catch (error) {
            console.log(error);
        }
    }
    // get company by id
export const getCompanyById = async(req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid company ID format"
            });
        }

        const company = await Company.findById(id)
            .populate({
                path: 'postedJobs',
                match: { status: 'active' },
                select: 'title location type salary experience createdAt'
            });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        return res.status(200).json({
            success: true,
            company,
            message: "Company details fetched successfully"
        });
    } catch (error) {
        console.error("Get company by id error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch company details",
            error: error.message
        });
    }
};

export const updateCompany = async(req, res) => {
    try {
        const { name, description, website, location, contactEmail, contactPhone } = req.body;
        const updateData = {}; // Object to store only the fields provided in the request

        // Add text fields only if they are provided
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (website) updateData.website = website;
        if (location) updateData.location = location;
        if (contactEmail) updateData.contactEmail = contactEmail;
        if (contactPhone) updateData.contactPhone = contactPhone;

        // Handle file upload to Cloudinary if a file is provided
        const file = req.file;
        // idhar cloudinary ayega
        if (req.file) {
            try {
                const fileUri = getDataUri(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                updateData.logo = cloudResponse.secure_url;
            } catch (cloudError) {
                console.error("Error uploading to Cloudinary:", cloudError);
                return res.status(500).json({
                    message: "Error uploading logo.",
                    success: false
                });
            }
        }

        // Update the company by ID and return the new document
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        // If company is not found
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // Return success response with updated company data
        return res.status(200).json({
            message: "Company information updated successfully.",
            success: true,
            company
        });
    } catch (error) {
        // Catch general errors
        console.error("Error updating company:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getAllCompanies = async(req, res) => {
    try {
        const companies = await Company.find({ status: 'active' })
            .select('name logo location website status industry size description postedJobs userId contactEmail contactPhone')
            .populate({
                path: 'postedJobs',
                match: { status: 'active' },
                select: '_id'
            })
            .sort({ createdAt: -1 });

        // Transform the data to include job count
        const transformedCompanies = companies.map(company => ({
            _id: company._id,
            name: company.name,
            logo: company.logo,
            location: company.location,
            industry: company.industry,
            size: company.size,
            description: company.description,
            jobCount: company.postedJobs.length
        }));

        return res.status(200).json({
            success: true,
            companies: transformedCompanies,
            message: "Companies fetched successfully"
        });
    } catch (error) {
        console.error("Get all companies error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch companies",
            error: error.message
        });
    }
};

export const updateCompanyStatus = async(req, res) => {
    try {
        const { companyId } = req.params;
        const { status } = req.body;

        // Update company status
        const company = await Company.findByIdAndUpdate(
            companyId, { status }, { new: true }
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        // Update all jobs associated with this company
        if (status === 'inactive') {
            await updateJobStatusByCompany(companyId, 'inactive');
        }

        return res.status(200).json({
            success: true,
            message: `Company and associated jobs status updated to ${status}`,
            company
        });

    } catch (error) {
        console.error("Error updating company status:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update company status"
        });
    }
};

export const getCompanyJobs = async(req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);


        const jobs = await Job.find({
            company: id,
            status: 'active'
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            jobs,
            message: "Company jobs fetched successfully"
        });
    } catch (error) {
        console.error("Get company jobs error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch company jobs",
            error: error.message
        });
    }
};

export const getRecruiterCompanies = async(req, res) => {
    try {
        const userId = req.user._id; // Get the authenticated user's ID

        const companies = await Company.find({ userId })
            .select('name logo location website status industry size description postedJobs userId contactEmail contactPhone')
            .populate({
                path: 'postedJobs',
                match: { status: 'active' },
                select: '_id'
            })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            companies,
            message: "Companies fetched successfully"
        });
    } catch (error) {
        console.error("Get recruiter companies error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch companies",
            error: error.message
        });
    }
};