import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './models/user.model.js';
import './models/subscriptionPlans.model.js';
import './models/admin.model.js';

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
}));

// Routes
app.use('/api/v1/job', jobRoutes);
// ... other routes