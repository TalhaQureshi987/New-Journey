import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

export const adminAuthMiddleware = async(req, res, next) => {
    try {
        const token = req.cookies.adminToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Admin not found"
            });
        }

        // Attach admin info to request object
        req.admin = {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }
};

export const requireAdminPermission = (permission) => {
    return (req, res, next) => {
        try {
            if (!req.admin) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            if (!req.admin.permissions.includes(permission)) {
                return res.status(403).json({
                    success: false,
                    message: "Insufficient permissions"
                });
            }

            next();
        } catch (error) {
            console.error("Permission Middleware Error:", error);
            res.status(500).json({
                success: false,
                message: "Error checking permissions"
            });
        }
    };
};