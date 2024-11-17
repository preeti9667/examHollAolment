export enum SubPaisaPaymentStatus {
    /**Update transaction as successful. */
    Success = '0000',
    /**Update transaction as failed */
    Failed = '0300',
    /** Update transaction as not completed. */
    NotCompleted = '0100',
    /** Update transaction as aborted. */
    Aborted = '0200',
    /** Make a request using transaction Enquiry */
    UnKnownResponse = '0999',
    /**Update Challan status as generated and come back to know if payment was made with the challan. */
    ChallanSpecific = '0400',
    /** Client transaction id not found in SabPaisa, update transaction as failed.*/
    NotFound = '404'
}