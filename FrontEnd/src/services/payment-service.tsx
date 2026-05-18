import type { IPayment, IBill } from "../interfaces/IPayment";

import { api } from "../lib/api";
import { AuthService } from "./auth-service";

export class BillsService {
    static async getAllBills(): Promise<IBill[]> {
        const patientId = AuthService.getProfileId();
        if (!patientId) throw new Error("No patient ID found");
        
        const data = await api.get(`/patients/${patientId}/bills`);
        
        // Map backend response to IBill format
        return data.map((bill: any) => ({
            invoice_id: `INV-${bill.billId}`,
            amount: bill.totalAmount,
            status: bill.status?.toLowerCase() === "paid" ? "paid" : "unpaid",
            date: bill.issuedDate,
            doctor_id: "Hospital", // Backend doesn't have doctor info on bills currently
            description: `Hospital Bill #${bill.billId}`
        }));
    }

    static async getBillById(_id: number): Promise<IBill> {
        throw new Error("Endpoint not available");
    }

    static async createBill(_bill: Partial<IBill>): Promise<IBill> {
        throw new Error("Endpoint not available");
    }

    static async updateBill(_bill: Partial<IBill>): Promise<IBill> {
        throw new Error("Endpoint not available");
    }

    static async deleteBill(_bill_id: number): Promise<void> {
    }
}

export class PaymentsService {
    static async getAllPayments(): Promise<IPayment[]> {
        return [];
    }

    static async getPaymentById(_id: number): Promise<IPayment> {
        throw new Error("Payments endpoint not yet available");
    }

    static async createPayment(_payment: Partial<IPayment>): Promise<IPayment> {
        throw new Error("Payments endpoint not yet available");
    }

    static async updatePayment(_payment: Partial<IPayment>): Promise<IPayment> {
        throw new Error("Payments endpoint not yet available");
    }

    static async deletePayment(_payment_id: number): Promise<void> {
        // No endpoint
    }
}
