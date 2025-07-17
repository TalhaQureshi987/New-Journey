import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';
import { Building2, ArrowLeft, Loader2 } from 'lucide-react';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const registerNewCompany = async () => {
        if (loading) return;
        if (!companyName.trim()) {
            toast.error("Company name is required");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                `${COMPANY_API_END_POINT}/register`,
                { companyName },
                { withCredentials: true }
            );
            if (res.data.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                navigate(`/recruiter/companies/${res.data.company._id}`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/recruiter/companies")}
                    className="mb-8 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Companies
                </Button>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center justify-center mb-8">
                        <div className="bg-indigo-100 rounded-full p-4">
                            <Building2 className="h-8 w-8 text-indigo-600" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Create New Company
                        </h1>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Start by giving your company a name. Don't worry, you can add more details later.
                        </p>
                    </div>

                    <div className="max-w-md mx-auto space-y-4">
                        <div className="space-y-2">
                            <Label className="text-gray-700">Company Name</Label>
                            <Input
                                type="text"
                                className="w-full border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                placeholder="e.g., Acme Corporation"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => navigate("/recruiter/companies")}
                                className="w-full sm:w-1/2 border-gray-200 text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={registerNewCompany}
                                disabled={loading}
                                className="w-full sm:w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Company'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
