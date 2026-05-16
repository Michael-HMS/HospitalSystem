import type { IPayment , IBill} from "../interfaces/IPayment";




const paymentsArray: IPayment[] = [
    {
        payment_id: 1,
        bill_id: 1,
        amount: 50,
        payment_method: "cash",
        transaction_reference: "ref1",
        payment_status: "paid",
        payment_date: "2022-01-01"
    }
];

const billsArray: IBill[] = [
    {
        bill_id: 1,
        appointment_id: 1,
        patient_id: 1,
        subtotal: 100,
        tax: 0,
        total_amount: 100,
        bill_status: "paid",
        created_at: "2022-01-01",
        payments:paymentsArray
    }
];

export class BillsService {
    static async getAllBills(): Promise<IBill[]> {
        return billsArray;
    }
    static async getBillById(id: number): Promise<IBill> {
        return billsArray.find((bill) => bill.bill_id === id)!;
    }
    static async createBill(bill: IBill): Promise<IBill> {
        billsArray.push(bill);
        return bill;
    }
    static async updateBill(bill: IBill): Promise<IBill> {
        const index = billsArray.findIndex((bill) => bill.bill_id === bill.bill_id);
        billsArray[index] = bill;
        return bill;
    }
    static async deleteBill(bill_id: number): Promise<void> {
        const index = billsArray.findIndex((bill) => bill.bill_id === bill_id);
        billsArray.splice(index, 1);
    }
    // static async getAllBills(): Promise<IBill[]> {
    //     const response = await api.get("/bills");
    //     return response.data;
    // }

    // static async getBillById(id: number): Promise<IBill> {
    //     const response = await api.get(`/bills/${id}`);
    //     return response.data;
    // }

    // static async createBill(bill: IBill): Promise<IBill> {
    //     const response = await api.post("/bills", bill);
    //     return response.data;
    // }

    // static async updateBill(bill: IBill): Promise<IBill> {
    //     const response = await api.put(`/bills/${bill.bill_id}`, bill);
    //     return response.data;
    // }

    // static async deleteBill(bill_id: number): Promise<void> {
    //     const response = await api.delete(`/bills/${bill_id}`);
    //     return response.data;
    // }
}

export class PaymentsService {
    static async getAllPayments(): Promise<IPayment[]> {
        return paymentsArray;
    }
    static async getPaymentById(id: number): Promise<IPayment> {
        return paymentsArray.find((payment) => payment.payment_id === id)!;
    }
    static async createPayment(payment: IPayment): Promise<IPayment> {
        paymentsArray.push(payment);
        return payment;
    }
    static async updatePayment(payment: IPayment): Promise<IPayment> {
        const index = paymentsArray.findIndex((payment) => payment.payment_id === payment.payment_id);
        paymentsArray[index] = payment;
        return payment;
    }
    static async deletePayment(payment_id: number): Promise<void> {
        const index = paymentsArray.findIndex((payment) => payment.payment_id === payment_id);
        paymentsArray.splice(index, 1);
    }
    // static async getAllPayments(): Promise<IPayment[]> {
    //     const response = await api.get("/payments");
    //     return response.data;
    // }

    // static async getPaymentById(id: number): Promise<IPayment> {
    //     const response = await api.get(`/payments/${id}`);
    //     return response.data;
    // }

    // static async createPayment(payment: IPayment): Promise<IPayment> {
    //     const response = await api.post("/payments", payment);
    //     return response.data;
    // }

    // static async updatePayment(payment: IPayment): Promise<IPayment> {
    //     const response = await api.put(`/payments/${payment.payment_id}`, payment);
    //     return response.data;
    // }

    // static async deletePayment(payment_id: number): Promise<void> {
    //     const response = await api.delete(`/payments/${payment_id}`);
    //     return response.data;
    // }
}
