import type { IAppointment } from "../interfaces/IAppointment";
import { api } from "../lib/api";

export class AppointmentsService {
    static async getAllAppointments(): Promise<IAppointment[]> {
        return await api.get("/appointments");
    }

    static async getAppointmentById(id: number): Promise<IAppointment> {
        return await api.get(`/appointments/${id}`);
    }

    static async getAppointmentsByPatient(patient_id: number): Promise<IAppointment[]> {
        return await api.get(`/appointments/patient/${patient_id}`);
    }

    static async getAppointmentsByDoctor(doctor_id: number): Promise<IAppointment[]> {
        return await api.get(`/appointments/doctor/${doctor_id}`);
    }

    static async createAppointment(appointment: Partial<IAppointment>): Promise<IAppointment> {
        return await api.post("/appointments", appointment);
    }

    static async updateAppointment(appointment: Partial<IAppointment>): Promise<IAppointment> {
        return await api.put(`/appointments/${appointment.appointment_id}`, appointment);
    }

    static async deleteAppointment(appointment_id: number): Promise<void> {
        return await api.delete(`/appointments/${appointment_id}`);
    }
}
