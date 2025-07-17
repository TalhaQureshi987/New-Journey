import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Building2, Globe, Mail, Phone, MapPin, Upload, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const { singleCompany } = useSelector((store) => store.company);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        contactEmail: "",
        contactPhone: "",
        file: null
    });

    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                contactEmail: singleCompany.contactEmail || "",
                contactPhone: singleCompany.contactPhone || "",
                file: null
            });
        }
    }, [singleCompany]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.name.trim()) {
            toast.error("Company name is required");
            return;
        }

        const formData = new FormData();
        Object.keys(input).forEach(key => {
            if (input[key]) formData.append(key, input[key]);
        });

        setLoading(true);
        try {
            const res = await axios.put(
                `${COMPANY_API_END_POINT}/update/${params.id}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/recruiter/companies');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update company");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/recruiter/companies')}
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

                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
                        Company Details
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-gray-700">Company Name</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="name"
                                        value={input.name}
                                        onChange={(e) => setInput({ ...input, name: e.target.value })}
                                        className="pl-10"
                                        placeholder="Enter company name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700">Website</Label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="website"
                                        value={input.website}
                                        onChange={(e) => setInput({ ...input, website: e.target.value })}
                                        className="pl-10"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700">Contact Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="contactEmail"
                                        value={input.contactEmail}
                                        onChange={(e) => setInput({ ...input, contactEmail: e.target.value })}
                                        className="pl-10"
                                        placeholder="contact@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700">Contact Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="contactPhone"
                                        value={input.contactPhone}
                                        onChange={(e) => setInput({ ...input, contactPhone: e.target.value })}
                                        className="pl-10"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="location"
                                        value={input.location}
                                        onChange={(e) => setInput({ ...input, location: e.target.value })}
                                        className="pl-10"
                                        placeholder="Enter location"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700">Description</Label>
                                <Textarea
                                    name="description"
                                    value={input.description}
                                    onChange={(e) => setInput({ ...input, description: e.target.value })}
                                    className="pl-10"
                                    placeholder="Enter description"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700">Logo</Label>
                                <Input
                                    name="file"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setInput({ ...input, file: e.target.files?.[0] })}
                                    className="pl-10"
                                    placeholder="Upload logo"
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
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Company'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompanySetup;
