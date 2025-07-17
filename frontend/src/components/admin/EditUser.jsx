import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import AdminLayout from './AdminLayout';
import LoadingSpinner from '../minicomponents/LoadingSpinner';
import {
  setSelectedUser,
  clearSelectedUser,
  updateUserSuccess,
  selectSelectedUser,
  selectUsersLoading
} from '../../redux/userSlice';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedUser = useSelector(selectSelectedUser);
  const loading = useSelector(selectUsersLoading);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    status: 'inactive',
    role: 'user'
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          toast.error('Please login first');
          navigate('/admin/login');
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/v1/admin/user/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('API Response:', response.data); // Debug log

        if (response.data.success && response.data.user) {
          const userData = response.data.user;
          dispatch(setSelectedUser(userData));
          setFormData({
            fullname: userData.fullname || '',
            email: userData.email || '',
            status: userData.status || 'inactive',
            role: userData.role || 'user'
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch user details');
      }
    };

    fetchUser();
  }, [id, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `http://localhost:3000/api/v1/admin/user/${id}`,
        formData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        dispatch(updateUserSuccess(response.data.user));
        toast.success('User updated successfully');
        navigate('/admin/users');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  // Debug logs
  console.log('Selected User:', selectedUser);
  console.log('Form Data:', formData);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit User
            </h1>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/users')}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? <LoadingSpinner /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditUser; 