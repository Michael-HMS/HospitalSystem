import type { IDepartment } from "../interfaces/IDepartment";
import type { IDoctor } from "../interfaces/IUser";
// import { api } from "../lib/api";
import { mockDepartments } from "../lib/mockData";

export class DepartmentsService {
    static async getAllDepartments(): Promise<IDepartment[]> {
        return mockDepartments;
        // return await api.get("/departments");
    }

    static async getDepartmentById(id: number): Promise<IDepartment> {
        return mockDepartments.find((d) => d.department_id === id)!;
        // return await api.get(`/departments/${id}`);
    }
    
    static async getDoctorsByDepartment(department_id: number): Promise<IDoctor[]> {
        const department = mockDepartments.find((d) => d.department_id === department_id);
        return department ? department.doctors : [];
        // return await api.get(`/departments/${department_id}/doctors`);
    }
}