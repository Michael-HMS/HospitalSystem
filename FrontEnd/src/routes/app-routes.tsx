import Home from "../components/features/home/home";
import NotFound from "../components/features/404";
import { Route, Routes } from "react-router-dom";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}