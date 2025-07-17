import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log('Received token:', token); // Debug log

        if (!token) {
            return res.status(401).json({
                message: "Please login to access this resource",
                success: false
            });
        }

        try {
            // Make sure to use the same SECRET_KEY as used in login
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            console.log('Decoded token:', decoded); // Debug log

            // Find user with decoded userId
            const user = await User.findById(decoded.userId)
                .select('-password')
                .lean();

            if (!user) {
                return res.status(401).json({
                    message: "User not found",
                    success: false
                });
            }

            // Verify user role if needed
            if (user.role !== decoded.role) {
                return res.status(401).json({
                    message: "Unauthorized access",
                    success: false
                });
            }

            // Attach user info to request
            req.user = user;
            req.userId = decoded.userId;
            req.userRole = decoded.role;

            next();
        } catch (jwt_error) {
            console.error("JWT verification error:", jwt_error);
            if (jwt_error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: "Token expired, please login again",
                    success: false
                });
            }
            return res.status(401).json({
                message: "Invalid token",
                success: false
            });
        }
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export default isAuthenticated;