import React, { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const CreateAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        permissions: ['limited']
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/api/admin/create', formData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (response.data.success) {
                toast.success('Admin created successfully');
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    permissions: ['limited']
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating admin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h2 className="text-2xl font-bold mb-6">Create New Admin</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <div className="mt-1 relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="pl-10 w-full rounded-md border border-gray-300 p-2"
                            required
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="pl-10 w-full rounded-md border border-gray-300 p-2"
                            required
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="mt-1 relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="pl-10 pr-10 w-full rounded-md border border-gray-300 p-2"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Admin'}
                </button>
            </form>
        </div>
    );
};

export default CreateAdmin;