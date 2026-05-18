import type { IPatient, IDoctor, IUser } from "../interfaces/IUser";
import { api } from "../lib/api";

export class PatientsService {
    static async getAllPatients(): Promise<IPatient[]> {
        return await api.get("/patients");
    }
    static async getPatientById(id: number): Promise<IPatient> {
        return await api.get(`/patients/${id}`);
    }
}

export class DoctorsService {
    static async getAllDoctors(): Promise<IDoctor[]> {
        return await api.get("/doctors");
    }
    static async getDoctorById(id: number): Promise<IDoctor> {
        return await api.get(`/doctors/${id}`);
    }
}

export class UsersService {
    static async getAllUsers(): Promise<IUser[]> {
        return await api.get("/users");
    }
    static async getUserById(id: number): Promise<IUser> {
        return await api.get(`/users/${id}`);
    }
    static async updateUser(id: number, user: Partial<IUser>): Promise<IUser> {
        return await api.put(`/users/${id}`, user);
    }
    static async deleteUser(id: number): Promise<void> {
        return await api.delete(`/users/${id}`);
    }
}
