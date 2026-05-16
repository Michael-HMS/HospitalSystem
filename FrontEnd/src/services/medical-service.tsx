import type { IMedicalRecord } from "../interfaces/IAppointment";
import type { IMedication } from "../interfaces/IAppointment";
import type { IPrescription } from "../interfaces/IAppointment";

const medicationsArray: IMedication[] = [
    {
        medication_id: 1,
        medication_name: "Medication 1",
        description: "Description 1",
        stock_quantity: 10,
        expiry_date: "2022-01-01",
        price: 10
    }
];

const prescriptionsArray: IPrescription[] = [
    {
        prescription_id: 1,
        record_id: 1,
        doctor_id: 1,
        patient_id: 1,
        issue_date: "2022-01-01",
        notes: "General Notes",
        medications: medicationsArray
    }
];

const medicalRecordsArray: IMedicalRecord[] = [
    {
        record_id: 1,
        patient_id: 1,
        doctor_id: 1,
        appointment_id: 1,
        diagnosis: "General Checkup",
        treatment: "General Treatment",
        notes: "General Notes",
        created_at: "2022-01-01",
        prescription:prescriptionsArray
    }
];

export class MedicalRecordsService {
    static async getAllMedicalRecords(): Promise<IMedicalRecord[]> {
        return medicalRecordsArray;
    }
    static async getMedicalRecordById(id: number): Promise<IMedicalRecord> {
        return medicalRecordsArray.find((medicalRecord) => medicalRecord.record_id === id)!;
    }
    static async getMedicalRecordsByPatient(patient_id: number): Promise<IMedicalRecord[]> {
        return medicalRecordsArray.filter((medicalRecord) => medicalRecord.patient_id === patient_id);
    }
    static async getMedicalRecordsByDoctor(doctor_id: number): Promise<IMedicalRecord[]> {
        return medicalRecordsArray.filter((medicalRecord) => medicalRecord.doctor_id === doctor_id);
    }
    static async createMedicalRecord(medicalRecord: IMedicalRecord): Promise<IMedicalRecord> {
        medicalRecordsArray.push(medicalRecord);
        return medicalRecord;
    }
    static async updateMedicalRecord(medicalRecord: IMedicalRecord): Promise<IMedicalRecord> {
        const index = medicalRecordsArray.findIndex((medicalRecord) => medicalRecord.record_id === medicalRecord.record_id);
        medicalRecordsArray[index] = medicalRecord;
        return medicalRecord;
    }
    static async deleteMedicalRecord(record_id: number): Promise<void> {
        const index = medicalRecordsArray.findIndex((medicalRecord) => medicalRecord.record_id === record_id);
        medicalRecordsArray.splice(index, 1);
    }
    //     static async getAllMedicalRecords(): Promise<IMedicalRecord[]> {
    //         const response = await api.get("/medical-records");
    //         return response.data;
    //     }

    //     static async getMedicalRecordById(id: number): Promise<IMedicalRecord> {
    //         const response = await api.get(`/medical-records/${id}`);
    //         return response.data;
    //     }
    
    //     static async getMedicalRecordsByPatient(patient_id: number): Promise<IMedicalRecord[]> {
    //         const response = await api.get(`/medical-records/patient/${patient_id}`);
    //         return response.data;
    //     }
    
    //     static async getMedicalRecordsByDoctor(doctor_id: number): Promise<IMedicalRecord[]> {
    //         const response = await api.get(`/medical-records/doctor/${doctor_id}`);
    //         return response.data;
    //     }
    
    //     static async createMedicalRecord(medicalRecord: IMedicalRecord): Promise<IMedicalRecord> {
    //         const response = await api.post("/medical-records", medicalRecord);
    //         return response.data;
    //     }
    
    //     static async updateMedicalRecord(medicalRecord: IMedicalRecord): Promise<IMedicalRecord> {
    //         const response = await api.put(`/medical-records/${medicalRecord.record_id}`, medicalRecord);
    //         return response.data;
    //     }
    
    //     static async deleteMedicalRecord(record_id: number): Promise<void> {
    //         const response = await api.delete(`/medical-records/${record_id}`);
    //         return response.data;
    //     }
}

export class PrescriptionsService {
    static async getAllPrescriptions(): Promise<IPrescription[]> {
        return prescriptionsArray;
    }
    static async getPrescriptionById(id: number): Promise<IPrescription> {
        return prescriptionsArray.find((prescription) => prescription.prescription_id === id)!;
    }
    static async createPrescription(prescription: IPrescription): Promise<IPrescription> {
        prescriptionsArray.push(prescription);
        return prescription;
    }
    static async updatePrescription(prescription: IPrescription): Promise<IPrescription> {
        const index = prescriptionsArray.findIndex((prescription) => prescription.prescription_id === prescription.prescription_id);
        prescriptionsArray[index] = prescription;
        return prescription;
    }
    static async deletePrescription(prescription_id: number): Promise<void> {
        const index = prescriptionsArray.findIndex((prescription) => prescription.prescription_id === prescription_id);
        prescriptionsArray.splice(index, 1);
    }
    //     static async getAllPrescriptions(): Promise<IPrescription[]> {
    //         const response = await api.get("/prescriptions");
    //         return response.data;
    //     }

    //     static async getPrescriptionById(id: number): Promise<IPrescription> {
    //         const response = await api.get(`/prescriptions/${id}`);
    //         return response.data;
    //     }
    
    //     static async createPrescription(prescription: IPrescription): Promise<IPrescription> {
    //         const response = await api.post("/prescriptions", prescription);
    //         return response.data;
    //     }
    
    //     static async updatePrescription(prescription: IPrescription): Promise<IPrescription> {
    //         const response = await api.put(`/prescriptions/${prescription.prescription_id}`, prescription);
    //         return response.data;
    //     }
    
    //     static async deletePrescription(prescription_id: number): Promise<void> {
    //         const response = await api.delete(`/prescriptions/${prescription_id}`);
    //         return response.data;
    //     }
}

export class MedicationsService {
    static async getAllMedications(): Promise<IMedication[]> {
        return medicationsArray;
    }
    static async getMedicationById(id: number): Promise<IMedication> {
        return medicationsArray.find((medication) => medication.medication_id === id)!;
    }
    static async createMedication(medication: IMedication): Promise<IMedication> {
        medicationsArray.push(medication);
        return medication;
    }
    static async updateMedication(medication: IMedication): Promise<IMedication> {
        const index = medicationsArray.findIndex((medication) => medication.medication_id === medication.medication_id);
        medicationsArray[index] = medication;
        return medication;
    }
    static async deleteMedication(medication_id: number): Promise<void> {
        const index = medicationsArray.findIndex((medication) => medication.medication_id === medication_id);
        medicationsArray.splice(index, 1);
    }
    //     static async getAllMedications(): Promise<IMedication[]> {
    //         const response = await api.get("/medications");
    //         return response.data;
    //     }

    //     static async getMedicationById(id: number): Promise<IMedication> {
    //         const response = await api.get(`/medications/${id}`);
    //         return response.data;
    //     }
    
    //     static async createMedication(medication: IMedication): Promise<IMedication> {
    //         const response = await api.post("/medications", medication);
    //         return response.data;
    //     }
    
    //     static async updateMedication(medication: IMedication): Promise<IMedication> {
    //         const response = await api.put(`/medications/${medication.medication_id}`, medication);
    //         return response.data;
    //     }
    
    //     static async deleteMedication(medication_id: number): Promise<void> {
    //         const response = await api.delete(`/medications/${medication_id}`);
    //         return response.data;
    //     }
}
