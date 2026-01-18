import { useState, useEffect } from "react";
import {
    Menu,
    X,
    Search,
    User,
    LogOut,
    Settings,
    ChevronDown,
    Bell
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
    const [avatarUrl, setAvatarUrl] = useState("");
    const navigate = useNavigate();

    // Load avatar from user data
    useEffect(() => {
        if (user) {
            // Check for avatar_url first (new structure), then avatar (old structure)
            const avatar = user.avatar_url || user.avatar;
            if (avatar && avatar !== 'avatarDefault.png') {
                // If it's a full URL (from Google) or a relative path
                if (avatar.startsWith('http')) {
                    setAvatarUrl(avatar);
                } else {
                    // Check if it's a default avatar or custom upload
                    if (avatar.includes('uploads/avatars/')) {
                        // Custom uploaded avatar
                        setAvatarUrl(`http://localhost:5000${avatar}`);
                    } else {
                        // Predefined avatar from public folder
                        setAvatarUrl(`/images/avatar/${avatar}`);
                    }
                }
            }
        }
    }, [user]);

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

            {/* Right: Notification & User Menu */}
            <div className="flex items-center gap-4">
                {/* Notification Icon */}
                <div className="relative">
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

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {/* Avatar Display */}
                        <div className="h-9 w-9 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                            {avatarUrl ? (
                                <img 
                                    src={avatarUrl} 
                                    alt={user?.first_name || user?.email || "User"}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        // If image fails to load, show fallback icon
                                        e.target.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <User className="h-5 w-5 text-primary" />
                            )}
                        </div>
                        
                        {/* User Info (hidden on mobile) */}
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.first_name ||
                                    user?.username ||
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
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                                {/* User Info in Dropdown */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                                            {avatarUrl ? (
                                                <img 
                                                    src={avatarUrl} 
                                                    alt={user?.first_name || "User"}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <User className="h-6 w-6 text-primary" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {user?.first_name || "User"}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user?.email}
                                            </p>
                                            {user?.username && (
                                                <p className="text-xs text-gray-400 truncate">
                                                    @{user.username}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            navigate("/profile");
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                                    >
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span>My Profile</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            navigate("/settings");
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                                    >
                                        <Settings className="h-4 w-4 text-gray-500" />
                                        <span>Account Settings</span>
                                    </button>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <button
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default PrivateHeader;