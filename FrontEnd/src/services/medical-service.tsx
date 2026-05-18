import type { IMedicalRecord, IMedication, IPrescription } from "../interfaces/IAppointment";
// import { api } from "../lib/api";
import { mockMedicalRecords, mockPrescriptions, mockMedications } from "../lib/mockData";

export class MedicalRecordsService {
    static async getAllMedicalRecords(): Promise<IMedicalRecord[]> {
        return mockMedicalRecords;
        // return await api.get("/medical-records");
    }

    static async getMedicalRecordById(id: number): Promise<IMedicalRecord> {
        return mockMedicalRecords.find(r => r.record_id === id)!;
        // return await api.get(`/medical-records/${id}`);
    }

    static async getMedicalRecordsByPatient(patient_id: number): Promise<IMedicalRecord[]> {
        return mockMedicalRecords.filter(r => r.patient_id === patient_id);
        // return await api.get(`/medical-records/patient/${patient_id}`);
    }

    static async getMedicalRecordsByDoctor(doctor_id: number): Promise<IMedicalRecord[]> {
        return mockMedicalRecords.filter(r => r.doctor_id === doctor_id);
        // return await api.get(`/medical-records/doctor/${doctor_id}`);
    }

    static async createMedicalRecord(medicalRecord: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
        const newRecord = { ...medicalRecord, record_id: Date.now() } as IMedicalRecord;
        mockMedicalRecords.push(newRecord);
        return newRecord;
        // return await api.post("/medical-records", medicalRecord);
    }

    static async updateMedicalRecord(medicalRecord: Partial<IMedicalRecord>): Promise<IMedicalRecord> {
        const index = mockMedicalRecords.findIndex(r => r.record_id === medicalRecord.record_id);
        if (index !== -1) mockMedicalRecords[index] = { ...mockMedicalRecords[index], ...medicalRecord } as IMedicalRecord;
        return mockMedicalRecords[index];
        // return await api.put(`/medical-records/${medicalRecord.record_id}`, medicalRecord);
    }

    static async deleteMedicalRecord(record_id: number): Promise<void> {
        const index = mockMedicalRecords.findIndex(r => r.record_id === record_id);
        if (index !== -1) mockMedicalRecords.splice(index, 1);
        // return await api.delete(`/medical-records/${record_id}`);
    }
}

export class PrescriptionsService {
    static async getAllPrescriptions(): Promise<IPrescription[]> {
        return mockPrescriptions;
        // return await api.get("/prescriptions");
    }

    static async getPrescriptionById(id: number): Promise<IPrescription> {
        return mockPrescriptions.find(p => p.prescription_id === id)!;
        // return await api.get(`/prescriptions/${id}`);
    }

    static async createPrescription(prescription: Partial<IPrescription>): Promise<IPrescription> {
        const newPresc = { ...prescription, prescription_id: Date.now() } as IPrescription;
        mockPrescriptions.push(newPresc);
        return newPresc;
        // return await api.post("/prescriptions", prescription);
    }

    static async updatePrescription(prescription: Partial<IPrescription>): Promise<IPrescription> {
        const index = mockPrescriptions.findIndex(p => p.prescription_id === prescription.prescription_id);
        if (index !== -1) mockPrescriptions[index] = { ...mockPrescriptions[index], ...prescription } as IPrescription;
        return mockPrescriptions[index];
        // return await api.put(`/prescriptions/${prescription.prescription_id}`, prescription);
    }

    static async deletePrescription(prescription_id: number): Promise<void> {
        const index = mockPrescriptions.findIndex(p => p.prescription_id === prescription_id);
        if (index !== -1) mockPrescriptions.splice(index, 1);
        // return await api.delete(`/prescriptions/${prescription_id}`);
    }
}

export class MedicationsService {
    static async getAllMedications(): Promise<IMedication[]> {
        return mockMedications;
        // return await api.get("/medications");
    }

    static async getMedicationById(id: number): Promise<IMedication> {
        return mockMedications.find(m => m.medication_id === id)!;
        // return await api.get(`/medications/${id}`);
    }

    static async createMedication(medication: Partial<IMedication>): Promise<IMedication> {
        const newMed = { ...medication, medication_id: Date.now() } as IMedication;
        mockMedications.push(newMed);
        return newMed;
        // return await api.post("/medications", medication);
    }

    static async updateMedication(medication: Partial<IMedication>): Promise<IMedication> {
        const index = mockMedications.findIndex(m => m.medication_id === medication.medication_id);
        if (index !== -1) mockMedications[index] = { ...mockMedications[index], ...medication } as IMedication;
        return mockMedications[index];
        // return await api.put(`/medications/${medication.medication_id}`, medication);
    }

    static async deleteMedication(medication_id: number): Promise<void> {
        const index = mockMedications.findIndex(m => m.medication_id === medication_id);
        if (index !== -1) mockMedications.splice(index, 1);
        // return await api.delete(`/medications/${medication_id}`);
    }
}
