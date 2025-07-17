import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Mail, User, ToggleLeft, ToggleRight, Search } from 'lucide-react';
import { Input } from '../ui/input';
import LoadingSpinner from '../minicomponents/LoadingSpinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  fetchUsersStart, 
  fetchUsersSuccess, 
  fetchUsersFailure,
  selectUsers,
  selectUsersLoading,
  selectUsersError,
} from '../../redux/userSlice';

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);

  // New state for search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const matchesSearch = searchQuery.trim() === '' || 
        user.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, filterStatus]);

  const fetchUsers = async () => {
    try {
      dispatch(fetchUsersStart());
      
      const response = await axios.get('http://localhost:3000/api/v1/admin/users', {
        withCredentials: true
      });

      if (response.data.success) {
        dispatch(fetchUsersSuccess(response.data.users));
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch(fetchUsersFailure(error.message));
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        navigate('/admin/login');
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  const handleStatusToggle = async (user) => {
    try {
      console.log('Toggling status for user:', user._id);
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      const response = await axios.patch(
        `http://localhost:3000/api/v1/admin/user/${user._id}/status`,
        { status: newStatus },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Response:', response.data);

      if (response.data.success) {
        const updatedUsers = users.map(u => 
          u._id === user._id ? { ...u, status: newStatus } : u
        );
        dispatch(fetchUsersSuccess(updatedUsers));
        toast.success(`User status changed to ${newStatus}`);
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        navigate('/admin/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update status');
      }
    }
  };

  const renderUserAvatar = (user) => {
    if (user.profilePicture) {
      return (
        <img
          src={user.profilePicture}
          alt={user.fullname || 'User'}
          className="h-10 w-10 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullname || user.email)}&background=6366f1&color=fff`;
          }}
        />
      );
    }

    return (
      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
        <span className="text-purple-600 font-medium">
          {user.fullname?.charAt(0) || user.email?.charAt(0) || <User className="h-5 w-5" />}
        </span>
      </div>
    );
  };

  const renderActionButtons = (user) => (
    <div className="flex space-x-2 justify-end">
      <button
        onClick={() => window.location.href = `mailto:${user.email}`}
        className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
        title="Send email"
      >
        <Mail className="h-5 w-5" />
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header and Search/Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Users Management ({users?.length || 0})
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full sm:w-auto border rounded-md px-3 py-2 bg-white hover:bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Results Summary */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="text-sm text-gray-500">
              Showing {filteredUsers.length} of {users?.length || 0} users
              {searchQuery && ` matching "${searchQuery}"`}
              {filterStatus !== 'all' && ` with status "${filterStatus}"`}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderUserAvatar(user)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullname || 'N/A'}
                            </div>
                            {user.role && (
                              <div className="text-xs text-gray-500">
                                {user.role}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(user)}
                          className={`inline-flex items-center px-3 py-1 rounded-full ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          } transition-colors duration-200`}
                          title={`Click to ${user.status === 'active' ? 'deactivate' : 'activate'} user`}
                        >
                          {user.status === 'active' ? (
                            <ToggleRight className="h-4 w-4 mr-1" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 mr-1" />
                          )}
                          {user.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {renderActionButtons(user)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <User className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm text-gray-400">
                          {searchQuery || filterStatus !== 'all' 
                            ? 'Try adjusting your search or filter criteria'
                            : 'No users have been added yet'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;