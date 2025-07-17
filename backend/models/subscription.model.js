import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // in days
        required: true
    },
    jobPostingCredits: {
        type: Number,
        required: true
    },
    companyPostingCredits: {
        type: Number,
        required: true
    },
    features: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

export const Subscription = mongoose.model('Subscription', subscriptionSchema); 