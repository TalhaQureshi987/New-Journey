import mongoose from 'mongoose';

const userSubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    jobPostingCredits: {
        type: Number,
        required: true
    },
    companyPostingCredits: {
        type: Number,
        required: true
    },
    usageHistory: [{
        action: String,
        type: {
            type: String,
            enum: ['credit', 'debit']
        },
        credits: Number,
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

export const UserSubscription = mongoose.model('UserSubscription', userSubscriptionSchema); 