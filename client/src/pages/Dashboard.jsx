import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon, Mail, Phone } from "lucide-react";
import Button from "@/components/common/Button";

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        
        if (!token || !storedUser) {
            navigate("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        } catch (error) {
            console.error("Error parsing user data:", error);
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-primary rounded-lg"></div>
                            <h1 className="text-xl font-bold text-gray-900">PurrfectMatch</h1>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<LogOut className="h-4 w-4" />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Welcome Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    Welcome back, {user.first_name || user.email}!
                                </h1>
                                <p className="text-gray-600">
                                    Manage your pet adoption journey from your dashboard
                                </p>
                            </div>
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <UserIcon className="h-8 w-8 text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* User Info Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <UserIcon className="h-6 w-6 text-primary" />
                            Your Profile
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email Info */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email Address</p>
                                        <p className="font-medium text-gray-900">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Phone Info */}
                            {user.phone && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Phone className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="font-medium text-gray-900">{user.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Name Info */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <UserIcon className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Full Name</p>
                                        <p className="font-medium text-gray-900">
                                            {user.first_name || user.last_name 
                                                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                                : 'Not set'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Username Info */}
                            {user.username && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <UserIcon className="h-5 w-5 text-yellow-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Username</p>
                                            <p className="font-medium text-gray-900">{user.username}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Member Since</p>
                                    <p className="font-medium">
                                        {user.created_at 
                                            ? new Date(user.created_at).toLocaleDateString() 
                                            : 'Recent'}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Account Type</p>
                                    <p className="font-medium">
                                        {user.google_id ? 'Google' : 
                                         user.facebook_id ? 'Facebook' : 
                                         'Email'}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                                    <UserIcon className="h-5 w-5 text-primary" />
                                </div>
                                <span>Edit Profile</span>
                            </Button>
                            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <span>Preferences</span>
                            </Button>
                            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                                    <Phone className="h-5 w-5 text-green-600" />
                                </div>
                                <span>Notifications</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;