import { AccountType } from "@prisma/client";

export interface IAuthUser {
    id: string;
    phoneNumber: string;
    countryCode: string;
    email: string;
    type: AccountType
}

export interface IPermission {
    module: string;
    actions: string[]
}

export interface IRole {
    id: string;
    name: string;
    isSuper: boolean;
    permissions: IPermission[];
    isActive: boolean;
}

export interface IAuthAdmin extends IAuthUser {
    role: IRole;
}