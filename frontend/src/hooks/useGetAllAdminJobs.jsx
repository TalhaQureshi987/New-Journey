import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useSelector(state => state.auth);
    const { allAdminJobs } = useSelector(state => state.job);

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            if (!user) {
                console.log('No user found, skipping job fetch');
                setIsLoading(false);
                return;
            }

            try {
                console.log('Making API request for user:', {
                    userId: user._id,
                    role: user.role
                });

                const response = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
                    withCredentials: true,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                console.log('API Response:', {
                    success: response.data.success,
                    jobCount: response.data.jobs?.length,
                    jobs: response.data.jobs
                });

                if (response.data.success) {
                    dispatch(setAllAdminJobs(response.data.jobs));
                }
            } catch (error) {
                console.error('Error details:', {
                    message: error.message,
                    status: error.response?.status,
                    data: error.response?.data,
                    stack: error.stack
                });
                
                if (error.response?.status === 401) {
                    toast.error("Please login again");
                    navigate('/login');
                } else {
                    toast.error("Failed to fetch jobs");
                }
                
                dispatch(setAllAdminJobs([]));
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllAdminJobs();
    }, [dispatch, user, navigate]);

    useEffect(() => {
        console.log('Current Redux state:', {
            jobsInStore: allAdminJobs?.length,
            jobs: allAdminJobs
        });
    }, [allAdminJobs]);

    return { isLoading };
};

export default useGetAllAdminJobs;