import { Job } from "../models/job.model.js";

export const updateJobStatusByCompany = async(companyId, status) => {
    try {
        await Job.updateMany({ company: companyId }, { $set: { status: status } });
        console.log(`Updated jobs status to ${status} for company ${companyId}`);
    } catch (error) {
        console.error('Error updating job statuses:', error);
        throw error;
    }
};