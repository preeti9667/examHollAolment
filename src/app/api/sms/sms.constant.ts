export const SMS_TEMPLATE = {
    loginOtp: {
        name: 'Login OTP',
        id: '1307173260385564172',
        message: 'Your OTP for login is {#otp#}. It is valid for 10 minutes. Do not share it with anyone. BSEB - Bihar Government.',
    },
    /** When booking fails skipped */
    bookingFailed: {
        name: 'Booking Failed',
        id: '1307173260391243300',
        message: 'Your booking attempt for {#bookingId#}, {#exam#} on {#dateTime#} has failed. Please try again or contact support. BSEB -Bihar Government.',
    },
    bookingCompleted: {
        name: 'Booking Completed',
        id: '1307173260398103781',
        message: 'Your booking for Exam {#examName#} on {#dateTime#} has been confirmed. Booking ID: {#bookingId#}.  BSEB - Bihar Government.',
    },
    bookingCanceled: {
        name: 'Booking Canceled',
        id: '1307173260403038922',
        message: 'Your booking for Exam {#examName#} on {#dateTime#} has been cancelled. Contact support for further details. BSEB -Bihar Government.',
    },
    /** When refund is processed */
    refundProcessed: {
        name: 'Refund Processed',
        id: '1307173260415351745',
        message: 'Your refund for Booking ID {#bookingId#} has been processed. It may take 3-5 days to reflect in your account. BSEB - Bihar Government.',
    },
    /** When payment is confirmed */
    paymentConfirmation: {
        name: 'Payment Confirmation',
        id: '1307173260419810962',
        message: 'Your payment of {#amount#} for Booking ID {#bookingId#} has been successfully received. BSEB - Bihar Government.',
    },
    /** when exam day is near before 1 day once */
    examDayReminder: {
        id: "1307173260428769555",
        name: "Exam Day Reminder",
        message:
            "Reminder: Your exam for {#examName#} is scheduled on {#dateTime#} at Location: Bapu Pariksha Parisar, Kumhrar, Patna, Bihar 800026. BSEB -Bihar Government.",
    },
    /** when payment fails with any reason */
    paymentFailure: {
        id: "1307173260440476249",
        name: "Payment Failure",
        message:
            "Your payment for Booking ID {#bookingId#} failed. Please retry or contact support for assistance. BSEB - Bihar Government.",
    },
    /** When user is being  activated by admin */
    accountActivation: {
        id: "1307173260443030739",
        name: "Account Activation",
        message: "Your account has been successfully activated. Welcome to Bapu Pariksha Parisar. BSEB -Bihar Government.",
    },
    /** when user account is deactivated by admin  */
    accountDeactivation: {
        id: "1307173260457297957",
        name: "Account Deactivation",
        message: "Your account has been deactivated. If you believe this is a mistake, contact support at {#var#}. BSEB - Bihar Government.",
    },


}


const smsTemplates = [
    {
        id: "1307173260385564172",
        templateName: "Login OTP",
        message:
            "Your OTP for login is {#var#}. It is valid for 10 minutes. Do not share it with anyone. BSEB - Bihar Government.",
    },
    {
        id: "1307173260391243300",
        templateName: "Booking Failed",
        message:
            "Your booking attempt for {#var#}{#var#} on {#var#} has failed. Please try again or contact support. BSEB -Bihar Government.",
    },
    {
        id: "1307173260398103781",
        templateName: "Booking Completed",
        message:
            "Your booking for {#var#}{#var#} on {#var#} has been confirmed. Booking ID: {#var#}.  BSEB - Bihar Government.",
    },
    {
        id: "1307173260403038922",
        templateName: "Booking Canceled",
        message:
            "Your booking for {#var#} on {#var#} has been cancelled. Contact support for further details. BSEB -Bihar Government.",
    },
    {
        id: "1307173260415351745",
        templateName: "Refund Processed",
        message:
            "Your refund for Booking ID {#var#} has been processed. It may take 3-5 days to reflect in your account. BSEB - Bihar Government.",
    },
    {
        id: "1307173260419810962",
        templateName: "Payment Confirmation",
        message:
            "Your payment of {#var#} for Booking ID {#var#} has been successfully received. BSEB - Bihar Government.",
    },
    {
        id: "1307173260428769555",
        templateName: "Exam Day Reminder",
        message:
            "Reminder: Your exam for {#var#} is scheduled on {#var#} at Location: Bapu Pariksha Parisar, Kumhrar, Patna, Bihar 800026. BSEB -Bihar Government.",
    },
    {
        id: "1307173260440476249",
        templateName: "Payment Failure",
        message:
            "Your payment for Booking ID {#var#} failed. Please retry or contact support for assistance. BSEB - Bihar Government.",
    },
    {
        id: "1307173260443030739",
        templateName: "Account Activation",
        message:
            "Your account has been successfully activated. Welcome to Bapu Pariksha Parisar. BSEB -Bihar Government.",
    },
    {
        id: "1307173260457297957",
        templateName: "Account Deactivation",
        message:
            "Your account has been deactivated. If you believe this is a mistake, contact support at {#var#}. BSEB - Bihar Government.",
    },
];