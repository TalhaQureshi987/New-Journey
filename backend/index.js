import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import { ApiError } from "./utils/ApiError.js";

// Import routes
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.routes.js";
import applicationRoute from "./routes/application.route.js";
import adminRoute from "./routes/admin.route.js";
import subscriptionRoute from "./routes/subscription.routes.js";
import industryRoutes from './routes/industry.routes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS options
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/subscription", subscriptionRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/industry", industryRoutes);
app.use("/api/v1/admin", adminRoute);
app.use('/api/v1/contact', contactRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
            data: null
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [],
        data: null
    });
});

// 404 Handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        data: null
    });
});

const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server Running At Port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });