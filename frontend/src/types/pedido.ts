export type TipoEntrega =
  | "ENVIO"
  | "RECOJO";

export type EstadoPedido =
  | "PENDIENTE"
  | "EN_PREPARACION"
  | "EN_CAMINO"
  | "LISTO_RECOJO"
  | "ENTREGADO"
  | "CANCELADO"
  | "ENTREGA_FALLIDA";

export type Pedido = {
  id: number;
  fecha: string;
  total: number;

  estado: EstadoPedido;

  tipoEntrega: TipoEntrega;
};