import type { IDepartment } from "../interfaces/IDepartment";
import type { IDoctor } from "../interfaces/IUser";
import { api } from "../lib/api";

// ── Backend response shape ────────────────────────────────────────────────────

interface BackendDoctorInDept {
    doctorId: number;
    firstName: string;
    lastName: string;
    specialization: string;
}

interface BackendDepartment {
    departmentId: number;
    departmentName: string;
    description: string;
    doctors: BackendDoctorInDept[];
}

// ── Mapper ────────────────────────────────────────────────────────────────────

function mapDepartment(d: BackendDepartment): IDepartment {
    const doctors: IDoctor[] = (d.doctors || []).map((doc) => ({
        doctor_id: doc.doctorId,
        user_id: 0,
        role: "doctor",
        first_name: doc.firstName ?? "",
        last_name: doc.lastName ?? "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        address: "",
        department_id: d.departmentId,
        specialization: doc.specialization ?? "",
        license_number: "",
        years_of_experience: 0,
        availability_status: "available",
    }));

    return {
        department_id: d.departmentId,
        department_name: d.departmentName ?? "",
        description: d.description ?? "",
        doctors,
    };
}

// ── Service ───────────────────────────────────────────────────────────────────

export class DepartmentsService {
    static async getAllDepartments(): Promise<IDepartment[]> {
        const data: BackendDepartment[] = await api.get("/departments");
        return (data || []).map(mapDepartment);
    }

    static async getDepartmentById(id: number): Promise<IDepartment> {
        const data: BackendDepartment = await api.get(`/departments/${id}`);
        return mapDepartment(data);
    }

    static async getDoctorsByDepartment(department_id: number): Promise<IDoctor[]> {
        const dept = await DepartmentsService.getDepartmentById(department_id);
        return dept.doctors ?? [];
    }
}
