export interface IPayment {
    payment_id: number;
    bill_id: number;
    amount: number;
    payment_method: string;
    payment_status: string;
    transaction_reference: string;
    payment_date: string;
}

export interface IBill {
    bill_id: number;
    patient_id: number;
    appointment_id: number;
    subtotal: number;
    tax:number;
    total_amount:number;
    bill_status: string;
    created_at: string;
    payments?: IPayment[];
}
