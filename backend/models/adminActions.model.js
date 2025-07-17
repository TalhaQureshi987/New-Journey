import mongoose from "mongoose";

const adminActionSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    actionType: {
        type: String,
        required: true,
        enum: [
            'user_created',
            'user_deleted',
            'role_change',
            'user_blocked',
            'user_unblocked',
            'status_change',
            'login',
            'logout',
            'settings_updated',
            'subscription_created',
            'subscription_cancelled',
            'delete'
        ]
    },
    targetId: mongoose.Schema.Types.ObjectId, // Optional: ID of the affected resource
    targetType: String, // Optional: Type of the affected resource (user, subscription, etc.)
    Reason: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const AdminActions = mongoose.model('AdminAction', adminActionSchema);