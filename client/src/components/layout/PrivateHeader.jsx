import { useState } from "react";
import {
    Menu,
    X,
    Search,
    User,
    LogOut,
    Settings,
    ChevronDown,
    Bell,
    MessageSquare
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivateHeader = ({
    toggleSidebar,
    user,
    isMobile,
    isSidebarCollapsed,
    isSidebarOpen
}) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between shadow-sm w-full">
            {/* Left: Sidebar Toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label={
                        isMobile
                            ? isSidebarOpen
                                ? "Close sidebar"
                                : "Open sidebar"
                            : "Toggle sidebar"
                    }
                >
                    {isMobile && isSidebarOpen ? (
                        <X className="h-5 w-5 text-gray-600" />
                    ) : (
                        <Menu className="h-5 w-5 text-gray-600" />
                    )}
                </button>

                {/* Search Bar - Hidden on mobile */}
                <div className="relative hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search pets, users, or settings..."
                        className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                    />
                </div>
            </div>

<div className="flex items-center gap-2 mr-4">
    {/* Message Icon */}
    <button
        onClick={() => navigate("/messages")}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
        aria-label="Messages"
    >
        <MessageSquare className="h-5 w-5 text-gray-600" />
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            3
        </span>
    </button>

    {/* Notification Icon */}
    <button
        onClick={() => {/* Handle notification click */}}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
        aria-label="Notifications"
    >
        <Bell className="h-5 w-5 text-gray-600" />
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            5
        </span>
    </button>
</div>
            {/* Right: User Menu */}
            <div className="relative">
                <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-900">
                            {user?.first_name ||
                                user?.email?.split("@")[0] ||
                                "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[120px]">
                            {user?.email || "user@example.com"}
                        </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsUserMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {user?.first_name || "User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                    // Navigate to account settings
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                                <Settings className="h-4 w-4" />
                                <span>Account Settings</span>
                            </button>

                            <button
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default PrivateHeader;
