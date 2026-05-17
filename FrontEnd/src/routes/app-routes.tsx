import Home from "../components/features/home/home";
import NotFound from "../components/features/notFound/404";
import { Route, Routes } from "react-router-dom";
import DepartmentsPage from "../components/features/hospital/departments/departmentList";
import DoctorsPage from "../components/features/hospital/doctors/doctorsList";
import BookAppointmentPage from "../components/features/appointments/appointment/appointments";
import AppointmentsPage from "../components/features/appointments/appointment/appointments";
import LandingPage from "../components/features/home/landingPage"
import AuthPage from "../components/features/auth/authpage"

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/book-appointment" element={<BookAppointmentPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
        </Routes>
    );
}
