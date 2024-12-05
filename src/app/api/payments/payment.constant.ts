export enum PaymentStatus {
    Pending = 'PENDING',
    Success = 'SUCCESS',
    Failed = 'FAILED',
    Aborted = 'ABORTED',
    NotCompleted = 'NOT_COMPLETED',
    ChallanSpecific = 'CHALLAN_SPECIFIC',
    NotFound = 'NOT_FOUND'
}


export enum PaymentRefundStatus {
    Requested = 130,
    Rejected = 170,
    Approved = 150
}


export enum PaymentRefundType {
    Full = 'FULL',
    SecurityDeposit = 'SECURITY_DEPOSIT',
}


export enum PaymentRefundMethod {
    Upi = 'UPI',
    NetBanking = 'NET_BANKING',
    Cash = 'CASH'
}