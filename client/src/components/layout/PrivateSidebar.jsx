import { NavLink } from "react-router-dom";
import {
    Home,
    PawPrint,
    Heart,
    Users,
    Settings,
    Bell,
    BarChart3,
    Calendar,
    MessageSquare,
    Shield,
    X,
    Plus, CreditCard, User
} from "lucide-react";

const PrivateSidebar = ({
    isCollapsed,
    isOpen,
    isMobile,
    toggleSidebar,
    closeSidebar
}) => {
    const navItems = [
        {
            path: "/",
            icon: <Home className="h-5 w-5" />,
            label: "Dashboard"
        },
        {
            path: "/pets",
            icon: <PawPrint className="h-5 w-5" />,
            label: "Browse Pets"
        },
        {
            path: "/my-pets",
            icon: <Heart className="h-5 w-5" />,
            label: "My Pets"
        },
        {
            path: "/sell-pet",
            icon: <Plus className="h-5 w-5" />,
            label: "Sell/Adopt Out"
        },
        {
            path: "/messages",
            icon: <MessageSquare className="h-5 w-5" />,
            label: "Messages",
            badge: true
        },
        {
            path: "/appointments",
            icon: <Calendar className="h-5 w-5" />,
            label: "Appointments"
        },
        {
            path: "/transactions",
            icon: <CreditCard className="h-5 w-5" />, // Changed icon
            label: "Transactions"
        },
        {
            path: "/analytics",
            icon: <BarChart3 className="h-5 w-5" />,
            label: "Analytics"
        },
        {
            path: "/profile",
            icon: <User className="h-5 w-5" />,
            label: "My Profile"
        }
    ];

    // Determine sidebar classes based on device and state
    const getSidebarClasses = () => {
        if (isMobile) {
            return `
                fixed top-0 left-0 h-screen bg-white border-r border-gray-200 
                transition-all duration-300 ease-in-out overflow-y-auto z-30
                shadow-xl
                ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
            `;
        } else {
            // On desktop, sidebar is always visible
            return `
                fixed top-0 left-0 h-screen bg-white border-r border-gray-200 
                transition-all duration-300 ease-in-out overflow-y-auto z-30
                ${isCollapsed ? "w-16" : "w-64"}
            `;
        }
    };

    return (
        <aside className={getSidebarClasses()}>
            {/* Logo Section with Close Button for Mobile */}
            <div className="p-4 border-b border-gray-100">
                <div
                    className={`flex items-center ${
                        isMobile
                            ? "justify-between"
                            : isCollapsed
                            ? "justify-center"
                            : ""
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <PawPrint className="h-5 w-5 text-primary" />
                        {(!isCollapsed || isMobile) && (
                            <span className="text-2xl text-primary font-heading">
                                PurrfectMatch
                            </span>
                        )}
                    </div>

                    {/* Close Button for Mobile Sidebar */}
                    {isMobile && (
                        <button
                            onClick={closeSidebar}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Close sidebar"
                        >
                            <X className="h-5 w-5 text-gray-600" />
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation Items */}
            <nav className="p-2 mt-4">
                <ul className="space-y-1">
                    {navItems.map(item => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                onClick={isMobile ? closeSidebar : undefined}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-3 rounded-lg
                                    transition-colors duration-200
                                    ${
                                        isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }
                                    ${
                                        isCollapsed && !isMobile
                                            ? "justify-center"
                                            : ""
                                    }
                                `}
                                title={
                                    isCollapsed && !isMobile ? item.label : ""
                                }
                            >
                                <span className="flex-shrink-0">
                                    {item.icon}
                                </span>
                                {(!isCollapsed || isMobile) && (
                                    <span className="truncate">
                                        {item.label}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer/User Section - Hide on mobile if collapsed, show if open */}
            {(!isCollapsed || (isMobile && isOpen)) && (
                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <PawPrint className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                PurrfectMatch Admin
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                v1.0.0
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default PrivateSidebar;
