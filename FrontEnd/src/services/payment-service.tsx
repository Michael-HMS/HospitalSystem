import type { IPayment, IBill } from "../interfaces/IPayment";

// Bills and Payments are not yet exposed by the backend API.
// This service returns empty data until /api/bills and /api/payments endpoints are added.

export class BillsService {
    static async getAllBills(): Promise<IBill[]> {
        return [];
    }

    static async getBillById(_id: number): Promise<IBill> {
        throw new Error("Bills endpoint not yet available");
    }

    static async createBill(_bill: Partial<IBill>): Promise<IBill> {
        throw new Error("Bills endpoint not yet available");
    }

    static async updateBill(_bill: Partial<IBill>): Promise<IBill> {
        throw new Error("Bills endpoint not yet available");
    }

    static async deleteBill(_bill_id: number): Promise<void> {
        // No endpoint
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
