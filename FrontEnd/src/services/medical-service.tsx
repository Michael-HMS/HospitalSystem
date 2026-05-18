import type { IMedicalRecord, IMedication, IPrescription } from "../interfaces/IAppointment";
import { api } from "../lib/api";

export class MedicalRecordsService {
    static async getAllMedicalRecords(): Promise<IMedicalRecord[]> {
        return await api.get("/medical-records");
    }

    static async getMedicalRecordById(id: number): Promise<IMedicalRecord> {
        return await api.get(`/medical-records/${id}`);
    }

    static async getMedicalRecordsByPatient(patient_id: number): Promise<IMedicalRecord[]> {
        return await api.get(`/medical-records/patient/${patient_id}`);
    }

    static async getMedicalRecordsByDoctor(doctor_id: number): Promise<IMedicalRecord[]> {
        return await api.get(`/medical-records/doctor/${doctor_id}`);
    }

    static async createMedicalRecord(medicalRecord: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
        return await api.post("/medical-records", medicalRecord);
    }

    static async updateMedicalRecord(medicalRecord: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
        return await api.put(`/medical-records/${medicalRecord.record_id}`, medicalRecord);
    }

    static async deleteMedicalRecord(record_id: number): Promise<void> {
        return await api.delete(`/medical-records/${record_id}`);
    }
}

export class PrescriptionsService {
    static async getAllPrescriptions(): Promise<IPrescription[]> {
        return await api.get("/prescriptions");
    }

    static async getPrescriptionById(id: number): Promise<IPrescription> {
        return await api.get(`/prescriptions/${id}`);
    }

    static async createPrescription(prescription: Partial<IPrescription>): Promise<IPrescription> {
        return await api.post("/prescriptions", prescription);
    }

    static async updatePrescription(prescription: Partial<IPrescription>): Promise<IPrescription> {
        return await api.put(`/prescriptions/${prescription.prescription_id}`, prescription);
    }

    static async deletePrescription(prescription_id: number): Promise<void> {
        return await api.delete(`/prescriptions/${prescription_id}`);
    }
}

export class MedicationsService {
    static async getAllMedications(): Promise<IMedication[]> {
        return await api.get("/medications");
    }

    static async getMedicationById(id: number): Promise<IMedication> {
        return await api.get(`/medications/${id}`);
    }

    static async createMedication(medication: Partial<IMedication>): Promise<IMedication> {
        return await api.post("/medications", medication);
    }

    static async updateMedication(medication: Partial<IMedication>): Promise<IMedication> {
        return await api.put(`/medications/${medication.medication_id}`, medication);
    }

    static async deleteMedication(medication_id: number): Promise<void> {
        return await api.delete(`/medications/${medication_id}`);
    }
}
