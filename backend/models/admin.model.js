import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin"],
        default: "admin",
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    permissions: [{ type: String }],
    lastLogin: { type: Date },
}, { timestamps: true });

// Add index for better query performance
adminSchema.index({ email: 1 });
adminSchema.index({ status: 1 });

export const Admin = mongoose.model("Admin", adminSchema);