export interface IAppointment {
    appointment_id: number;
    patient_id: number;
    doctor_id: number;
    appointment_date: string;
    appointment_time: string;
    status: string;
    reason: string;
    created_at: string;
    medical_record: IMedicalRecord;
}
export interface IMedicalRecord {
    record_id: number;
    patient_id: number;
    doctor_id: number;
    appointment_id: number;
    diagnosis: string;
    treatment: string;
    notes: string;
    created_at: string;
    prescription?: IPrescription[];
}
export interface IPrescription{
    prescription_id: number;
    record_id: number;
    doctor_id: number;
    patient_id: number;
    issue_date: string;
    notes: string;
    medications: IMedication[];
}
export interface IMedication{
    medication_id: number;
    medication_name: string;
    description: string;
    stock_quantity: number;
    expiry_date: string;
    price: number;
}
