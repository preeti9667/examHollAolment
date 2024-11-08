import { AccountType } from "@prisma/client";

export interface IAuthUser {
    id: string;
    phoneNumber: string;
    countryCode: string;
    email: string;
    type: AccountType
}