import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./helpComp/Navbar";
import Footer from "./components/footer";
import { AuthProvider } from "./common/AuthContext";
import AuthForm from "./pages/AuthForm";
import ProtectedRoute from "./lib/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";


const App = () => {
    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col gap-4 justify-start items-center">
                <Navbar />
                <div className="min-h-[75vh] w-full md:w-[896px] px-2">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<AuthForm type="login" />} />
                        <Route path="/signup" element={<AuthForm type="signup" />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    </Routes>
                    <Toaster />
                </div>
                <Footer />
            </div>
        </AuthProvider>
    );
}

export default App;
