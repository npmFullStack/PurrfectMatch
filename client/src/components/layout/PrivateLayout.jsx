// components/layout/PrivateLayout.jsx
import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PrivateHeader from "@/components/layout/PrivateHeader";
import PrivateSidebar from "@/components/layout/PrivateSidebar";
import MessageBubble from "@/components/common/MessageBubble";
import ProfileSetupModal from "@/components/modals/ProfileSetupModal";

const PrivateLayout = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showProfileSetup, setShowProfileSetup] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            setIsLoading(false);
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            
            // Check if profile setup is needed
            if (!parsedUser.profile_setup_completed || !parsedUser.username) {
                // Small delay to let the UI render first
                setTimeout(() => {
                    setShowProfileSetup(true);
                }, 500);
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
        } finally {
            setIsLoading(false);
        }

        // Check if mobile on initial load
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const checkMobile = () => {
        const mobile = window.innerWidth < 768; // md breakpoint
        setIsMobile(mobile);
        
        // If switching from mobile to desktop, ensure sidebar state is correct
        if (!mobile && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    const handleProfileSetupComplete = (updatedUser) => {
        // Update local state
        setUser(updatedUser);
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Close modal
        setShowProfileSetup(false);
    };

    const handleProfileSetupSkip = () => {
        // Mark as skipped in localStorage (temporarily)
        const updatedUser = {
            ...user,
            profile_setup_skipped: true
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setShowProfileSetup(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const toggleSidebar = () => {
        if (isMobile) {
            // On mobile, toggle the sidebar overlay
            setIsSidebarOpen(!isSidebarOpen);
        } else {
            // On desktop, toggle collapsed state
            setIsSidebarCollapsed(!isSidebarCollapsed);
        }
    };

    const closeSidebar = () => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    // Calculate main content margin based on sidebar state
    const getMainContentMargin = () => {
        if (isMobile) {
            return ''; // No margin on mobile
        } else if (isSidebarCollapsed) {
            return 'md:ml-16'; // Collapsed sidebar
        } else {
            return 'md:ml-64'; // Expanded sidebar
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Profile Setup Modal */}
            <ProfileSetupModal
                isOpen={showProfileSetup}
                onClose={handleProfileSetupSkip}
                onComplete={handleProfileSetupComplete}
                user={user}
            />

            <PrivateSidebar
                isCollapsed={isSidebarCollapsed}
                isOpen={isSidebarOpen}
                isMobile={isMobile}
                toggleSidebar={toggleSidebar}
                closeSidebar={closeSidebar}
            />

            {/* Backdrop overlay ONLY for mobile sidebar */}
            {isMobile && isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
                    onClick={closeSidebar}
                />
            )}

            {/* Main content area */}
            <div className="flex-1 flex flex-col w-full transition-all duration-300">
                {/* Fixed Header - positioned based on sidebar state */}
                <div className={`
                    fixed top-0 z-40 transition-all duration-300
                    ${isMobile ? 'left-0 right-0' : 
                      isSidebarCollapsed ? 'md:left-16' : 'md:left-64'}
                    ${isMobile ? '' : 'md:right-0'}
                `}>
                    <PrivateHeader 
                        user={user} 
                        toggleSidebar={toggleSidebar}
                        isMobile={isMobile}
                        isSidebarCollapsed={isSidebarCollapsed}
                        isSidebarOpen={isSidebarOpen}
                    />
                </div>

                {/* Main Content with responsive margin */}
                <main className={`
                    flex-1 mt-16 p-4 md:p-6 overflow-auto transition-all duration-300
                    ${getMainContentMargin()}
                    ${isMobile && isSidebarOpen ? 'opacity-50 pointer-events-none' : 'opacity-100'}
                `}>
                    <div className="max-w-7xl mx-auto">
                        <Outlet context={{ user }} />
                    </div>
                </main>
            </div>
            <MessageBubble />
        </div>
    );
};

export default PrivateLayout;