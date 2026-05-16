import type { IDepartment } from "../interfaces/IDepartment";
import type { IDoctor } from "../interfaces/IUser";
import { DoctorsService } from "./users-service";

const doctorsArray: IDoctor[] = await DoctorsService.getAllDoctors();

const departmentsArray: IDepartment[] = [
    {
        department_id: 1,
        department_name: "Cardiology",
        description: "Cardiology is the branch of medicine that deals with the heart and its diseases.",
        doctors: doctorsArray
    }
];
export class DepartmentsService {
    static async getAllDepartments(): Promise<IDepartment[]> {
        return departmentsArray;
    }
    static async getDepartmentById(id: number): Promise<IDepartment> {
        return departmentsArray.find((department) => department.department_id === id)!;
    }
    static async getDoctorsByDepartment(department_id: number): Promise<IDoctor[]> {
        const department = await this.getDepartmentById(department_id);
        return department.doctors;
    }
    //     static async getAllDepartments(): Promise<IDepartment[]> {
    //         const response = await api.get("/departments");
    //         return response.data;
    //     }

    //     static async getDepartmentById(id: number): Promise<IDepartment> {
    //         const response = await api.get(`/departments/${id}`);
    //         return response.data;
    //     }
    
    //     static async getDoctorsByDepartment(department_id: number): Promise<IDoctor[]> {
    //         const response = await api.get(`/departments/${department_id}/doctors`);
    //         return response.data;
    //     }
}