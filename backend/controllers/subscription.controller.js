import { Subscription } from '../models/subscription.model.js';
import { UserSubscription } from '../models/userSubscriptions.model.js';

export const getRecruiterPlans = async (req, res) => {
    try {
        const plans = await Subscription.find({ status: 'active' });
        console.log('Retrieved plans:', plans);
        
        if (!plans || plans.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No active subscription plans found'
            });
        }

        return res.status(200).json({
            success: true,
            plans
        });
    } catch (error) {
        console.error('Error fetching plans:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch subscription plans'
        });
    }
};

export const getCurrentSubscription = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const subscription = await UserSubscription.findOne({
            userId: req.user._id,
            status: 'active'
        }).populate('subscriptionId');
        
        console.log('Retrieved subscription:', subscription);

        return res.status(200).json({
            success: true,
            subscription: subscription || null
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch current subscription'
        });
    }
};

export const purchaseSubscription = async (req, res) => {
    try {
        const { planId } = req.body;

        const plan = await Subscription.findById(planId);
        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Subscription plan not found'
            });
        }

        // Cancel any existing active subscription
        await UserSubscription.updateMany(
            { userId: req.user._id, status: 'active' },
            { status: 'cancelled' }
        );

        // Create new subscription
        const subscription = await UserSubscription.create({
            userId: req.user._id,
            subscriptionId: planId,
            startDate: new Date(),
            endDate: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000),
            jobPostingCredits: plan.jobPostingCredits,
            companyPostingCredits: plan.companyPostingCredits,
            usageHistory: [{
                action: 'Plan Purchase',
                type: 'credit',
                credits: plan.jobPostingCredits + plan.companyPostingCredits
            }]
        });

        return res.status(200).json({
            success: true,
            message: 'Subscription purchased successfully',
            subscription
        });
    } catch (error) {
        console.error('Error purchasing subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to purchase subscription'
        });
    }
};