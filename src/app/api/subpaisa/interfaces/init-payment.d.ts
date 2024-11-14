export interface InitPaymentRequest {
    orderId: string;
    payerName: string;
    payerEmail: string;
    payerMobile: string;
    amount: number;
}