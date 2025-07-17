import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { 
  Users, 
  Briefcase, 
  Building2, 
  UserCheck,
  Activity,
  UserPlus,
  UserMinus,
  Shield,
  Ban,
  Clock,
  LogIn,
  LogOut,
  Settings,
  XCircle
} from 'lucide-react';
import LoadingSpinner from '../minicomponents/LoadingSpinner';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div className="ml-4">
        <h3 className="text-gray-500 text-sm">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_created':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'user_deleted':
        return <UserMinus className="w-5 h-5 text-red-500" />;
      case 'role_change':
        return <Shield className="w-5 h-5 text-purple-500" />;
      case 'user_blocked':
        return <Ban className="w-5 h-5 text-orange-500" />;
      case 'user_unblocked':
        return <Ban className="w-5 h-5 text-green-500" />;
      case 'status_change':
        return <Activity className="w-5 h-5 text-blue-500" />;
      case 'login':
        return <LogIn className="w-5 h-5 text-indigo-500" />;
      case 'logout':
        return <LogOut className="w-5 h-5 text-gray-500" />;
      case 'settings_updated':
        return <Settings className="w-5 h-5 text-yellow-500" />;
      case 'subscription_created':
        return <CreditCard className="w-5 h-5 text-green-500" />;
      case 'subscription_cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_created':
        return 'bg-green-50 text-green-700';
      case 'user_deleted':
        return 'bg-red-50 text-red-700';
      case 'role_change':
        return 'bg-purple-50 text-purple-700';
      case 'user_blocked':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
        return `${diffInMinutes} minutes ago`;
      }
      return `${diffInHours} hours ago`;
    }
    return activityDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors">
      <div className={`p-2 rounded-full ${getActivityColor(activity.actionType)}`}>
        {getActivityIcon(activity.actionType)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.adminId?.name || 'Unknown Admin'}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {formatDate(activity.createdAt)}
          </div>
        </div>
        <p className="text-sm text-gray-500 truncate">
          {activity.actionType.split('_').join(' ').toLowerCase()}
          {activity.Reason ? `: ${activity.Reason}` : ''}
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/v1/admin/dashboard-stats',
        { withCredentials: true }
      );

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      toast.error('Error fetching dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.users.total || 0}
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Active Jobs"
          value={stats?.jobs.active || 0}
          icon={Briefcase}
          color="text-green-600"
        />
        <StatCard
          title="Total Applications"
          value={stats?.applications.total || 0}
          icon={UserCheck}
          color="text-purple-600"
        />
        <StatCard
          title="Active Companies"
          value={stats?.companies.active || 0}
          icon={Building2}
          color="text-yellow-600"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Pending Applications</p>
            <p className="text-xl font-semibold text-amber-600">
              {stats?.applications.pending || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Accepted Applications</p>
            <p className="text-xl font-semibold text-green-600">
              {stats?.applications.accepted || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Rejected Applications</p>
            <p className="text-xl font-semibold text-red-600">
              {stats?.applications.total - (stats?.applications.pending + stats?.applications.accepted) || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          {stats?.recentActivities?.length > 0 && (
            <span className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">
              {stats.recentActivities.length} activities
            </span>
          )}
        </div>
        
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {stats?.recentActivities?.length > 0 ? (
            stats.recentActivities.map((activity) => (
              <ActivityItem key={activity._id} activity={activity} />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No recent activities
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 