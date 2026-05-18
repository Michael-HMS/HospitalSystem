import type { IAppointment } from "../interfaces/IAppointment";
import { api } from "../lib/api";
import { AuthService } from "./auth-service";

// ── Backend response shape ────────────────────────────────────────────────────

interface BackendAppointment {
    appointmentId: number;
    patientId: number;
    patientName?: string;
    doctorId?: number;
    appointmentDate: string; // "2024-01-15"
    appointmentTime: string; // "10:00:00"
    status: string;
    reason: string;
}

// ── Mapper ────────────────────────────────────────────────────────────────────

function mapAppointment(a: BackendAppointment): IAppointment {
    return {
        appointment_id: a.appointmentId,
        patient_id: a.patientId,
        doctor_id: a.doctorId ?? 0,
        appointment_date: a.appointmentDate ?? "",
        appointment_time: a.appointmentTime ?? "",
        status: a.status ?? "",
        reason: a.reason ?? "",
        created_at: "",
        medical_record: null as any, // loaded separately when needed
    };
}

// ── Service ───────────────────────────────────────────────────────────────────

export class AppointmentsService {
    /**
     * Fetches appointments for the currently logged-in user.
     * - If role is "doctor"  → GET /api/doctors/{id}/appointments
     * - If role is "patient" → GET /api/patients/{id}/appointments (not yet on backend,
     *   falls back to doctor endpoint pattern)
     * - Admins get all via /api/admin/users (no appointment endpoint, returns empty)
     */
    static async getAllAppointments(): Promise<IAppointment[]> {
        const role = AuthService.getRole();
        const id = AuthService.getId();

        if (!id) return [];

        if (role === "doctor") {
            const data: BackendAppointment[] = await api.get(`/doctors/${id}/appointments`);
            return (data || []).map(mapAppointment);
        }

        if (role === "patient") {
            return AppointmentsService.getAppointmentsByPatient(Number(id));
        }

        return [];
    }

    static async getAppointmentsByDoctor(doctorId: number): Promise<IAppointment[]> {
        const data: BackendAppointment[] = await api.get(`/doctors/${doctorId}/appointments`);
        return (data || []).map(mapAppointment);
    }

    static async getAppointmentsByPatient(patientId: number): Promise<IAppointment[]> {
        const data: BackendAppointment[] = await api.get(`/patients/${patientId}/appointments`);
        return (data || []).map(mapAppointment);
    }

    static async getAppointmentById(id: number): Promise<IAppointment> {
        // No single-appointment GET endpoint — fetch from doctor list
        const all = await AppointmentsService.getAllAppointments();
        const found = all.find((a) => a.appointment_id === id);
        if (!found) throw new Error(`Appointment ${id} not found`);
        return found;
    }

    static async createAppointment(appointment: Partial<IAppointment>): Promise<IAppointment> {
        const patientId = appointment.patient_id ?? Number(AuthService.getId());
        const payload = {
            doctorId: appointment.doctor_id,
            appointmentDate: appointment.appointment_date,
            appointmentTime: appointment.appointment_time,
            reason: appointment.reason,
        };
        const data: BackendAppointment = await api.post(`/patients/${patientId}/appointments`, payload);
        return mapAppointment(data);
    }

    static async updateAppointmentStatus(
        doctorId: number,
        appointmentId: number,
        status: string
    ): Promise<void> {
        await api.patch(`/doctors/${doctorId}/appointments/${appointmentId}/status?target=${status}`);
    }

    // Legacy stubs kept so existing components don't break
    static async updateAppointment(appointment: Partial<IAppointment>): Promise<IAppointment> {
        const doctorId = Number(AuthService.getId());
        await AppointmentsService.updateAppointmentStatus(
            doctorId,
            appointment.appointment_id!,
            appointment.status ?? "Confirmed"
        );
        return appointment as IAppointment;
    }

    static async deleteAppointment(_appointmentId: number): Promise<void> {
        // No delete endpoint on the backend
    }
}
