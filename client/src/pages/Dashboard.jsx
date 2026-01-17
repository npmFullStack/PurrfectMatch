import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
    PawPrint, 
    Heart, 
    Users, 
    BarChart3, 
    TrendingUp, 
    Calendar,
    Bell,
    MessageSquare,
    Shield,
    Activity
} from "lucide-react";
import Button from "@/components/common/Button";

const Dashboard = () => {
    const { user } = useOutletContext();

    // Stats data
    const stats = [
        {
            title: "Total Pets",
            value: "1,247",
            change: "+12%",
            icon: <PawPrint className="h-5 w-5" />,
            color: "bg-blue-100 text-blue-600",
            trend: "up"
        },
        {
            title: "Adoptions",
            value: "892",
            change: "+8%",
            icon: <Heart className="h-5 w-5" />,
            color: "bg-pink-100 text-pink-600",
            trend: "up"
        },
        {
            title: "Active Users",
            value: "5,421",
            change: "+23%",
            icon: <Users className="h-5 w-5" />,
            color: "bg-green-100 text-green-600",
            trend: "up"
        },
        {
            title: "Success Rate",
            value: "98.2%",
            change: "+0.5%",
            icon: <TrendingUp className="h-5 w-5" />,
            color: "bg-purple-100 text-purple-600",
            trend: "up"
        }
    ];

    // Quick actions
    const quickActions = [
        {
            title: "Add New Pet",
            description: "Register a new pet for adoption",
            icon: <PawPrint className="h-5 w-5" />,
            color: "bg-blue-500",
            to: "/dashboard/pets/new"
        },
        {
            title: "View Calendar",
            description: "Check adoption appointments",
            icon: <Calendar className="h-5 w-5" />,
            color: "bg-green-500",
            to: "/dashboard/calendar"
        },
        {
            title: "Messages",
            description: "12 unread messages",
            icon: <MessageSquare className="h-5 w-5" />,
            color: "bg-yellow-500",
            to: "/dashboard/messages"
        },
        {
            title: "Analytics",
            description: "View detailed reports",
            icon: <BarChart3 className="h-5 w-5" />,
            color: "bg-purple-500",
            to: "/dashboard/analytics"
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary to-pink-600 rounded-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Welcome back, {user.first_name || user.email.split('@')[0]}!
                        </h1>
                        <p className="opacity-90">
                            Here's what's happening with your pet adoption platform today.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button
                            variant="ghost"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                            <Activity className="h-4 w-4 mr-2" />
                            View Analytics
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {stat.value}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {stat.title}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Button
                            key={index}
                            to={action.to}
                            variant="ghost"
                            className="h-auto p-4 border border-gray-200 hover:border-primary/30 hover:bg-primary/5 flex flex-col items-start text-left"
                        >
                            <div className={`p-2 rounded-lg ${action.color} mb-3`}>
                                {action.icon}
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">
                                {action.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {action.description}
                            </p>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Adoptions</h2>
                        <Button variant="ghost" size="sm">
                            View All
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "Max", type: "Golden Retriever", time: "2 hours ago" },
                            { name: "Luna", type: "Siamese Cat", time: "4 hours ago" },
                            { name: "Rocky", type: "German Shepherd", time: "1 day ago" },
                            { name: "Bella", type: "Persian Cat", time: "2 days ago" },
                        ].map((pet, index) => (
                            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <PawPrint className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{pet.name}</p>
                                        <p className="text-sm text-gray-500">{pet.type}</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">{pet.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">System Status</h2>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600 font-medium">All Systems Operational</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { name: "API Server", status: "Operational", uptime: "99.9%" },
                            { name: "Database", status: "Operational", uptime: "99.8%" },
                            { name: "File Storage", status: "Operational", uptime: "99.7%" },
                            { name: "Email Service", status: "Operational", uptime: "99.5%" },
                        ].map((service, index) => (
                            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`h-2 w-2 rounded-full ${
                                        service.status === 'Operational' ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                    <div>
                                        <p className="font-medium text-gray-900">{service.name}</p>
                                        <p className="text-sm text-gray-500">{service.status}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">{service.uptime}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;