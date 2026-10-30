import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    let user = null;
    try {
        const stored = localStorage.getItem("user");
        if (stored) {
            user = JSON.parse(stored);
        }
    } catch {
        user = null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;
