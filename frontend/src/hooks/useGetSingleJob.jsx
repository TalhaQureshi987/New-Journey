import { setLoading } from '@/redux/authSlice';
import { setSingleJob } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

const useGetSingleJob = (jobId) => {
    const dispatch = useDispatch();
    console.log(jobId);
    

    useEffect(() => {
        const fetchSingleJob = async () => {
            if (!jobId) return;
            
            try {
                dispatch(setLoading(true));
                const response = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`);
                
                if (response.data.success) {
                    dispatch(setSingleJob(response.data.job));  
                } else {
                    toast.error(response.data.message || 'Failed to fetch job details');
                }
            } catch (error) {
                console.error("Failed to fetch job data:", error);
                toast.error(error.response?.data?.message || 'Error fetching job details');
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchSingleJob();
    }, [jobId, dispatch]);
};

export default useGetSingleJob;