import type { IPayment, IBill } from "../interfaces/IPayment";
// import { api } from "../lib/api";
import { mockBills, mockPayments } from "../lib/mockData";

export class BillsService {
    static async getAllBills(): Promise<IBill[]> {
        return mockBills;
        // return await api.get("/bills");
    }

    static async getBillById(id: number): Promise<IBill> {
        return mockBills.find(b => b.bill_id === id)!;
        // return await api.get(`/bills/${id}`);
    }

    static async createBill(bill: Partial<IBill>): Promise<IBill> {
        const newBill = { ...bill, bill_id: Date.now() } as IBill;
        mockBills.push(newBill);
        return newBill;
        // return await api.post("/bills", bill);
    }

    static async updateBill(bill: Partial<IBill>): Promise<IBill> {
        const index = mockBills.findIndex(b => b.bill_id === bill.bill_id);
        if (index !== -1) mockBills[index] = { ...mockBills[index], ...bill } as IBill;
        return mockBills[index];
        // return await api.put(`/bills/${bill.bill_id}`, bill);
    }

    static async deleteBill(bill_id: number): Promise<void> {
        const index = mockBills.findIndex(b => b.bill_id === bill_id);
        if (index !== -1) mockBills.splice(index, 1);
        // return await api.delete(`/bills/${bill_id}`);
    }
}

export class PaymentsService {
    static async getAllPayments(): Promise<IPayment[]> {
        return mockPayments;
        // return await api.get("/payments");
    }

    static async getPaymentById(id: number): Promise<IPayment> {
        return mockPayments.find(p => p.payment_id === id)!;
        // return await api.get(`/payments/${id}`);
    }

    static async createPayment(payment: Partial<IPayment>): Promise<IPayment> {
        const newPayment = { ...payment, payment_id: Date.now() } as IPayment;
        mockPayments.push(newPayment);
        return newPayment;
        // return await api.post("/payments", payment);
    }

    static async updatePayment(payment: Partial<IPayment>): Promise<IPayment> {
        const index = mockPayments.findIndex(p => p.payment_id === payment.payment_id);
        if (index !== -1) mockPayments[index] = { ...mockPayments[index], ...payment } as IPayment;
        return mockPayments[index];
        // return await api.put(`/payments/${payment.payment_id}`, payment);
    }

    static async deletePayment(payment_id: number): Promise<void> {
        const index = mockPayments.findIndex(p => p.payment_id === payment_id);
        if (index !== -1) mockPayments.splice(index, 1);
        // return await api.delete(`/payments/${payment_id}`);
    }
}
