import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import getDataUrl from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async(req, res) => {
    try {
        const { fullname, email, password, PhoneNumber, role } = req.body;

        // Ensure all required fields are present
        if (!fullname || !email || !password || !PhoneNumber || !role) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false,
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Initialize new user with required fields
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
            PhoneNumber,
            role,
            skills: [],
            experience: [],
            education: [],
            status: "active",
            date_joined: Date.now(),
        });

        let cloudResponse; // Declare cloudResponse here

        // Handle file upload to Cloudinary
        const file = req.file;
        console.log(file);

        if (file) {
            // Validate file type
            // if (file.mimetype !== 'application/pdf') {
            //     return res.status(400).json({
            //         message: "Only PDF files are allowed!",
            //         success: false
            //     });
            // }

            // Validate file size (5MB limit)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                return res.status(400).json({
                    message: "File size should be less than 5MB",
                    success: false
                });
            }

            try {
                const fileUrl = getDataUrl(file);
                cloudResponse = await cloudinary.uploader.upload(fileUrl.content);
                console.log(fileUrl);
            } catch (uploadError) {
                console.error("Server upload error:", uploadError);
                return res.status(500).json({
                    message: "Failed to upload image! Please try again.",
                    success: false,
                });
            }
        }

        if (role === "recruiter") {
            newUser.is_recruiter = true;
        }

        // If the image was uploaded successfully, set the profile picture URL
        if (cloudResponse) {
            newUser.profilepicture = cloudResponse.secure_url;
        }
        // Save the new user
        await newUser.save();

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error("Error in registration:", error); // More specific logging
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

export const login = async(req, res) => {
    try {
        const { email, password, role } = req.body;

        // Find user with email and role
        const user = await User.findOne({ email, role }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or role"
            });
        }

        // Check user status
        if (user.status === 'inactive') {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive. Please contact support."
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id, role: user.role },
            process.env.SECRET_KEY, { expiresIn: '24h' }
        );

        // Remove password from response
        user.password = undefined;

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user,
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const logout = async(req, res) => {
    try {
        return res
            .status(200)
            .clearCookie("token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            })
            .json({
                success: true,
                message: "Logged out successfully"
            });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Error during logout"
        });
    }
};

// Profile update controller
export const updateProfile = async(req, res) => {
    try {
        const userId = req.userId;
        let formData = {...req.body };

        // Parse experience array if it's a string
        if (typeof formData.experience === 'string') {
            try {
                formData.experience = JSON.parse(formData.experience);
            } catch (error) {
                console.error("Error parsing experience:", error);
                return res.status(400).json({
                    message: "Invalid experience data format",
                    success: false
                });
            }
        }

        // Parse education array if it's a string
        if (typeof formData.education === 'string') {
            try {
                formData.education = JSON.parse(formData.education);
            } catch (error) {
                console.error("Error parsing education:", error);
                return res.status(400).json({
                    message: "Invalid education data format",
                    success: false
                });
            }
        }

        // Parse skills array if it's a string
        if (typeof formData.skills === 'string') {
            try {
                formData.skills = formData.skills.split(',').map(skill => skill.trim());
            } catch (error) {
                console.error("Error parsing skills:", error);
                return res.status(400).json({
                    message: "Invalid skills data format",
                    success: false
                });
            }
        }

        // Handle file upload if present
        const file = req.file;
        if (file) {
            try {
                const fileUrl = getDataUrl(file);
                const cloudResponse = await cloudinary.uploader.upload(fileUrl.content, {
                    resource_type: "raw", // Explicitly for non-image files
                    public_id: `resume_${userId}_${Date.now()}`,
                    use_filename: false,
                    unique_filename: true,
                    flags: "attachment",
                    type: "upload"
                });

                formData.resume = cloudResponse.secure_url;
                formData.resumeOriginalName = file.originalname;
            } catch (uploadError) {
                console.error("Resume upload error:", uploadError);
                return res.status(500).json({
                    message: "Failed to upload resume!",
                    success: false
                });
            }
        }

        // Clean up experience and education data
        if (Array.isArray(formData.experience)) {
            formData.experience = formData.experience.map(exp => ({
                jobTitle: exp.jobTitle,
                company: exp.company,
                startDate: new Date(exp.startDate),
                endDate: exp.endDate ? new Date(exp.endDate) : null,
                description: exp.description,
                _id: exp._id
            }));
        }

        if (Array.isArray(formData.education)) {
            formData.education = formData.education.map(edu => ({
                degree: edu.degree,
                institution: edu.institution,
                year: edu.year,
                _id: edu._id
            }));
        }

        // Update user with all the parsed data
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            formData, {
                new: true,
                runValidators: true,
                select: '-password'
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};


export const getProfile = async(req, res) => {
    try {
        // Since we already have the user from middleware, we can use it directly
        const user = req.user;

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error in getProfile:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

export const updateRecruiterStatus = async(req, res) => {
    try {
        const { userId, recruiterStatus } = req.body;
        const adminId = req.user.userId; // Assuming middleware sets req.user

        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                message: "Unauthorized",
                success: false,
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        user.is_recruiter = recruiterStatus === "active";
        user.recruiter_status = recruiterStatus;
        if (recruiterStatus === "active") {
            user.activation_date = new Date();
        } else if (recruiterStatus === "inactive") {
            user.deactivation_date = new Date();
        }

        await user.save();

        return res.status(200).json({
            message: "Recruiter status updated successfully",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

export const addAdminNote = async(req, res) => {
    try {
        const { userId, note } = req.body;
        const adminId = req.user.userId; // Assuming middleware sets req.user

        const admin = await User.findById(adminId);
        if (!admin || admin.role !== "admin") {
            return res.status(403).json({
                message: "Unauthorized",
                success: false,
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        user.admin_notes = user.admin_notes ? `${user.admin_notes}\n${note}` : note;
        await user.save();

        return res.status(200).json({
            message: "Admin note added successfully",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};