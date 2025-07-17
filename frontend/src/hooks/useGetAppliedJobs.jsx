import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
                console.log(res.data); // Check if you get the expected data structure
                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.application)); // Ensure this matches the API response
                } else {
                    console.log("Failed to fetch applied jobs:", res.data.message);
                }
            } catch (error) {
                console.error("Error fetching applied jobs:", error);
            }
        };

        fetchAppliedJobs();
    }, [dispatch]); // Include dispatch in dependencies
};

export default useGetAppliedJobs;
