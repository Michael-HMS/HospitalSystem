import type { IAppointment } from "../interfaces/IAppointment";
// import { api } from "../lib/api";
import { mockAppointments } from "../lib/mockData";

export class AppointmentsService {
    static async getAllAppointments(): Promise<IAppointment[]> {
        return mockAppointments;
        // return await api.get("/appointments");
    }

    static async getAppointmentById(id: number): Promise<IAppointment> {
        return mockAppointments.find(a => a.appointment_id === id)!;
        // return await api.get(`/appointments/${id}`);
    }

    static async getAppointmentsByPatient(patient_id: number): Promise<IAppointment[]> {
        return mockAppointments.filter(a => a.patient_id === patient_id);
        // return await api.get(`/appointments/patient/${patient_id}`);
    }

    static async getAppointmentsByDoctor(doctor_id: number): Promise<IAppointment[]> {
        return mockAppointments.filter(a => a.doctor_id === doctor_id);
        // return await api.get(`/appointments/doctor/${doctor_id}`);
    }

    static async createAppointment(appointment: Partial<IAppointment>): Promise<IAppointment> {
        const newApp = { ...appointment, appointment_id: Date.now() } as IAppointment;
        mockAppointments.push(newApp);
        return newApp;
        // return await api.post("/appointments", appointment);
    }

    static async updateAppointment(appointment: Partial<IAppointment>): Promise<IAppointment> {
        const index = mockAppointments.findIndex(a => a.appointment_id === appointment.appointment_id);
        if (index !== -1) mockAppointments[index] = { ...mockAppointments[index], ...appointment } as IAppointment;
        return mockAppointments[index];
        // return await api.put(`/appointments/${appointment.appointment_id}`, appointment);
    }

    static async deleteAppointment(appointment_id: number): Promise<void> {
        const index = mockAppointments.findIndex(a => a.appointment_id === appointment_id);
        if (index !== -1) mockAppointments.splice(index, 1);
        // return await api.delete(`/appointments/${appointment_id}`);
    }
}
