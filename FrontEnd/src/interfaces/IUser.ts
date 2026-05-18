import type { IAppointment } from "./IAppointment";
import type { INotification } from "./INotifications";
import type { IBill } from "./IPayment";
import type { IMedicalRecord } from "./IAppointment";

export interface IUser {
    user_id: number;
    role: string;
    first_name: string;
    last_name: string;
    email: string;
    password_hash?: string;
    phone: string;
    gender: string;
    date_of_birth: string;
    address: string;
    created_at?: string;
    updated_at?: string;
    notifications?: INotification[];
}
interface IMedical{    
    appointments?: IAppointment[];
    medical_records?: IMedicalRecord[];
}
export interface IDoctor extends IUser, IMedical {
    doctor_id: number;
    department_id: number;
    specialization: string;
    license_number: string;
    years_of_experience: number;
    availability_status: string;
}
export interface IPatient extends IUser, IMedical {
    patient_id: number;
    blood_type?: string;
    emergency_contact?: string;
    insurance_number?: string;
    allergies?: string[];
    medical_history?: string[];
    bills?: IBill[];
}