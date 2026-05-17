import type { IPatient, IDoctor } from "../interfaces/IUser";


 const doctorsArray: IDoctor[] = [
    {
        doctor_id: 1,
        user_id: 1,
        role: "doctor",
        first_name: "John",
        last_name: "Doe",
        email: "[EMAIL_ADDRESS]",
        phone: "1234567890",
        gender: "male",
        date_of_birth: "1990-01-01",
        address: "123 Main St",
        department_id: 1,
        specialization: "Cardiology",
        license_number: "123456",
        years_of_experience: 10,
        availability_status: "available",
    }
];
const patientsArray: IPatient[] = [
    {
        patient_id: 1,
        user_id: 1,
        role: "patient",
        first_name: "John",
        last_name: "Doe",
        email: "[EMAIL_ADDRESS]",
        phone: "1234567890",
        gender: "male",
        date_of_birth: "1990-01-01",
        address: "123 Main St",
        blood_type: "A+",
        emergency_contact: "1234567890",
        insurance_number: "123456",
        allergies: ["none"],
        medical_history: ["none"],
    }
];

export class PatientsService {
    static async getAllPatients(): Promise<IPatient[]> {
        return patientsArray;
    }
    static async getPatientById(id: number): Promise<IPatient> {
        return patientsArray.find((patient) => patient.patient_id === id)!;
    }
//     static async getAllPatients(): Promise<IPatient[]> {
//         const response = await api.get("/patients");
//         return response.data;
//     }

//     static async getPatientById(id: number): Promise<IPatient> {
//         const response = await api.get(`/patients/${id}`);
//         return response.data;
//     }
}
export class DoctorsService {
    static async getAllDoctors(): Promise<IDoctor[]> {
        return doctorsArray;
    }
    static async getDoctorById(id: number): Promise<IDoctor> {
        return doctorsArray.find((doctor) => doctor.doctor_id === id)!;
    }
//     static async getAllDoctors(): Promise<IDoctor[]> {
//         const response = await api.get("/doctors");
//         return response.data;
//     }
//     static async getDoctorById(id: number): Promise<IDoctor> {
//         const response = await api.get(`/doctors/${id}`);
//         return response.data;
//     }
}


