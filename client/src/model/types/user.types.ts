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