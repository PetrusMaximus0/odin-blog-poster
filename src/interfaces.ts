import { FormEvent } from "react";

export interface IPosts {
    title: string,
}

export interface IComment {
    _id: string,
    name: string,
}

export interface ICategory{
    _id: string,
    name: string,
}

export interface IPost {
    _id: string,
    author: string,
    title: string,
    text: string,
    description: string,
    timeToRead: string,
    hidden: string,
    headerImage: string,
    date?: string,
    comments?: IComment[],
    categories?: string[],    
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

export type IInputChange = FormEvent<HTMLInputElement | HTMLTextAreaElement>;

export interface IInputProps{
    handleInputChange: (e: IInputChange) => void,
    value: string,
    name: string,
    required: boolean,
    inputType: string,
}

export interface ICatalogLoaderData{
    posts: IPosts[],
    pageNumber: number,
    lastPage: number,
}
