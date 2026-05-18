import type { IDepartment } from "../interfaces/IDepartment";
import type { IDoctor } from "../interfaces/IUser";
import { api } from "../lib/api";

export class DepartmentsService {
    static async getAllDepartments(): Promise<IDepartment[]> {
        return await api.get("/departments");
    }

    static async getDepartmentById(id: number): Promise<IDepartment> {
        return await api.get(`/departments/${id}`);
    }
    
    static async getDoctorsByDepartment(department_id: number): Promise<IDoctor[]> {
        return await api.get(`/departments/${department_id}/doctors`);
    }
}