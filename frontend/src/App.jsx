import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./helpComp/Navbar";
import Footer from "./components/footer";


const App = () => {
    return (
        <div className="min-h-screen flex flex-col gap-4 justify-start items-center">
            <Navbar />
            <div className="min-h-[75vh] w-full md:w-[896px] px-2">
                <Routes>
                    <Route element={<Home />} path="/" />
                    <Route element={<Dashboard />} path="/dashboard" />
                    <Route element={<Home />} path="*" />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
