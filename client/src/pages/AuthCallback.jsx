// AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleCallback = async () => {
            // Get token from URL
            const params = new URLSearchParams(location.search);
            const token = params.get("token");

            if (token) {
                try {
                    // Store token
                    localStorage.setItem("token", token);
                    
                    // Parse token to get user data
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const userData = JSON.parse(window.atob(base64));
                    
                    localStorage.setItem("user", JSON.stringify(userData.user));
                    
                    // Redirect to dashboard
                    navigate("/dashboard", { replace: true });
                } catch (error) {
                    console.error("Error processing callback:", error);
                    navigate("/login", { replace: true });
                }
            } else {
                navigate("/login", { replace: true });
            }
        };

        handleCallback();
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback;