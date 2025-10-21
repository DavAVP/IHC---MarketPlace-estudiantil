import type {IUsuario} from '../entidades/IUsuario'


export const Usuario: IUsuario[] = [
    {
        id: 1,
        nombre: 'David',
        password: '123',
        correo: 'david@gmail.com',
    },

    {
        id: 2,
        nombre: 'Taylor',
        password: '1234',
        correo: 'taylor@gmail.com',
    },

    {
        id: 3,
        nombre: 'Administrador',
        correo: 'admin@gmail.com',
        password: 'admin',
        esAdmin: true,
    }
]