import React, { useState, useEffect, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "../../redux/adminAuthslice";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    if (isAuthenticated) {
      startTransition(() => {
        navigate('/admin/dashboard', { replace: true });
      });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error("Please fill in all fields");
      return;
    }

    dispatch(loginStart());

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/admin/login',
        credentials,
        { withCredentials: true }
      );

      if (response.data.success) {
        startTransition(() => {
          dispatch(loginSuccess(response.data.admin));
          toast.success('Login successful');
          navigate('/admin/dashboard');
        });
      } else {
        toast.error(response.data.message || 'Login failed');
        dispatch(loginFailure(response.data.message));
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 relative">
      <button 
        onClick={() => startTransition(() => navigate('/'))} 
        className="absolute top-4 left-4 flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Home</span>
      </button>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Admin Portal</h2>
          <p className="text-gray-400">Access your admin dashboard</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || isPending}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading || isPending ? (
                <span>Signing in...</span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
