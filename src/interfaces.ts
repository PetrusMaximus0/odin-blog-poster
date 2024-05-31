import { FormEvent } from "react";

export interface IComment {
    _id: string,
    date: Date,
    author: string,
    text: string,
}

export interface ICategory{
    _id: string,
    name: string,
    posts: string[],
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
    date?: Date,
    comments?: IComment[],
    categories: string[],    
}

export interface IUser {
    "posts": IPost[],
    "_id": string,
    "username": string,
    "password": string,
    "isAdmin": boolean,
    "__v": number,
}

export interface IArchive {
    date: number,
    number: number 
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
    posts: IPost[],
    pageNumber: number,
    lastPage: number,
}
