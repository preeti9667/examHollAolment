export enum BookingStatus {
    Draft = 10,
    // Pending = 20,
    AwaitingForPayment = 30,
    Booked = 50,
    PaymentFailed = 60,
    Failed = 70,
    AutoCancelled = 80,
    Cancelled = 90,
    Completed = 110,
    RefundRequested = 130,
    Refunded = 150
}


export enum BookingCancelledBy {
    Admin = 'ADMIN',
    User = 'USER',
    System = 'SYSTEM'
}


export const BOOKING_PRICE = {
    PER_SEAT: 125,
    SECURITY_DEPOSIT: 25000,
    ADD_ONS: {
        JAMMER: 50
    }
}
