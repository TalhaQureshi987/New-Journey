import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Clock, 
  Users, 
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminLayout from '../../components/layouts/AdminLayout';
import { Modal } from '../../components/shared/Modal';
import { useSubscriptionActions } from '../../hooks/useAdmin';
import { toast } from 'react-hot-toast';

const Subscriptions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const { data: subscriptions, isLoading } = useQuery(
    ['admin-subscriptions'], 
    () => fetch('/api/admin/subscriptions').then(res => res.json())
  );

  const { data: subscriptionStats } = useQuery(
    ['subscription-stats'], 
    () => fetch('/api/admin/subscription-stats').then(res => res.json())
  );

  const { 
    mutate: updateSubscription,
    mutate: deletePlan,
    isLoading: isActionLoading 
  } = useSubscriptionActions();

  const handleDeletePlan = async (planId) => {
    try {
      await deletePlan(planId);
      setDeleteConfirmation(null);
      toast.success('Plan deleted successfully');
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1>
            <p className="text-gray-600">Manage your subscription plans and pricing</p>
          </div>
          <button 
            onClick={() => {
              setEditingPlan(null);
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg"
          >
            <Plus size={20} />
            Add New Plan
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard 
            title="Active Subscriptions"
            value={subscriptionStats?.activeSubscriptions || 0}
            change={subscriptionStats?.subscriptionGrowth || 0}
            icon={Users}
            color="blue"
          />
          <StatsCard 
            title="Monthly Revenue"
            value={`$${subscriptionStats?.monthlyRevenue || 0}`}
            change={subscriptionStats?.revenueGrowth || 0}
            icon={DollarSign}
            color="green"
          />
          <StatsCard 
            title="Expiring Soon"
            value={subscriptionStats?.expiringSoon || 0}
            icon={Clock}
            color="yellow"
          />
          <StatsCard 
            title="Average Plan Value"
            value={`$${subscriptionStats?.averagePlanValue || 0}`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Subscription Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {subscriptions?.map((plan) => (
              <motion.div 
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`
                  border rounded-xl p-6 hover:shadow-lg transition-all
                  ${plan.isPopular ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                `}
              >
                {plan.isPopular && (
                  <div className="flex items-center gap-1 text-blue-600 mb-2">
                    <Star size={16} />
                    <span className="text-sm font-medium">Most Popular</span>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                    <p className="text-gray-500">{plan.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsModalOpen(true);
                      }}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmation(plan)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/{plan.duration}</span>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Active Users</span>
                    <span className="font-medium">{plan.activeUsers || 0}</span>
                  </div>
                  {plan.maxUsers && (
                    <div className="mt-2">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ 
                            width: `${(plan.activeUsers / plan.maxUsers) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{plan.activeUsers} users</span>
                        <span>{plan.maxUsers} max</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Subscription Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingPlan ? "Edit Subscription Plan" : "Add New Plan"}
        >
          <SubscriptionForm
            initialData={editingPlan}
            onSubmit={async (data) => {
              try {
                await updateSubscription(data);
                setIsModalOpen(false);
                toast.success(
                  editingPlan 
                    ? 'Plan updated successfully' 
                    : 'New plan created successfully'
                );
              } catch (error) {
                toast.error('Failed to save plan');
              }
            }}
            isLoading={isActionLoading}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          title="Delete Subscription Plan"
        >
          <div className="p-6">
            <div className="flex items-center gap-3 text-amber-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the "{deleteConfirmation?.name}" plan? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmation(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePlan(deleteConfirmation._id)}
                className="btn-danger"
                disabled={isActionLoading}
              >
                {isActionLoading ? 'Deleting...' : 'Delete Plan'}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500"
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change && (
            <div className="flex items-center gap-2 mt-2">
              {change > 0 ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingUp size={16} className="text-red-500" />
              )}
              <span className="text-sm text-gray-500">
                {change > 0 ? `+${change}%` : `${change}%`}
              </span>
            </div>
          )}
        </div>
        <div className={`${colors[color]} p-3 rounded-full`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

const SubscriptionForm = ({ initialData, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    price: '',
    duration: 'monthly',
    features: ['']
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit(formData);
    }}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Plan Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Features
          </label>
          {formData.features.map((feature, index) => (
            <div key={index} className="mt-2 flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => {
                  const newFeatures = [...formData.features];
                  newFeatures[index] = e.target.value;
                  setFormData({ ...formData, features: newFeatures });
                }}
                className="block w-full rounded-md border-gray-300 shadow-sm"
              />
              <button
                type="button"
                onClick={() => {
                  const newFeatures = formData.features.filter((, i) => i !== index);
                  setFormData({ ...formData, features: newFeatures });
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-md"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setFormData({
              ...formData,
              features: [...formData.features, '']
            }))}
            className="mt-2 text-blue-600 hover:text-blue-700"
          >
            Add Feature
          </button>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {initialData ? 'Update Plan' : 'Create Plan'}
        </button>
      </div>
    </form>
  );
};

export default Subscriptions;
