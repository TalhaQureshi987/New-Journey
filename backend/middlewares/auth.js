import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const isAuthenticated = async(req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login to continue"
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id)
                .select('-password');

            if (!user) {
                res.clearCookie('token');
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }

            req.user = user;
            next();
        } catch (error) {
            res.clearCookie('token');
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token"
                });
            }
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Session expired"
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const isRecruiter = async(req, res, next) => {
    try {
        if (req.user.role !== 'recruiter') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Recruiter only route."
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};