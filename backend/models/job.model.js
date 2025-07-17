import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    companyName: { type: String },
    skillRequired: [{ type: String }],
    educationRequired: { type: String, required: true }, // e.g., Bachelor's, Master's
    salary: { type: Number, required: true },
    employmentType: {
        type: String,
        enum: ["full-time", "part-time", "contract", "internship", "freelance"],
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ["Entry", "Mid", "Senior", "Lead", "Executive"], // Updated to string for better flexibility
        required: true
    },
    industry: { type: String }, // e.g., IT, Finance, Healthcare
    location: { type: String, required: true },
    jobtype: { type: String, required: true }, // e.g., Onsite, Remote, Hybrid
    position: { type: Number, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    postedDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["active", "closed", "expired"],
        default: "active"
    },
    expiryDate: {
        type: Date,
        default: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    }
}, { timestamps: true });

// Add middleware to check company status before saving
jobSchema.pre('save', async function(next) {
    if (this.isModified('status') || this.isModified('company')) {
        const Company = mongoose.model('Company');
        const company = await Company.findById(this.company);

        if (company && company.status === 'inactive') {
            this.status = 'inactive';
        }
    }
    next();
});

export const Job = mongoose.model("Job", jobSchema);