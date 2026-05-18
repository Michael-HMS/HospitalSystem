import type { IMedicalRecord, IMedication, IPrescription } from "../interfaces/IAppointment";
import { api } from "../lib/api";
import { AuthService } from "./auth-service";

// ── Backend response shapes ───────────────────────────────────────────────────

interface BackendMedication {
    medicationId: number;
    medicationName: string;
    description: string;
    stockQuantity: number;
    expiryDate: string;
    price: number;
}

interface BackendPrescriptionDetail {
    detailId: number;
    medicationId: number;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
}

interface BackendPrescription {
    prescriptionId: number;
    medicalRecordId: number;
    patientId: number;
    patientName: string;
    doctorId: number;
    doctorName: string;
    issueDate: string;
    notes: string;
    details: BackendPrescriptionDetail[];
}

interface BackendMedicalRecord {
    recordId: number;
    patientId: number;
    patientName: string;
    doctorId: number;
    doctorName: string;
    appointmentId: number;
    diagnosis: string;
    treatment: string;
    notes: string;
    createdAt: string;
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapMedication(m: BackendMedication): IMedication {
    return {
        medication_id: m.medicationId,
        medication_name: m.medicationName ?? "",
        description: m.description ?? "",
        stock_quantity: m.stockQuantity ?? 0,
        expiry_date: m.expiryDate ?? "",
        price: Number(m.price ?? 0),
    };
}

function mapPrescription(p: BackendPrescription): IPrescription {
    const medications: IMedication[] = (p.details || []).map((d) => ({
        medication_id: d.medicationId,
        medication_name: d.medicationName ?? "",
        description: "",
        stock_quantity: 0,
        expiry_date: "",
        price: 0,
    }));

    return {
        prescription_id: p.prescriptionId,
        record_id: p.medicalRecordId,
        doctor_id: p.doctorId,
        patient_id: p.patientId,
        issue_date: p.issueDate ?? "",
        notes: p.notes ?? "",
        medications,
    };
}

function mapMedicalRecord(r: BackendMedicalRecord): IMedicalRecord {
    return {
        record_id: r.recordId,
        patient_id: r.patientId,
        doctor_id: r.doctorId,
        appointment_id: r.appointmentId,
        diagnosis: r.diagnosis ?? "",
        treatment: r.treatment ?? "",
        notes: r.notes ?? "",
        created_at: r.createdAt ?? "",
    };
}

// ── Services ──────────────────────────────────────────────────────────────────

export class MedicalRecordsService {
    static async getMedicalHistoryByPatient(doctorId: number, patientId: number): Promise<IMedicalRecord[]> {
        const data: BackendMedicalRecord[] = await api.get(
            `/doctors/${doctorId}/patients/${patientId}/medical-history`
        );
        return (data || []).map(mapMedicalRecord);
    }

    static async getAllMedicalRecords(): Promise<IMedicalRecord[]> {
        // No global list endpoint — returns empty; use role-specific methods
        return [];
    }

    static async getMedicalRecordById(id: number): Promise<IMedicalRecord> {
        throw new Error(`No single medical record endpoint for id ${id}`);
    }

    static async getMedicalRecordsByPatient(patientId: number): Promise<IMedicalRecord[]> {
        const data: BackendMedicalRecord[] = await api.get(`/patients/${patientId}/medical-records`);
        return (data || []).map(mapMedicalRecord);
    }

    static async getMedicalRecordsByDoctor(_doctorId: number): Promise<IMedicalRecord[]> {
        return [];
    }

    static async createMedicalRecord(
        doctorId: number,
        record: { patientId: number; appointmentId: number; diagnosis: string; treatment: string; notes?: string }
    ): Promise<IMedicalRecord> {
        const data: BackendMedicalRecord = await api.post(`/doctors/${doctorId}/medical-records`, record);
        return mapMedicalRecord(data);
    }

    static async updateMedicalRecord(
        doctorId: number,
        recordId: number,
        record: Partial<{ patientId: number; appointmentId: number; diagnosis: string; treatment: string; notes: string }>
    ): Promise<IMedicalRecord> {
        const data: BackendMedicalRecord = await api.put(
            `/doctors/${doctorId}/medical-records/${recordId}`,
            record
        );
        return mapMedicalRecord(data);
    }

    static async deleteMedicalRecord(_record_id: number): Promise<void> {
        // No delete endpoint on the backend
    }
}

export class PrescriptionsService {
    static async getPatientPrescriptions(doctorId: number, patientId: number): Promise<IPrescription[]> {
        const data: BackendPrescription[] = await api.get(
            `/doctors/${doctorId}/patients/${patientId}/prescriptions`
        );
        return (data || []).map(mapPrescription);
    }

    static async getAllPrescriptions(): Promise<IPrescription[]> {
        return [];
    }

    static async getPrescriptionById(_id: number): Promise<IPrescription> {
        throw new Error("No single prescription endpoint");
    }

    static async createPrescription(
        doctorId: number,
        prescription: {
            patientId: number;
            medicalRecordId?: number;
            notes?: string;
            details: Array<{ medicationId: number; dosage: string; frequency: string; duration: string }>;
        }
    ): Promise<IPrescription> {
        const data: BackendPrescription = await api.post(`/doctors/${doctorId}/prescriptions`, prescription);
        return mapPrescription(data);
    }

    static async updatePrescription(_prescription: Partial<IPrescription>): Promise<IPrescription> {
        throw new Error("No update prescription endpoint");
    }

    static async deletePrescription(_prescription_id: number): Promise<void> {
        // No delete endpoint
    }
}

export class MedicationsService {
    static async getAllMedications(): Promise<IMedication[]> {
        const data: BackendMedication[] = await api.get("/medications");
        return (data || []).map(mapMedication);
    }

    static async getMedicationById(id: number): Promise<IMedication> {
        const data: BackendMedication = await api.get(`/medications/${id}`);
        return mapMedication(data);
    }

    static async createMedication(_medication: Partial<IMedication>): Promise<IMedication> {
        throw new Error("No create medication endpoint");
    }

    static async updateMedication(_medication: Partial<IMedication>): Promise<IMedication> {
        throw new Error("No update medication endpoint");
    }

    static async deleteMedication(_medication_id: number): Promise<void> {
        // No delete endpoint
    }
}
