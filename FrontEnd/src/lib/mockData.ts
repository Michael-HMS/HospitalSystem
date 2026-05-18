import type { IPatient, IDoctor, IUser } from "../interfaces/IUser";
import type { IDepartment } from "../interfaces/IDepartment";
import type { IAppointment, IMedicalRecord, IPrescription, IMedication } from "../interfaces/IAppointment";
import type { IPayment, IBill } from "../interfaces/IPayment";
import type { INotification } from "../interfaces/INotifications";

// Users
export const mockDoctors: IDoctor[] = [
    {
        doctor_id: 1,
        user_id: 1,
        role: "doctor",
        first_name: "John",
        last_name: "Doe",
        email: "doctor@example.com",
        phone: "1234567890",
        gender: "male",
        date_of_birth: "1980-01-01",
        address: "123 Main St",
        department_id: 1,
        specialization: "Cardiology",
        license_number: "123456",
        years_of_experience: 10,
        availability_status: "available",
    }
];

export const mockPatients: IPatient[] = [
    {
        patient_id: 1,
        user_id: 2,
        role: "patient",
        first_name: "Jane",
        last_name: "Smith",
        email: "patient@example.com",
        phone: "0987654321",
        gender: "female",
        date_of_birth: "1990-01-01",
        address: "456 Side St",
        blood_type: "A+",
        emergency_contact: "1234567890",
        insurance_number: "654321",
        allergies: ["none"],
        medical_history: ["none"],
    }
];

export const mockUsers: IUser[] = [...mockDoctors, ...mockPatients];

// Departments
export const mockDepartments: IDepartment[] = [
    {
        department_id: 1,
        department_name: "Cardiology",
        description: "Cardiology is the branch of medicine that deals with the heart and its diseases.",
        doctors: mockDoctors
    }
];

// Medical Data
export const mockMedications: IMedication[] = [
    {
        medication_id: 1,
        medication_name: "Medication 1",
        description: "Description 1",
        stock_quantity: 10,
        expiry_date: "2026-01-01",
        price: 10
    }
];

export const mockPrescriptions: IPrescription[] = [
    {
        prescription_id: 1,
        record_id: 1,
        doctor_id: 1,
        patient_id: 1,
        issue_date: "2024-01-01",
        notes: "General Notes",
        medications: mockMedications
    }
];

export const mockMedicalRecords: IMedicalRecord[] = [
    {
        record_id: 1,
        patient_id: 1,
        doctor_id: 1,
        appointment_id: 1,
        diagnosis: "General Checkup",
        treatment: "General Treatment",
        notes: "General Notes",
        created_at: "2024-01-01",
        prescription: mockPrescriptions
    }
];

// Appointments
export const mockAppointments: IAppointment[] = [
    {
        appointment_id: 1,
        patient_id: 1,
        doctor_id: 1,
        appointment_date: "2024-01-01",
        appointment_time: "10:00",
        status: "scheduled",
        reason: "General Checkup",
        created_at: "2024-01-01",
        medical_record: mockMedicalRecords[0]
    }
];

// Payments
export const mockPayments: IPayment[] = [
    {
        payment_id: 1,
        bill_id: 1,
        amount: 50,
        payment_method: "cash",
        transaction_reference: "ref1",
        payment_status: "paid",
        payment_date: "2024-01-01"
    }
];

export const mockBills: IBill[] = [
    {
        bill_id: 1,
        appointment_id: 1,
        patient_id: 1,
        subtotal: 100,
        tax: 0,
        total_amount: 100,
        bill_status: "paid",
        created_at: "2024-01-01",
        payments: mockPayments
    }
];

// Notifications
export const mockNotifications: INotification[] = [
    {
        notification_id: 1,
        user_id: 1,
        title: "Notification 1",
        message: "Message 1",
        is_read: false,
        created_at: "2024-01-01"
    }
];
