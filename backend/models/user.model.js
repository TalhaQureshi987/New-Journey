import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    PhoneNumber: { type: String },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["job_seeker", "recruiter", "admin"],
        required: true,
    },
    skills: [{ type: String }], // Array of skills
    experience: [{
        jobTitle: { type: String },
        company: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String },
    }],
    education: [{
        degree: { type: String },
        institution: { type: String },
        year: { type: Number },
    }],
    appliedJobs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    },
    postedJobs: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    },
    profilepicture: {
        type: String,
        default: null
    },
    profilePicturePublicId: {
        type: String,
        default: null
    },
    location: { type: String },
    bio: { type: String },
    resume: {
        type: String,
        default: null
    },
    resumePreview: {
        type: String,
        default: null
    },
    resumeOriginalName: {
        type: String,
        default: null
    },
    resumePublicId: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    is_recruiter: { type: Boolean, default: false },
    current_plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    plan_expiry: { type: Date },
    activation_date: { type: Date },
    deactivation_date: { type: Date },
    admin_notes: { type: String },
    date_joined: { type: Date, default: Date.now },
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});

// Add email validation
userSchema.path('email').validate(function(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}, 'Invalid email format');

// Add pre-save middleware for additional validations
userSchema.pre('save', function(next) {
    // Ensure phone number is valid
    if (this.PhoneNumber && !/^\d{10}$/.test(this.PhoneNumber)) {
        next(new Error('Phone number must be 10 digits'));
    }

    // Ensure role is valid
    const validRoles = ['job_seeker', 'recruiter', 'admin'];
    if (!validRoles.includes(this.role)) {
        next(new Error('Invalid role'));
    }

    next();
});

export const User = mongoose.model("User", userSchema);