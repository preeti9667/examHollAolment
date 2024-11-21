export enum BookingStatus {
    Draft = 10,
    Pending = 20,
    AwaitingForPayment = 30,
    Booked = 50,
    Failed = 70,
    Cancelled = 90,
    Completed = 110
}


export enum BookingCancelledBy {
    Admin = 'ADMIN',
    User = 'USER',
    System = 'SYSTEM'
}
