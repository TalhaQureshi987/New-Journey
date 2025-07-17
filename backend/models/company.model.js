import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contactEmail: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Basic email format validation
            },
            message: 'Please enter a valid email address'
        }
    },
    contactPhone: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10,15}$/.test(v); // Validates phone numbers with a length between 10 and 15 digits
            },
            message: 'Please enter a valid phone number'
        }
    },
    name: {
        type: String,
        required: [true, "Company name is required"],
        trim: true
    },
    logo: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        // required: [true, "Company location is required"]
    },
    website: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    industry: {
        type: String,
        // required: [true, "Industry is required"]
    },
    size: {
        type: String,
        // required: [true, "Company size is required"]
    },
    description: {
        type: String,
        // required: [true, "Company description is required"]
    },
    postedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
}, {
    timestamps: true
});

export const Company = mongoose.model('Company', companySchema);