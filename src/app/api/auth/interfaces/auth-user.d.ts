import { AccountType } from "@prisma/client";

export interface IAuthUser {
    id: string;
    phone_number: string;
    country_code: string;
    email: string;
    type: AccountType
}