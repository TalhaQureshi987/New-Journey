import React, { Suspense, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  Briefcase,
  Building2,
  Factory
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAdmin, logout } from '../../redux/adminAuthslice';
import axios from 'axios';
import { toast } from 'sonner';
import LoadingSpinner from '../minicomponents/LoadingSpinner';

const menuItems = [
  { 
    title: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/admin/dashboard',
    description: 'Overview of system metrics'
  },
  { 
    title: 'Users', 
    icon: Users, 
    path: '/admin/users',
    description: 'Manage user accounts'
  },
  { 
    title: 'Jobs', 
    icon: Briefcase, 
    path: '/admin/jobs',
    description: 'Manage job listings'
  },
  { 
    title: 'Companies', 
    icon: Building2, 
    path: '/admin/companies',
    description: 'Manage registered companies'
  },
  { 
    title: 'Industries', 
    icon: Factory, 
    path: '/admin/industries',
    description: 'Manage industry categories'
  },
  { 
    title: 'Reports', 
    icon: FileText, 
    path: '/admin/reports',
    description: 'View analytics and reports'
  }
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const admin = useSelector(selectAdmin);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !admin) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, admin, navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/v1/admin/logout', {}, { withCredentials: true });
      dispatch(logout());
      navigate('/admin/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-white shadow-lg z-40 w-64 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:z-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6">
            <h1 className="text-2xl font-bold text-purple-600">Admin Panel</h1>
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-purple-600">Admin Panel</h1>
        </div>

        {/* Content */}
        <div className="p-6">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;