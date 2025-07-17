import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { 
    getRecruiterPlans, 
    purchaseSubscription,
    getCurrentSubscription 
} from '../controllers/subscription.controller.js';

const router = express.Router();

router.get('/recruiter-plans', getRecruiterPlans);
router.post('/purchase', isAuthenticated, purchaseSubscription);
router.get('/current', isAuthenticated, getCurrentSubscription);

export default router; 