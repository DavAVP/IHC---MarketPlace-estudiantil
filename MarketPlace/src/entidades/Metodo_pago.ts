export interface IMetodo_pago{
    id_metodoPago: string
    usuario_id: string
    producto_id?: string
    tipo_pago: 'efectivo' | 'transferencia' | 'paypal'
    nombre: string
    detalles: string
    comentario: string
}