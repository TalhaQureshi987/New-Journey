import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    applyjob,
    getApplicants,
    getAppliedJobs,
    updateStatus,
    checkApplicationStatus
} from "../controllers/application.controller.js";

const router = express.Router();

router.route("/job/:jobId/check-status").get(isAuthenticated, checkApplicationStatus);

router.route("/apply/:id").post(isAuthenticated, applyjob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);

export default router;