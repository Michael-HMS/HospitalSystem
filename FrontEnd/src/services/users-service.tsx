import type { IPatient, IDoctor, IUser } from "../interfaces/IUser";
import { api } from "../lib/api";

// ── Backend response shapes (camelCase from Spring) ──────────────────────────

interface BackendUserDto {
    userId: number;
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
}

interface BackendDoctorDto {
    doctorId: number;
    user: BackendUserDto;
    specialization: string;
    departmentName: string;
    yearsOfExperience: number;
    availabilityStatus: string;
}

interface BackendPatientDto {
    patientId: number;
    user: BackendUserDto;
}

interface BackendUserResponse {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phone: string;
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapDoctor(d: BackendDoctorDto): IDoctor {
    return {
        doctor_id: d.doctorId,
        user_id: d.user?.userId ?? 0,
        role: "doctor",
        first_name: d.user?.firstName ?? "",
        last_name: d.user?.lastName ?? "",
        email: d.user?.email ?? "",
        phone: d.user?.phone ?? "",
        gender: d.user?.gender ?? "",
        date_of_birth: "",
        address: "",
        department_id: 0,
        specialization: d.specialization ?? "",
        license_number: "",
        years_of_experience: d.yearsOfExperience ?? 0,
        availability_status: (d.availabilityStatus ?? "").toLowerCase(),
    };
}

function mapPatient(p: BackendPatientDto): IPatient {
    return {
        patient_id: p.patientId,
        user_id: p.user?.userId ?? 0,
        role: "patient",
        first_name: p.user?.firstName ?? "",
        last_name: p.user?.lastName ?? "",
        email: p.user?.email ?? "",
        phone: p.user?.phone ?? "",
        gender: p.user?.gender ?? "",
        date_of_birth: "",
        address: "",
    };
}

function mapUserResponse(u: BackendUserResponse): IUser {
    return {
        user_id: u.userId,
        role: (u.role ?? "").toLowerCase(),
        first_name: u.firstName ?? "",
        last_name: u.lastName ?? "",
        email: u.email ?? "",
        phone: u.phone ?? "",
        gender: "",
        date_of_birth: "",
        address: "",
    };
}

// ── Services ──────────────────────────────────────────────────────────────────

export class PatientsService {
    static async getAllPatients(): Promise<IPatient[]> {
        const data: BackendPatientDto[] = await api.get("/patients");
        return (data || []).map(mapPatient);
    }

    static async getPatientById(id: number): Promise<IPatient> {
        const data: BackendPatientDto = await api.get(`/patients/${id}`);
        return mapPatient(data);
    }
}

export class DoctorsService {
    static async getAllDoctors(): Promise<IDoctor[]> {
        const data: BackendDoctorDto[] = await api.get("/doctors");
        return (data || []).map(mapDoctor);
    }

    static async getDoctorById(id: number): Promise<IDoctor> {
        // No single-doctor endpoint yet — fetch all and find
        const all = await DoctorsService.getAllDoctors();
        const found = all.find((d) => d.doctor_id === id);
        if (!found) throw new Error(`Doctor ${id} not found`);
        return found;
    }

    static async searchDoctors(keyword: string): Promise<IDoctor[]> {
        const data: BackendDoctorDto[] = await api.get(`/doctors/search?keyword=${encodeURIComponent(keyword)}`);
        return (data || []).map(mapDoctor);
    }
}

export class UsersService {
    static async getAllUsers(): Promise<IUser[]> {
        const data: BackendUserResponse[] = await api.get("/admin/users");
        return (data || []).map(mapUserResponse);
    }

    static async getUserById(id: number): Promise<IUser> {
        const all = await UsersService.getAllUsers();
        const found = all.find((u) => u.user_id === id);
        if (!found) throw new Error(`User ${id} not found`);
        return found;
    }

    static async updateUser(id: number, user: Partial<IUser>): Promise<IUser> {
        const payload: Record<string, unknown> = {};
        if (user.first_name !== undefined) payload.firstName = user.first_name;
        if (user.last_name !== undefined) payload.lastName = user.last_name;
        if (user.email !== undefined) payload.email = user.email;
        if (user.role !== undefined) payload.role = user.role;
        if (user.phone !== undefined) payload.phone = user.phone;

        const data: BackendUserResponse = await api.put(`/admin/users/${id}`, payload);
        return mapUserResponse(data);
    }

    static async deleteUser(id: number): Promise<void> {
        await api.delete(`/admin/users/${id}`);
    }

    static async getDashboardStats(): Promise<{ totalPatients: number; totalDoctors: number; totalAppointments: number }> {
        return await api.get('/admin/users/dashboard-stats');
    }
}
