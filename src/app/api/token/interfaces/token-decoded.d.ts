import { AccountType } from "@prisma/client";

export interface TokenDecoded {
    type: AccountType;
    tid: string;
}