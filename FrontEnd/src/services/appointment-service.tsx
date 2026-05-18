import type { IAppointment } from "../interfaces/IAppointment";
import {MedicalRecordsService} from "./medical-service";

const appointmentsArray: IAppointment[] = [
    {
        appointment_id: 1,
        patient_id: 1,
        doctor_id: 1,
        appointment_date: "2022-01-01",
        appointment_time: "10:00",
        status: "scheduled",
        reason: "General Checkup",
        created_at: "2022-01-01",
        medical_record: MedicalRecordsService.getAllMedicalRecords()[0]
    }
];


export class AppointmentsService {
    static async getAllAppointments(): Promise<IAppointment[]> {
        return appointmentsArray;
    }
    static async getAppointmentById(id: number): Promise<IAppointment> {
        return appointmentsArray.find((appointment) => appointment.appointment_id === id)!;
    }
    static async getAppointmentsByPatient(patient_id: number): Promise<IAppointment[]> {
        return appointmentsArray.filter((appointment) => appointment.patient_id === patient_id);
    }
    static async getAppointmentsByDoctor(doctor_id: number): Promise<IAppointment[]> {
        return appointmentsArray.filter((appointment) => appointment.doctor_id === doctor_id);
    }
    static async createAppointment(appointment: IAppointment): Promise<IAppointment> {
        appointmentsArray.push(appointment);
        return appointment;
    }
    static async updateAppointment(appointment: IAppointment): Promise<IAppointment> {
        const index = appointmentsArray.findIndex((appointment) => appointment.appointment_id === appointment.appointment_id);
        appointmentsArray[index] = appointment;
        return appointment;
    }
    static async deleteAppointment(appointment_id: number): Promise<void> {
        const index = appointmentsArray.findIndex((appointment) => appointment.appointment_id === appointment_id);
        appointmentsArray.splice(index, 1);
    }
    //     static async getAllAppointments(): Promise<IAppointment[]> {
    //         const response = await api.get("/appointments");
    //         return response.data;
    //     }

    //     static async getAppointmentById(id: number): Promise<IAppointment> {
    //         const response = await api.get(`/appointments/${id}`);
    //         return response.data;
    //     }
    
    //     static async getAppointmentsByPatient(patient_id: number): Promise<IAppointment[]> {
    //         const response = await api.get(`/appointments/patient/${patient_id}`);
    //         return response.data;
    //     }
    
    //     static async getAppointmentsByDoctor(doctor_id: number): Promise<IAppointment[]> {
    //         const response = await api.get(`/appointments/doctor/${doctor_id}`);
    //         return response.data;
    //     }
    
    //     static async createAppointment(appointment: IAppointment): Promise<IAppointment> {
    //         const response = await api.post("/appointments", appointment);
    //         return response.data;
    //     }
    
    //     static async updateAppointment(appointment: IAppointment): Promise<IAppointment> {
    //         const response = await api.put(`/appointments/${appointment.appointment_id}`, appointment);
    //         return response.data;
    //     }
    
    //     static async deleteAppointment(appointment_id: number): Promise<void> {
    //         const response = await api.delete(`/appointments/${appointment_id}`);
    //         return response.data;
    //     }
}


