import type { IPatient, IDoctor, IUser } from "../interfaces/IUser";
// import { api } from "../lib/api";
import { mockPatients, mockDoctors, mockUsers } from "../lib/mockData";

export class PatientsService {
    static async getAllPatients(): Promise<IPatient[]> {
        return mockPatients;
        // return await api.get("/patients");
    }
    static async getPatientById(id: number): Promise<IPatient> {
        return mockPatients.find((p) => p.patient_id === id)!;
        // return await api.get(`/patients/${id}`);
    }
}

export class DoctorsService {
    static async getAllDoctors(): Promise<IDoctor[]> {
        return mockDoctors;
        // return await api.get("/doctors");
    }
    static async getDoctorById(id: number): Promise<IDoctor> {
        return mockDoctors.find((d) => d.doctor_id === id)!;
        // return await api.get(`/doctors/${id}`);
    }
}

export class UsersService {
    static async getAllUsers(): Promise<IUser[]> {
        return mockUsers;
        // return await api.get("/users");
    }
    static async getUserById(id: number): Promise<IUser> {
        return mockUsers.find((u) => u.user_id === id)!;
        // return await api.get(`/users/${id}`);
    }
    static async updateUser(id: number, user: Partial<IUser>): Promise<IUser> {
        const index = mockUsers.findIndex((u) => u.user_id === id);
        if (index !== -1) {
            mockUsers[index] = { ...mockUsers[index], ...user } as IUser;
        }
        return mockUsers[index];
        // return await api.put(`/users/${id}`, user);
    }
    static async deleteUser(id: number): Promise<void> {
        const index = mockUsers.findIndex((u) => u.user_id === id);
        if (index !== -1) mockUsers.splice(index, 1);
        // return await api.delete(`/users/${id}`);
    }
}
