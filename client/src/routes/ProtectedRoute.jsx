import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, isAuthenticated, loading, isAdmin } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Not logged in
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Admin only route check
    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;