export interface UserLogged {
    isLoggedIn : boolean,
    user?: User
}

export interface User {
    name: string
    email: string
    img: string
    role: string
}