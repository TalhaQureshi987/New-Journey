import { setSingleCompany } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSingleCompany = async () => {
            if (!companyId) return;
            
            setLoading(true);
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`,{withCredentials:true});
                console.log(res.data.company);
                if(res.data.success){
                    dispatch(setSingleCompany(res.data.company));
                } else {
                    throw new Error(res.data.message || 'Failed to fetch company');
                }
            } catch (error) {
                console.error('Error fetching company:', error);
                setError(error.message);
                toast.error(error.response?.data?.message || 'Failed to fetch company');
            } finally {
                setLoading(false);
            }
        }
        fetchSingleCompany();

        // Cleanup function
        return () => {
            dispatch(setSingleCompany(null));
        };
    },[companyId, dispatch])

    // Return the loading and error states
    return { loading, error };
}

export default useGetCompanyById