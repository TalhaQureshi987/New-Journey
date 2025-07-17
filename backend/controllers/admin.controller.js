import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { AdminActions } from "../models/adminActions.model.js";
import { UserSubscription } from "../models/userSubscriptions.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logAdminAction } from '../utils/adminLogger.js';
import {
    generateReportData,
    generateExportFile,
    generateTimeSeriesData,
    calculateGrowth
} from '../utils/reportGenerator.js';

export const adminController = {
    // Authentication Methods
    async login(req, res) {
        try {
            const { email, password } = req.body;

            console.log("Login attempt:", { email, password });

            // Find admin
            const admin = await Admin.findOne({ email });
            if (!admin || !(await bcrypt.compare(password, admin.password))) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            // Generate token
            const token = jwt.sign({ id: admin._id, role: admin.role },
                process.env.SECRET_KEY, { expiresIn: '24h' }
            );

            // Set cookie
            res.cookie('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            // Update last login
            await Admin.findByIdAndUpdate(admin._id, {
                lastLogin: new Date()
            });

            res.json({
                success: true,
                message: "Login successful",
                admin: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role
                }
            });

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({
                success: false,
                message: "Error during login"
            });
        }
    },

    async logout(req, res) {
        try {
            res.clearCookie("adminToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            res.json({
                success: true,
                message: "Logged out successfully"
            });
        } catch (error) {
            console.error("Logout error:", error);
            res.status(500).json({
                success: false,
                message: "Error during logout"
            });
        }
    },

    // Admin Management
    async createAdmin(req, res) {
        try {
            const { name, email, password, permissions } = req.body;

            // Validate input
            if (!name || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide all required fields"
                });
            }

            // Check email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format"
                });
            }

            if (await Admin.findOne({ email })) {
                return res.status(400).json({
                    success: false,
                    message: "Admin with this email already exists"
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newAdmin = await Admin.create({
                name,
                email,
                password: hashedPassword,
                role: "admin",
                permissions: permissions || ["limited"]
            });

            // Log admin creation
            await AdminActions.create({
                adminId: req.admin.id,
                actionType: "create",
                Reason: `Created new admin account for ${email}`
            });

            const adminResponse = newAdmin.toObject();
            delete adminResponse.password;

            res.status(201).json({
                success: true,
                message: "Admin created successfully",
                admin: adminResponse
            });
        } catch (error) {
            console.error("Create admin error:", error);
            res.status(500).json({
                success: false,
                message: "Error creating admin account"
            });
        }
    },

    async getAllAdmins(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const [admins, total] = await Promise.all([
                Admin.find()
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
                Admin.countDocuments()
            ]);

            res.json({
                success: true,
                admins,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            console.error("Get admins error:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching admin accounts"
            });
        }
    },

    // Dashboard and Reports
    async getDashboardStats(req, res) {
        try {
            const [
                userStats,
                jobStats,
                applicationStats,
                companyStats,
                recentActivities
            ] = await Promise.all([
                User.aggregate([{
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
                            }
                        }
                    }
                }]),
                Job.aggregate([{
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
                            }
                        }
                    }
                }]),
                Application.aggregate([{
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        pending: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
                            }
                        },
                        accepted: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0]
                            }
                        }
                    }
                }]),
                Company.aggregate([{
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
                            }
                        }
                    }
                }]),
                AdminActions.find()
                .populate('adminId', 'name email')
                .sort({ createdAt: -1 })
                .limit(10)
            ]);

            res.json({
                success: true,
                stats: {
                    users: userStats[0] || { total: 0, active: 0 },
                    jobs: jobStats[0] || { total: 0, active: 0 },
                    applications: applicationStats[0] || { total: 0, pending: 0, accepted: 0 },
                    companies: companyStats[0] || { total: 0, active: 0 },
                    recentActivities
                }
            });
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching dashboard stats'
            });
        }
    },

    // User Management Methods
    async getAllUsers(req, res) {
        try {
            // Add logging
            console.log('Getting users request from:', req.admin ? req.admin._id : 'No admin ID');

            const users = await User.find()
                .select('-password')
                .sort({ createdAt: -1 });

            console.log('Found users:', users.length);

            // Send response
            return res.status(200).json({
                success: true,
                users: users
            });

        } catch (error) {
            console.error('Get users error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error fetching users'
            });
        }
    },

    async getUserDetails(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId)
                .select('-password')
                .populate('current_plan_id');

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            res.json({
                success: true,
                user
            });
        } catch (error) {
            console.error("Get user details error:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching user details"
            });
        }
    },

    async updateUserStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            // Log the admin ID for debugging

            const user = await User.findByIdAndUpdate(
                id, { status }, { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Log the action with proper admin ID
            await logAdminAction({
                adminId: req.admin.id,
                actionType: 'status_change',
                targetId: user._id,
                targetType: 'user',
                reason: `Changed user status to ${status}`
            });

            res.json({
                success: true,
                message: 'User status updated successfully',
                user
            });
        } catch (error) {
            console.error('Error updating user status:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating user status'
            });
        }
    },

    // Job Management Methods
    async getAllJobs(req, res) {
        try {
            const { status = 'all', sort = 'newest' } = req.query;

            // Build query
            let query = {};
            if (status !== 'all') {
                query.status = status;
            }

            // Build sort options
            let sortOptions = {};
            if (sort === 'newest') {
                sortOptions.createdAt = -1;
            } else if (sort === 'oldest') {
                sortOptions.createdAt = 1;
            } else if (sort === 'applicants') {
                sortOptions.applicantsCount = -1;
            }

            const jobs = await Job.find(query)
                .sort(sortOptions)
                .populate('company', 'name logo')
                .lean();

            const total = await Job.countDocuments(query);

            res.json({
                success: true,
                jobs,
                total
            });
        } catch (error) {
            console.error("Get all jobs error:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching jobs"
            });
        }
    },

    async toggleJobStatus(req, res) {
        try {
            const { status } = req.body;
            const jobId = req.params.id;

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: "Status is required"
                });
            }

            const job = await Job.findByIdAndUpdate(
                jobId, { status }, { new: true }
            ).populate('company', 'name logo');

            if (!job) {
                return res.status(404).json({
                    success: false,
                    message: "Job not found"
                });
            }

            res.json({
                success: true,
                message: `Job status updated to ${status}`,
                job
            });
        } catch (error) {
            console.error("Toggle job status error:", error);
            res.status(500).json({
                success: false,
                message: "Error updating job status"
            });
        }
    },

    // Subscription Management Methods
    async getSubscriptions(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status;

            const query = {};
            if (status) query.status = status;

            const [subscriptions, total] = await Promise.all([
                UserSubscription.find(query)
                .populate('userId', 'fullname email')
                .populate('subscriptionPlanId')
                .populate('activatedByAdmin', 'name')
                .sort('-createdAt')
                .skip((page - 1) * limit)
                .limit(limit),
                UserSubscription.countDocuments(query)
            ]);

            res.json({
                success: true,
                subscriptions,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            console.error("Get subscriptions error:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching subscriptions"
            });
        }
    },

    async createSubscription(req, res) {
        try {
            const {
                userId,
                subscriptionPlanId,
                startDate,
                endDate,
                status,
                jobPostingRemaining,
                featuredJobPostingRemaining,
                paymentDetails
            } = req.body;

            // Validate required fields
            if (!userId || !subscriptionPlanId || !startDate || !jobPostingRemaining) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide all required fields"
                });
            }

            // Check if user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Create subscription
            const subscription = await UserSubscription.create({
                userId,
                subscriptionPlanId,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                status: status || 'active',
                jobPostingRemaining,
                featuredJobPostingRemaining,
                paymentDetails,
                activatedByAdmin: req.admin.id
            });

            // Update user's current plan
            await User.findByIdAndUpdate(userId, {
                current_plan_id: subscription._id,
                plan_expiry: endDate
            });

            // Log admin action
            await AdminActions.create({
                adminId: req.admin.id,
                userId,
                actionType: 'change',
                Reason: `Created new subscription plan for user`
            });

            const populatedSubscription = await UserSubscription.findById(subscription._id)
                .populate('userId', 'fullname email')
                .populate('subscriptionPlanId')
                .populate('activatedByAdmin', 'name');

            res.status(201).json({
                success: true,
                message: "Subscription created successfully",
                subscription: populatedSubscription
            });
        } catch (error) {
            console.error("Create subscription error:", error);
            res.status(500).json({
                success: false,
                message: "Error creating subscription"
            });
        }
    },

    async getReports(req, res) {
        try {
            const { range = 'month' } = req.query;

            // Calculate date range
            const endDate = new Date();
            let startDate = new Date();

            switch (range) {
                case 'week':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
                case 'quarter':
                    startDate.setMonth(startDate.getMonth() - 3);
                    break;
                case 'year':
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
                default:
                    startDate.setMonth(startDate.getMonth() - 1);
            }

            // Get time series data for trend chart
            const timeSeriesData = await generateTimeSeriesData(startDate, endDate);

            // Get current stats
            const [userStats, jobStats, companyStats] = await Promise.all([
                User.aggregate([{
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                        },
                        inactive: {
                            $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
                        }
                    }
                }]),
                Job.aggregate([{
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                        }
                    }
                }]),
                Company.aggregate([{
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                        },
                        inactive: {
                            $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
                        }
                    }
                }])
            ]);

            // Format response with null checks
            const response = {
                success: true,
                data: {
                    overview: {
                        users: {
                            total: userStats && userStats[0] ? userStats[0].total : 0,
                            active: userStats && userStats[0] ? userStats[0].active : 0,
                            growth: calculateGrowth(timeSeriesData.users)
                        },
                        activeJobs: {
                            total: jobStats && jobStats[0] ? jobStats[0].active : 0,
                            growth: calculateGrowth(timeSeriesData.jobs)
                        },
                        companies: {
                            total: companyStats && companyStats[0] ? companyStats[0].total : 0,
                            growth: calculateGrowth(timeSeriesData.companies)
                        }
                    },
                    timeSeriesData,
                    userStats: {
                        active: userStats && userStats[0] ? userStats[0].active : 0,
                        inactive: userStats && userStats[0] ? userStats[0].inactive : 0
                    },
                    companyStats: {
                        active: companyStats && companyStats[0] ? companyStats[0].active : 0,
                        inactive: companyStats && companyStats[0] ? companyStats[0].inactive : 0
                    }
                }
            };

            res.json(response);
        } catch (error) {
            console.error("Get reports error:", error);
            res.status(500).json({
                success: false,
                message: "Error generating reports"
            });
        }
    },

    async exportReport(req, res) {
        try {
            const { format = 'csv', range = 'month' } = req.body;

            const endDate = new Date();
            let startDate = new Date();

            switch (range) {
                case 'week':
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
                case 'quarter':
                    startDate.setMonth(startDate.getMonth() - 3);
                    break;
                case 'year':
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
            }

            const [timeSeriesData, userStats, jobStats, companyStats] = await Promise.all([
                generateTimeSeriesData(startDate, endDate),
                User.aggregate([{
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                        },
                        inactive: {
                            $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
                        }
                    }
                }]),
                Job.aggregate([{
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                        }
                    }
                }]),
                Company.aggregate([{
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        active: {
                            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                        },
                        inactive: {
                            $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] }
                        }
                    }
                }])
            ]);

            const reportData = {
                overview: {
                    users: {
                        total: (userStats && userStats[0] && userStats[0].total) || 0,
                        active: (userStats && userStats[0] && userStats[0].active) || 0,
                        inactive: (userStats && userStats[0] && userStats[0].inactive) || 0,
                        growth: calculateGrowth(timeSeriesData.users)
                    },
                    jobs: {
                        active: (jobStats && jobStats[0] && jobStats[0].active) || 0,
                        growth: calculateGrowth(timeSeriesData.jobs)
                    },
                    companies: {
                        total: (companyStats && companyStats[0] && companyStats[0].total) || 0,
                        active: (companyStats && companyStats[0] && companyStats[0].active) || 0,
                        inactive: (companyStats && companyStats[0] && companyStats[0].inactive) || 0,
                        growth: calculateGrowth(timeSeriesData.companies)
                    }
                },
                timeSeriesData
            };

            const exportFile = await generateExportFile(reportData, format);

            res.setHeader('Content-Type', exportFile.mimeType);
            res.setHeader('Content-Disposition', `attachment; filename=report-${Date.now()}.${format}`);
            res.send(exportFile.data);

        } catch (error) {
            console.error("Export report error:", error);
            res.status(500).json({
                success: false,
                message: "Error exporting report"
            });
        }
    },

    // Add logging to other methods as well
    async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const user = await User.findByIdAndUpdate(
                id, { role }, { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Log the action
            await logAdminAction({
                adminId: req.admin.id,
                actionType: 'role_change',
                targetId: user._id,
                targetType: 'user',
                reason: `Changed user role to ${role}`
            });

            res.json({
                success: true,
                message: 'User role updated successfully',
                user
            });
        } catch (error) {
            console.error('Error updating user role:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating user role'
            });
        }
    },

    async deleteJob(req, res) {
        try {
            const jobId = req.params.id;
            const job = await Job.findByIdAndDelete(jobId);

            if (!job) {
                return res.status(404).json({
                    success: false,
                    message: "Job not found"
                });
            }

            // Log admin action
            await AdminActions.create({
                adminId: req.admin.id,
                actionType: "delete",
                Reason: "Job deleted",
                jobId
            });

            res.json({
                success: true,
                message: "Job deleted successfully"
            });
        } catch (error) {
            console.error("Delete job error:", error);
            res.status(500).json({
                success: false,
                message: "Error deleting job"
            });
        }
    },

    async getJobDetails(req, res) {
        try {
            const jobId = req.params.id;
            const job = await Job.findById(jobId)
                .populate('company', 'name logo industry size website')
                .lean();

            if (!job) {
                return res.status(404).json({
                    success: false,
                    message: "Job not found"
                });
            }

            res.json({
                success: true,
                job
            });
        } catch (error) {
            console.error("Get job details error:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching job details"
            });
        }
    },

    // Company Management Methods
    async getAllCompanies(req, res) {
        try {
            const companies = await Company.find()
                .select('name email logo industry location status createdAt updatedAt')
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                companies
            });
        } catch (error) {
            console.error("Get companies error:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching companies"
            });
        }
    },

    async getCompanyDetails(req, res) {
        try {
            const company = await Company.findById(req.params.id)
                .populate('postedJobs')
                .lean();

            if (!company) {
                return res.status(404).json({
                    success: false,
                    message: "Company not found"
                });
            }

            // Add computed fields using a more explicit approach
            const jobCount = Array.isArray(company.postedJobs) ? company.postedJobs.length : 0;

            const companyWithExtras = {
                ...company,
                jobsCount: jobCount
            };

            res.json({
                success: true,
                company: companyWithExtras
            });
        } catch (error) {
            console.error("Get company details error:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching company details"
            });
        }
    },

    async updateCompanyStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const company = await Company.findByIdAndUpdate(
                id, { status }, { new: true }
            );

            if (!company) {
                return res.status(404).json({
                    success: false,
                    message: "Company not found"
                });
            }

            // Log admin action
            await AdminActions.create({
                adminId: req.admin.id,
                actionType: "status_change",
                targetId: company._id,
                targetType: "company",
                Reason: `Updated company status to ${status}`
            });

            res.json({
                success: true,
                message: "Company status updated successfully",
                company
            });
        } catch (error) {
            console.error("Update company status error:", error);
            res.status(500).json({
                success: false,
                message: "Error updating company status"
            });
        }
    },

    async deleteCompany(req, res) {
        try {
            const company = await Company.findByIdAndDelete(req.params.id);

            if (!company) {
                return res.status(404).json({
                    success: false,
                    message: "Company not found"
                });
            }

            // Log admin action
            await AdminActions.create({
                adminId: req.admin.id,
                actionType: "user_deleted",
                targetId: company._id,
                targetType: "company",
                Reason: "Company deleted"
            });

            res.json({
                success: true,
                message: "Company deleted successfully"
            });
        } catch (error) {
            console.error("Delete company error:", error);
            res.status(500).json({
                success: false,
                message: "Error deleting company"
            });
        }
    }
};