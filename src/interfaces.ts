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