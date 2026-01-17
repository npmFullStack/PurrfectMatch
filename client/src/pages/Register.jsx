import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, UserPlus } from "lucide-react";
import axios from "axios";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Button from "@/components/common/Button";
import registerImg from "@/assets/images/authImg.png";

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password strength
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                // Save token to localStorage or context
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.data.user));
                
                // Redirect to dashboard
                navigate("/dashboard");
            } else {
                setError(response.data.message || "Registration failed");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError(
                err.response?.data?.message || 
                err.message || 
                "An error occurred during registration. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/auth/google";
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword({
            ...showPassword,
            [field]: !showPassword[field],
        });
    };

    return (
        <main className="min-h-screen">
            <Header />
            
            {/* Background with gradient overlay */}
            <div className="fixed inset-0 -z-10">
                <img 
                    src={registerImg} 
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
                                Join PurrfectMatch
                            </h1>
                            <p className="text-gray-600">
                                Create your account to start your pet adoption journey
                            </p>
                        </div>

                        {/* Registration Form */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Error Message */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <span className="text-sm">{error}</span>
                                    </div>
                                )}

                                {/* First Name Input */}
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        First Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 
                                            focus:border-primary focus:ring-2 focus:ring-primary/20 
                                            transition-colors duration-300 outline-none"
                                            placeholder="John"
                                        />
                                    </div>
                                </div>

                                {/* Last Name Input */}
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Last Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 
                                            focus:border-primary focus:ring-2 focus:ring-primary/20 
                                            transition-colors duration-300 outline-none"
                                            placeholder="Doe"
                                        />
                                    </div>
                                </div>

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
                                            type={showPassword.password ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 
                                            focus:border-primary focus:ring-2 focus:ring-primary/20 
                                            transition-colors duration-300 outline-none"
                                            placeholder="At least 6 characters"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility("password")}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword.password ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Password must be at least 6 characters long
                                    </p>
                                </div>

                                {/* Confirm Password Input */}
                                <div>
                                    <label className="block text-gray-700 mb-2 font-medium">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showPassword.confirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-300 
                                            focus:border-primary focus:ring-2 focus:ring-primary/20 
                                            transition-colors duration-300 outline-none"
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility("confirmPassword")}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword.confirmPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Terms Agreement */}
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        required
                                        className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-gray-700 text-sm">
                                        I agree to the{" "}
                                        <Link to="/terms" className="text-primary hover:text-primary/80 font-medium">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link to="/privacy" className="text-primary hover:text-primary/80 font-medium">
                                            Privacy Policy
                                        </Link>
                                    </span>
                                </label>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    leftIcon={<UserPlus className="h-5 w-5" />}
                                    isLoading={isLoading}
                                >
                                    Create Account
                                </Button>
                            </form>

                            {/* Social Registration Button - MOVED TO BOTTOM */}
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
                                        <span>Sign up with Google</span>
                                    </div>
                                </Button>
                            </div>

                            {/* Login Link */}
                            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                <p className="text-gray-600">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login"
                                        className="text-primary hover:text-primary/80 font-semibold"
                                    >
                                        Sign in here
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

export default Register;