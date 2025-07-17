import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    Calendar,
    Download,
    Users,
    Briefcase,
    Building2
} from 'lucide-react';

// StatCard Component with improved percentage calculation
const StatCard = ({ icon, title, value, growth, onClick, isSelected }) => {
    // Format the growth value to 1 decimal place and handle undefined/null
    const formattedGrowth = typeof growth === 'number' 
        ? Number(growth).toFixed(1) 
        : '0.0';

    // Format the value to add commas for thousands
    const formattedValue = typeof value === 'number' 
        ? value.toLocaleString() 
        : '0';

    return (
        <div
            onClick={onClick}
            className={`p-6 bg-white rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-purple-500' : ''
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="p-2 bg-purple-50 rounded-lg">
                    {icon}
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    parseFloat(formattedGrowth) >= 0 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-red-50 text-red-600'
                }`}>
                    {parseFloat(formattedGrowth) >= 0 ? '+' : ''}{formattedGrowth}%
                </div>
            </div>
            <h3 className="mt-4 text-gray-600">{title}</h3>
            <p className="text-2xl font-semibold mt-1">{formattedValue}</p>
        </div>
    );
};

// TrendChart Component
const TrendChart = ({ data, metric }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="value"
                    name={metric.charAt(0).toUpperCase() + metric.slice(1)}
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

// UserStatsChart Component
const UserStatsChart = ({ activeUsers, inactiveUsers }) => {
    const data = [
        { name: 'Active Users', value: activeUsers },
        { name: 'Inactive Users', value: inactiveUsers }
    ];
    const COLORS = ['#22c55e', '#f97316']; // Green and Orange colors
    const total = activeUsers + inactiveUsers;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm w-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">User Statistics</h3>
                <div className="text-sm text-gray-500">Total Users: {total}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill="white"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} users`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                    {data.map((entry, index) => (
                        <div key={entry.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                                <span className="text-sm font-medium">{entry.name}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="font-semibold">{entry.value}</span>
                                <span className="text-xs text-gray-500">
                                    {((entry.value / total) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// CompanyStatsChart Component
const CompanyStatsChart = ({ activeCompanies, inactiveCompanies }) => {
    const data = [
        { name: 'Active Companies', value: activeCompanies },
        { name: 'Inactive Companies', value: inactiveCompanies }
    ];
    const COLORS = ['#0ea5e9', '#ef4444']; // Blue and Red colors
    const total = activeCompanies + inactiveCompanies;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm w-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Company Statistics</h3>
                <div className="text-sm text-gray-500">Total Companies: {total}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                                    return (
                                        <text
                                            x={x}
                                            y={y}
                                            fill="white"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value} companies`} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                    {data.map((entry, index) => (
                        <div key={entry.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                                <span className="text-sm font-medium">{entry.name}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="font-semibold">{entry.value}</span>
                                <span className="text-xs text-gray-500">
                                    {((entry.value / total) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main Reports Component
const Reports = () => {
    const [dateRange, setDateRange] = useState('month');
    const [selectedMetric, setSelectedMetric] = useState('users');
    const [exportFormat, setExportFormat] = useState('csv');
     const API_URL = 'http://localhost:3000';
    // Fetch report data
    const { data: reportData, isLoading, error } = useQuery(
        ['reports', dateRange],
        async () => {
            const response = await axios.get(`${API_URL}/api/v1/admin/reports`, {
                params: { range: dateRange },
                withCredentials: true
            });
            return response.data;
        },
        {
            refetchInterval: 300000, // Refetch every 5 minutes
            staleTime: 240000 // Consider data stale after 4 minutes
        }
    );

    // Handle export
    const handleExport = async () => {
        try {
            const response = await axios.post(
                `${API_URL}/api/v1/admin/reports/export`,
                { format: exportFormat, range: dateRange },
                {
                    responseType: 'blob',
                    withCredentials: true
                }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${Date.now()}.${exportFormat}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('Report exported successfully');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export report');
        }
    };

    // Get stats from report data
    const getStats = () => {
        if (!reportData?.data?.overview) return {
            users: { total: 0, growth: 0 },
            jobs: { total: 0, growth: 0 },
            companies: { total: 0, growth: 0 }
        };

        const { overview } = reportData.data;
        return {
            users: {
                total: overview.users.total || 0,
                growth: overview.users.growth || 0
            },
            jobs: {
                total: overview.activeJobs.total || 0,
                growth: overview.activeJobs.growth || 0
            },
            companies: {
                total: overview.companies.total || 0,
                growth: overview.companies.growth || 0
            }
        };
    };

    const stats = getStats();

    if (isLoading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">Error loading reports</div>;

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="h-6 w-6" />
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-600 mt-1">Track your platform's performance</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="border rounded-lg px-4 py-2 bg-white"
                    >
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="quarter">Last Quarter</option>
                        <option value="year">Last Year</option>
                    </select>
                    <div className="flex gap-2">
                        <select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className="border rounded-lg px-4 py-2 bg-white"
                        >
                            <option value="csv">CSV</option>
                            <option value="pdf">PDF</option>
                        </select>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Download size={20} />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={<Users className="h-6 w-6 text-purple-600" />}
                    title="Total Users"
                    value={stats.users.total}
                    growth={stats.users.growth}
                    onClick={() => setSelectedMetric('users')}
                    isSelected={selectedMetric === 'users'}
                />
                <StatCard
                    icon={<Briefcase className="h-6 w-6 text-purple-600" />}
                    title="Active Jobs"
                    value={stats.jobs.total}
                    growth={stats.jobs.growth}
                    onClick={() => setSelectedMetric('jobs')}
                    isSelected={selectedMetric === 'jobs'}
                />
                <StatCard
                    icon={<Building2 className="h-6 w-6 text-purple-600" />}
                    title="Total Companies"
                    value={stats.companies.total}
                    growth={stats.companies.growth}
                    onClick={() => setSelectedMetric('companies')}
                    isSelected={selectedMetric === 'companies'}
                />
            </div>

            {/* Trend Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">
                    {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Trend
                </h3>
                <div className="h-[300px]">
                    <TrendChart
                        data={reportData?.data?.timeSeriesData?.[selectedMetric] || []}
                        metric={selectedMetric}
                    />
                </div>
            </div>

            {/* User and Company Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserStatsChart 
                    activeUsers={reportData?.data?.userStats?.active || 0}
                    inactiveUsers={reportData?.data?.userStats?.inactive || 0}
                />
                <CompanyStatsChart 
                    activeCompanies={reportData?.data?.companyStats?.active || 0}
                    inactiveCompanies={reportData?.data?.companyStats?.inactive || 0}
                />
            </div>
        </div>
    );
};

export default Reports;

