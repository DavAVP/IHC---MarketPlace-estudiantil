export type UserRole = 'estudiante' | 'comprador' | 'admin'


export interface IUsuario{
    id_usuario: number
    nombre: string
    correo: string
    rol: UserRole
    password: string
    fotoPerfil?: string
}

