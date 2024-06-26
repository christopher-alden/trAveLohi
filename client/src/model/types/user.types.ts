import { UserGender } from "@util/user.util"

export enum UserRole{
    user = "user",
    admin = "admin"
}
export interface UserModel{
    ID?:number,
    firstName: string,
    lastName: string,
    email:string,
    gender: UserGender,
    dateOfBirth: Date,
    profilePhoto: string,
    securityQuestion: string,
    securityQuestionAnswer: string,
    role: UserRole,
    isBanned: boolean,
    isNewsletter: boolean
    phoneNumber?:string,
    balance?: number
    address?: string
    ccId?:number
    userCC?: UserCC
}

export interface RegisterUserModel extends UserModel{
    password?:string
}

export type UserCredentials = {
    email:string,
    password: string,
}

export type UserOTP = {
    email:string,
    OTP: string,
}

export interface Traveler{
    ID?: number,
    firstName: string,
    lastName: string,
    passportNumber: string,
    dateOfBirth: Date,
}


export type UserTransaction = {
    ID?:number,
    userId:number,
    price:number,
    transactionDate:Date
    status:TransactionType
}

export enum TransactionType {
    Cart = 'cart',
    Completed = 'completed',
    Cancelled = 'cancelled',
    Refunded = 'refunded',
    Pending = 'pending'
}



export interface UserUpdatePayload {
    userId: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    isNewsletter?: boolean;
    profilePhoto?: string;
}


export interface UserCC {
    number: string;
    type: string;
    cvv: string;
    name: string;
    }

export interface TopUpFormData {
    ccDetails: UserCC;
    topUpAmount: number;
}
