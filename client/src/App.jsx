import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateLayout from "@/components/layout/PrivateLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthCallback from "@/pages/AuthCallback";

// Protected Route Pages
import Dashboard from "@/pages/Dashboard";
// import AllPets from "@/pages/AllPets";
// import MyPets from "@/pages/MyPets";
// import SellPet from "@/pages/SellPet";
// import Messages from "@/pages/Messages";
// import Appointments from "@/pages/Appointments";
// import Transactions from "@/pages/Transactions";
// import Analytics from "@/pages/Analytics";
// import Profile from "@/pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Protected Routes wrapped in PrivateLayout */}
                <Route element={<PrivateLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* Dashboard as home for logged-in users */}
                    {/* <Route path="/pets" element={<AllPets />} />
                    <Route path="/my-pets" element={<MyPets />} />
                    <Route path="/sell-pet" element={<SellPet />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/profile" element={<Profile />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
