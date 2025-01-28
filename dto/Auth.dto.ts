import mongoose from "mongoose";

export interface CreateUserInput{
    name: string;
    lastname: string;
    phone: string;
    password: string;
    bloodType: string;
}

export interface UserPayload {
    _id: string | mongoose.Types.ObjectId;
    phone: string;
    name: string;
}


export interface OtpInput{
    phone: string;
    otp: Number;
}


export interface UserLogin{
    phone: string;
    password: string;
}



