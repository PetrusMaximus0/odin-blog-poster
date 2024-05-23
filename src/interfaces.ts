import { FormEvent } from "react";

export interface IPosts {
    title: string,
}

export interface IUser {
    "posts": IPosts[],
    "_id": string,
    "username": string,
    "password": string,
    "isAdmin": boolean,
    "__v": number,
}

export interface LoginFormState {
    username: string,
    password: string,
}

export interface IInputProps{
    handleInputChange: (e: FormEvent<HTMLInputElement>) => void,
    value: string,
    name: string,
    required: boolean,
    inputType: string,
}