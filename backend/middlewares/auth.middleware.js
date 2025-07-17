import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";

export const verifyJWT = async(req, res, next) => {
    try {
        const token = req.cookies.adminToken || req.header("Authorization").replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }

        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        const admin = await Admin.findById(decodedToken.id).select("-password");

        if (!admin) {
            throw new ApiError(401, "Invalid access token: Admin not found");
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        next(new ApiError(401, error.message || "Invalid access token"));
    }
};