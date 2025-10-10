export interface IMetodo_pago{
    id_metodoPago: number
    usuario_id: number
    producto_id?: number
    tipo_pago: 'efectivo' | 'transferencia' | 'paypal'
    nombre: string
    detalles: string
    comentario: string
}