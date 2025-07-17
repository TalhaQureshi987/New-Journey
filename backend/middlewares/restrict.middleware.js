import { ApiError } from "../utils/ApiError.js";

export const restrictTo = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.admin || !allowedRoles.includes(req.admin.role)) {
                throw new ApiError(403, "You are not authorized to perform this action");
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}; 