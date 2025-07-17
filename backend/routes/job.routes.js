import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob, updateJobStatus } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/update/:id").post(isAuthenticated, updateJob);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:_id").get(getJobById);
router.patch('/:jobId/status', isAuthenticated, updateJobStatus);

export default router;