import express from "express";
import { adminController } from "../controllers/admin.controller.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.js";

const router = express.Router();

// Debug: Log available controller methods
console.log("Available controller methods:", Object.keys(adminController));

// Public routes (no auth required)
router.post("/login", adminController.login);

// Apply middleware to all routes after this point
router.use(adminAuthMiddleware);

// Auth routes
router.post("/logout", adminController.logout);

// Admin management
router.post("/create", adminController.createAdmin);
router.get("/admins", adminController.getAllAdmins);

// Dashboard & Reports
router.get("/dashboard-stats", adminController.getDashboardStats);
router.get("/reports", adminController.getReports);
router.post("/reports/export", adminController.exportReport);

// User management
router.get("/users", adminController.getAllUsers);
router.get("/user/:id", adminController.getUserDetails);
router.patch("/user/:id/status", adminController.updateUserStatus);

// Job management
router.get("/jobs", adminController.getAllJobs);
router.patch("/job/:id/status", adminController.toggleJobStatus);
router.delete("/job/:id", adminController.deleteJob);
router.get("/job/:id", adminController.getJobDetails);

// Subscription management
router.get("/subscriptions", adminController.getSubscriptions);
router.post("/subscription", adminController.createSubscription);

// Company management
router.get("/companies", adminController.getAllCompanies);
router.get("/companies/:id", adminController.getCompanyDetails);
router.patch("/companies/:id/status", adminController.updateCompanyStatus);
router.delete("/companies/:id", adminController.deleteCompany);

export default router;