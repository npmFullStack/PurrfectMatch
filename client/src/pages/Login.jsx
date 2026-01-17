import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    AlertCircle,
    LogIn
} from "lucide-react";
import axios from "axios";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Button from "@/components/common/Button";
import loginImg from "@/assets/images/authImg.png";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Send login request to backend
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            );

            if (response.data.success) {
                // Save token to localStorage or context
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.data.data.user)
                );

                // Redirect to home or dashboard
                navigate("/dashboard");
            } else {
                setError(response.data.message || "Login failed");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "An error occurred during login. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/auth/google";
    };

    return (
        <main className="min-h-screen">
            <Header />
            
            {/* Background with gradient overlay */}
            <div className="fixed inset-0 -z-10">
                <img 
                    src={loginImg} 
                    alt="Pet adoption background" 
                    className="w-full h-full object-cover"
                />
                {/* White gradient at top */}
                <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent"></div>
            </div>

            <section className="pt-24 pb-16 relative z-10">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-heading text-gray-900 mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-gray-600">
                                Sign in to your PurrfectMatch account
                            </p>
                        </div>

                        {/* Login Form */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Error Message */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                {/* Email Input */}
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 
                                            focus:border-primary focus:ring-2 focus:ring-primary/20 
                                            transition-colors duration-300 outline-none"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 
                                            focus:border-primary focus:ring-2 focus:ring-primary/20 
                                            transition-colors duration-300 outline-none"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-gray-700 text-sm">
                                            Remember me
                                        </span>
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-primary hover:text-primary/80 text-sm font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    leftIcon={<LogIn className="h-5 w-5" />}
                                    isLoading={isLoading}
                                >
                                    Sign In
                                </Button>
                            </form>

                            {/* Social Login Button - MOVED TO BOTTOM */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
                                    onClick={handleGoogleLogin}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <img 
                                            src="https://www.google.com/favicon.ico" 
                                            alt="Google" 
                                            className="h-5 w-5"
                                        />
                                        <span>Sign in with Google</span>
                                    </div>
                                </Button>
                            </div>

                            {/* Sign Up Link */}
                            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                <p className="text-gray-600">
                                    Don't have an account?{" "}
                                    <Link
                                        to="/register"
                                        className="text-primary hover:text-primary/80 font-semibold"
                                    >
                                        Sign up here
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default Login;