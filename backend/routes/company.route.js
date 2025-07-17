import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    getAllCompanies,
    getRecruiterCompanies,
    getCompanyById,
    registerCompany,
    updateCompany,
    getCompanyJobs
} from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// Public routes
router.get("/all", getAllCompanies);
router.get("/get/:id", getCompanyById);
router.get("/:id/jobs", getCompanyJobs);

router.route("/register").post(isAuthenticated, registerCompany);
// router.route("/get").get(isAuthenticated, getAllCompanies);
// router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);
// Protected recruiter routes
router.get("/my-companies", isAuthenticated, getRecruiterCompanies);
// router.post("/register", isAuthenticated, registerCompany);
// router.put("/update/:id", isAuthenticated, updateCompany);

export default router;