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
    Requested = 'REQUESTED',
    Rejected = 'REJECTED',
    Approved = 'APPROVED'
}


export enum PaymentRefundType {
    Full = 'FULL',
    SecurityDeposit = 'SECURITY_DEPOSIT',
}