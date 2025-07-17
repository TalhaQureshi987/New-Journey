import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectAdmin } from "../../redux/adminAuthslice";
import { useState, useEffect } from "react";

const ProtectedAdminRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const admin = useSelector(selectAdmin);
    const location = useLocation();

    // Add a loading state
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state
        if (isAuthenticated && admin) {
            setLoading(false);
        } else {
            setLoading(false); // Ensure loading is set to false if not authenticated
        }
    }, [isAuthenticated, admin]);

    // Check if still loading
    if (loading) {
        return <div>Loading...</div>; // or a spinner component
    }

    // Debug logging
    console.log('Protected Route Status:', { 
        isAuthenticated, 
        hasAdmin: !!admin,
        currentPath: location.pathname,
        admin: admin ? {
            id: admin._id,
            name: admin.name,
            role: admin.role
        } : null
    });

    // Check authentication and admin status
    if (!isAuthenticated || !admin) {
        console.log('Access denied:', {
            isAuthenticated,
            hasAdmin: !!admin,
            redirectTo: '/admin/login',
            from: location.pathname
        });

        // Save the attempted URL and redirect to login
        return (
            <Navigate 
                to="/admin/login" 
                state={{ 
                    from: location,
                    message: !isAuthenticated 
                        ? "Please login to access this page" 
                        : "Admin access required"
                }} 
                replace 
            />
        );
    }

    // Verify admin role (optional additional security)
    if (admin.role !== 'admin') {
        console.log('Invalid role:', {
            expectedRole: 'admin',
            actualRole: admin.role
        });
        
        return (
            <Navigate 
                to="/admin/login" 
                state={{ 
                    from: location,
                    message: "Insufficient permissions" 
                }} 
                replace 
            />
        );
    }

    // If all checks pass, render the protected content
    console.log('Access granted to:', location.pathname);
    return children;
};

export default ProtectedAdminRoute;