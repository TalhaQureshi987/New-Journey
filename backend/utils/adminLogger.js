import { AdminActions } from '../models/adminActions.model.js';

export const logAdminAction = async ({
  adminId,
  actionType,
  targetId = null,
  targetType = null,
  reason = null
}) => {
  try {
    const action = await AdminActions.create({
      adminId,
      actionType,
      targetId,
      targetType,
      Reason: reason
    });

    await action.populate('adminId', 'name email');
    return action;
  } catch (error) {
    console.error('Error logging admin action:', error);
    throw error;
  }
}; 