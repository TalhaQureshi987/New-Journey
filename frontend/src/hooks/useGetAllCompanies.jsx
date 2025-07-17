import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCompanies, setError } from '../redux/companySlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Create an axios instance with default config
const api = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await api.get('http://localhost:3000/api/v1/company/my-companies');

                if (response.data.success) {
                    dispatch(setCompanies(response.data.companies));
                } else {
                    toast.error(response.data.message || 'Failed to fetch companies');
                    dispatch(setError(response.data.message));
                }
            } catch (error) {
                console.error('Error fetching companies:', error.response?.data || error);
                
                // Handle different error scenarios
                if (error.response?.status === 401) {
                    toast.error('Please login to continue');
                    navigate('/login', { replace: true });
                } else if (error.response?.status === 403) {
                    toast.error('Access denied. Recruiter only route.');
                    navigate('/jobs', { replace: true });
                } else {
                    toast.error(error.response?.data?.message || 'Failed to fetch companies');
                }
                
                dispatch(setError(error.response?.data?.message || 'Authentication failed'));
                dispatch(setCompanies([]));
            }
        };

        fetchCompanies();
    }, [dispatch, navigate]);
};

export default useGetAllCompanies;