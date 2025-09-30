export interface UserLogged {
    isLoggedIn: boolean,
    user?: User,
    isAdmin?: boolean
}

export interface User {
    id: string
    name: string
    email: string
    img?: string
    role: string[]
    emailValidated: boolean
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
    razonSocial?: string
    CUIT?: string
    phone?: string
    direccion?: string
    localidad?: string
    provincia?: string
    codigoPostal?: number
    approvedAt?: string
    approvedBy?: string
    rejectedAt?: string
    rejectedBy?: string
}