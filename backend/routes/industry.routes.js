import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/restrict.middleware.js';
import {
    addIndustry,
    getAllIndustries,
    updateIndustry,
    getIndustryById,
    deleteIndustry
} from '../controllers/industry.controller.js';

const router = express.Router();

// Public route for getting active industries
router.get('/', getAllIndustries);

// Protected admin routes
router.use(verifyJWT, restrictTo('admin'));

router.post('/', addIndustry);
router.route('/:id')
    .get(getIndustryById)
    .patch(updateIndustry)
    .delete(deleteIndustry);

export default router;