import React, { useState, useEffect, useMemo, useCallback } from "react";
import Navbar from "./shared/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Users,
  Briefcase,
  Building,
  TrendingUp,
  Star,
  Globe,
  Building2,
  Filter,
  ChevronDown,
} from "lucide-react";
import Footer from "./shared/footer";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        industry: "all",
        size: "all",
        location: "all"
    });
    const navigate = useNavigate();

    // Industry and size options with proper values
    const industryOptions = [
        { value: "all", label: "All Industries" },
        { value: "technology", label: "Technology" },
        { value: "healthcare", label: "Healthcare" },
        { value: "finance", label: "Finance" },
        { value: "education", label: "Education" },
        { value: "manufacturing", label: "Manufacturing" },
        { value: "retail", label: "Retail" },
        { value: "media", label: "Media" },
        { value: "construction", label: "Construction" },
        { value: "others", label: "Others" }
    ];

    const sizeOptions = [
        { value: "all", label: "All Sizes" },
        { value: "1-50", label: "1-50 employees" },
        { value: "51-200", label: "51-200 employees" },
        { value: "201-500", label: "201-500 employees" },
        { value: "501-1000", label: "501-1000 employees" },
        { value: "1000+", label: "1000+ employees" }
    ];

    const locationOptions = [
        { value: "all", label: "All Locations" },
        { value: "remote", label: "Remote" },
        { value: "mumbai", label: "Mumbai" },
        { value: "bangalore", label: "Bangalore" },
        { value: "delhi", label: "Delhi" },
        { value: "hyderabad", label: "Hyderabad" },
        { value: "pune", label: "Pune" },
        { value: "chennai", label: "Chennai" },
        { value: "kolkata", label: "Kolkata" }
    ];

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/api/v1/company/all');
                if (response.data.success) {
                    setCompanies(response.data.companies);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error('Error fetching companies:', error);
                toast.error('Failed to fetch companies');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const filteredCompanies = useMemo(() => {
        return companies.filter((company) => {
            const matchesSearch = 
                company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.description?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesIndustry = filters.industry === "all" || 
                                  company.industry?.toLowerCase() === filters.industry;
            const matchesSize = filters.size === "all" || 
                              company.size === filters.size;
            const matchesLocation = filters.location === "all" || 
                                  company.location?.toLowerCase() === filters.location;

            return matchesSearch && matchesIndustry && matchesSize && matchesLocation;
        });
    }, [companies, searchTerm, filters]);

    const handleSearch = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const handleFilterChange = useCallback((filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    }, []);

    if (loading) {
        return <CompaniesLoadingSkeleton />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Hero Section with Search */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-center mb-4">
                        Discover Your Next Career Move
                    </h1>
                    <p className="text-center text-lg mb-8 text-purple-100">
                        Explore opportunities at top companies across India
                    </p>
                    <div className="max-w-3xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search companies by name, industry, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-4 px-6 pl-14 rounded-lg bg-white text-gray-900 shadow-lg focus:ring-2 focus:ring-purple-300 focus:outline-none"
                        />
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="w-full sm:w-1/3">
                            <Select
                                value={filters.industry}
                                onValueChange={(value) => 
                                    setFilters(prev => ({...prev, industry: value}))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Industry" />
                                </SelectTrigger>
                                <SelectContent>
                                    {industryOptions.map(({ value, label }) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:w-1/3">
                            <Select
                                value={filters.size}
                                onValueChange={(value) => 
                                    setFilters(prev => ({...prev, size: value}))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Company Size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sizeOptions.map(({ value, label }) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full sm:w-1/3">
                            <Select
                                value={filters.location}
                                onValueChange={(value) => 
                                    setFilters(prev => ({...prev, location: value}))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locationOptions.map(({ value, label }) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Companies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.map((company) => (
                        <CompanyCard 
                            key={company._id} 
                            company={company}
                            onClick={() => navigate(`/company/${company._id}`)}
                        />
                    ))}
                </div>

                {/* No Results */}
                {filteredCompanies.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No companies found matching your criteria
                        </p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

const CompanyCard = React.memo(({ company, onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={onClick}
        >
            <div className="p-6">
                <div className="flex items-center gap-4">
                    <img
                        src={company.logo || "/company-placeholder.png"}
                        alt={company.name}
                        className="w-16 h-16 rounded-lg object-contain bg-gray-50 p-2"
                    />
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">{company.name}</h3>
                        <p className="text-gray-600">{company.industry || "Industry not specified"}</p>
                    </div>
                </div>
                
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{company.location || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{company.size || "Company size not specified"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        <span>{company.jobCount || 0} open positions</span>
                    </div>
                </div>

                {company.description && (
                    <p className="mt-4 text-gray-600 text-sm line-clamp-2">
                        {company.description}
                    </p>
                )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors duration-300">
                    View Company Profile
                </button>
            </div>
        </motion.div>
    );
});

const CompaniesLoadingSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-64" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                            <div className="h-16 bg-gray-200 rounded-lg mb-4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Companies;