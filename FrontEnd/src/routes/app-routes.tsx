import Home from "../components/features/home/home";
import NotFound from "../components/features/notFound/404";
import Forbidden from "../components/features/notFound/403";
import { Route, Routes } from "react-router-dom";
import DepartmentsPage from "../components/features/hospital/departments/departmentList";
import DoctorsPage from "../components/features/hospital/doctors/doctorsList";
import BookAppointmentPage from "../components/features/patient/appointment/appointmentBook";
import AppointmentsPage from "../components/features/appointments/appointment/patientAppointments";
import LandingPage from "../components/features/home/landingPage"
import AuthPage from "../components/features/auth/authpage"
import AdminDashboard from "../components/features/admin/adminDashboard";
import AdminMedicationsPage from "../components/features/admin/adminMedicationPage";
import AdminUsersPage from "../components/features/admin/adminUsersPage";
import PatientsList from "../components/features/doctor/patients/patientsList";
import PrescriptionWritingPage from "../components/features/doctor/prescription/prescriptionWriting";
import DoctorAppointmentsPage from "../components/features/appointments/appointment/doctorAppointments";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import ProfilePage from "../components/profile/profilepage";
import BillingPage from "../components/features/patient/bills/billList";
import MedicalHistoryPage from "../components/features/patient/medicalRecords/medicalRecordList";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/403" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />

            {/* Authenticated Routes (Any logged-in user) */}
            <Route element={<ProtectedRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Patient Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
                <Route path="/book-appointment" element={<BookAppointmentPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/bills" element={<BillingPage />} />
                <Route path="/medical-records" element={<MedicalHistoryPage />} />
            </Route>

            {/* Doctor Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
                <Route path="/doctor-appointments" element={<DoctorAppointmentsPage />} />
                <Route path="/patients" element={<PatientsList />} />
                <Route path="/prescription/:appointmentId" element={<PrescriptionWritingPage />} />
            </Route>

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminDashboard />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="medications" element={<AdminMedicationsPage />} />
                    <Route path="users" element={<AdminUsersPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
