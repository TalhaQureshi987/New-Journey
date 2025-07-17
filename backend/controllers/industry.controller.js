import { Industry } from "../models/industry.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Add new industry
export const addIndustry = async(req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            throw new ApiError(400, "Industry name is required");
        }

        // Check if industry already exists
        const existingIndustry = await Industry.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (existingIndustry) {
            throw new ApiError(400, "Industry already exists");
        }

        const industry = await Industry.create({
            name,
            description,
            status: 'active'
        });

        return res.status(201).json({
            success: true,
            message: "Industry created successfully",
            data: industry
        });
    } catch (error) {
        console.error("Error in addIndustry:", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Something went wrong while creating industry");
    }
};

// Get all industries
export const getAllIndustries = async(req, res) => {
    try {
        const industries = await Industry.find({ status: 'active' })
            .sort({ name: 1 });

        return res.status(200).json({
            success: true,
            message: "Industries fetched successfully",
            data: industries, // This is the array of industries
            industries: industries // Adding this for backward compatibility
        });
    } catch (error) {
        console.error("Error in getAllIndustries:", error);
        throw new ApiError(500, "Error while fetching industries");
    }
};

// Get industry by ID
export const getIndustryById = async(req, res) => {
    try {
        const industry = await Industry.findById(req.params.id);

        if (!industry) {
            throw new ApiError(404, "Industry not found");
        }

        return res.status(200).json(
            new ApiResponse(200, industry, "Industry fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error while fetching industry");
    }
};

// Update industry
export const updateIndustry = async(req, res) => {
    try {
        const { name, description, status } = req.body;
        const industryId = req.params.id;

        const industry = await Industry.findById(industryId);

        if (!industry) {
            throw new ApiError(404, "Industry not found");
        }

        if (name) industry.name = name;
        if (description) industry.description = description;
        if (status) industry.status = status;

        await industry.save();

        return res.status(200).json(
            new ApiResponse(200, industry, "Industry updated successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error while updating industry");
    }
};

// Delete industry
export const deleteIndustry = async(req, res) => {
    try {
        const industry = await Industry.findByIdAndDelete(req.params.id);

        if (!industry) {
            throw new ApiError(404, "Industry not found");
        }

        return res.status(200).json(
            new ApiResponse(200, {}, "Industry deleted successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Error while deleting industry");
    }
};