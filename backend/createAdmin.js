import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Admin } from "./models/admin.model.js";

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Check if admin already exists
        const adminExists = await Admin.findOne({ email: "admin@gmail.com" });
        
        if (adminExists) {
            console.log("Admin user already exists!");
            await mongoose.disconnect();
            return;
        }

        const adminPassword = "admin123"; // Define password explicitly

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Create new admin
        const admin = new Admin({
            name: "Super Admin",
            email: "admin@gmail.com",
            password: hashedPassword,
            role: "admin",
            status: "active", // Add status explicitly
            permissions: ["all"]
        });

        await admin.save();
        console.log("Admin user created successfully!");
        console.log("Email: admin@gmail.com");
        console.log("Password:", adminPassword); // Log the actual password being used

    } catch (error) {
        console.error("Error creating admin user:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

createAdminUser();