import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import LoadingSpinner from "../minicomponents/LoadingSpinner";

const ProtectedRoute = () => {
    const { user, loading } = useSelector(store => store.auth);

    if (loading) {
        return <LoadingSpinner />;
    }

    // Check if user is not authenticated or not a recruiter
    if (!user || user.role !== 'recruiter') {
        return <Navigate to="/login" replace />;
    }

    // Render child routes
    return <Outlet />;
};

export default ProtectedRoute;