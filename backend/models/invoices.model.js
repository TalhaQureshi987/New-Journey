import mongoose from "mongoose";

const invoicesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscriptionPlans",
    },
    amount: { type: String },
    paymentDate: { type: Date.now() },
    PaymentMethod: { type: String },
    transactionId: { type: String },

}, { timestamps: true });

export const Invoices = mongoose.model("Invoices", invoicesSchema);