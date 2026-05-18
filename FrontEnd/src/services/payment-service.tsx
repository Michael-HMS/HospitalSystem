import type { IPayment, IBill } from "../interfaces/IPayment";
import { api } from "../lib/api";

export class BillsService {
    static async getAllBills(): Promise<IBill[]> {
        return await api.get("/bills");
    }

    static async getBillById(id: number): Promise<IBill> {
        return await api.get(`/bills/${id}`);
    }

    static async createBill(bill: Partial<IBill>): Promise<IBill> {
        return await api.post("/bills", bill);
    }

    static async updateBill(bill: Partial<IBill>): Promise<IBill> {
        return await api.put(`/bills/${bill.bill_id}`, bill);
    }

    static async deleteBill(bill_id: number): Promise<void> {
        return await api.delete(`/bills/${bill_id}`);
    }
}

export class PaymentsService {
    static async getAllPayments(): Promise<IPayment[]> {
        return await api.get("/payments");
    }

    static async getPaymentById(id: number): Promise<IPayment> {
        return await api.get(`/payments/${id}`);
    }

    static async createPayment(payment: Partial<IPayment>): Promise<IPayment> {
        return await api.post("/payments", payment);
    }

    static async updatePayment(payment: Partial<IPayment>): Promise<IPayment> {
        return await api.put(`/payments/${payment.payment_id}`, payment);
    }

    static async deletePayment(payment_id: number): Promise<void> {
        return await api.delete(`/payments/${payment_id}`);
    }
}
