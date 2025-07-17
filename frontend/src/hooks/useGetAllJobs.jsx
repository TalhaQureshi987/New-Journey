import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`);
                
                if (res.data?.success && Array.isArray(res.data.jobs)) {
                    dispatch(setAllJobs(res.data.jobs));
                } else {
                    console.error('Invalid job data structure:', res.data);
                    dispatch(setAllJobs([]));
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                dispatch(setAllJobs([]));
            }
        }
        
        fetchAllJobs();
    }, [dispatch])
}

export default useGetAllJobs