const API_URL = "http://localhost:3000";

export type RolBackend = "CLIENTE" | "CAJERO" | "REPARTIDOR" | "DUENO";

export type LoginRequest = {
  email: string;
  password: string;
  rol: RolBackend;
};

export type LoginResponse = {
  id: number;
  nombre: string;
  email: string;
  rol: RolBackend;
};

export async function loginUsuario(datos: LoginRequest): Promise<LoginResponse> {
  const respuesta = await fetch(`${API_URL}/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  const contenido = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(contenido.mensaje || "Error al iniciar sesión");
  }

  return contenido;

  
}
export type EstadoPedido =
  | "PENDIENTE"
  | "EN_PREPARACION"
  | "LISTO_PARA_ENTREGAR"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO"
  | "ENTREGA_FALLIDA";

export type DashboardResumen = {
  ventasDelDia: number;
  pedidosActivos: number;
  totalEfectivo: number;
  totalQrTransferencia: number;
};

export type DashboardPedido = {
  id: number;
  clienteNombre: string;
  telefono: string;
  estado: EstadoPedido;
  total: number;
  metodoPago: string;
  fechaHora: string;
};

export type DashboardAlerta = {
  tipo: string;
  productoNombre: string;
  detalle: string;
};

export type DashboardEstadoSistema = {
  online: boolean;
  sincronizado: boolean;
  datosPendientes: number;
};

export type CajeroDashboardResponse = {
  resumen: DashboardResumen;
  pedidosPendientes: DashboardPedido[];
  alertas: DashboardAlerta[];
  estadoSistema: DashboardEstadoSistema;
};

export async function obtenerDashboardCajero(): Promise<CajeroDashboardResponse> {
  const respuesta = await fetch(`${API_URL}/v1/cajero/dashboard`);

  const contenido = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(contenido.mensaje || "Error al cargar dashboard");
  }

  return contenido;
}

export type PedidoAsignado = {
  id: number;
  cliente: string;
  direccion: string;
  estado: EstadoPedido;   // reutilizamos el tipo que ya tienes
  total: number;
};

/**
 * Obtiene los pedidos asignados a un repartidor específico.
 * @param repartidorId - ID del repartidor logueado.
 */
export async function obtenerPedidosAsignados(repartidorId: number): Promise<PedidoAsignado[]> {
  const respuesta = await fetch(`${API_URL}/v1/repartidor/${repartidorId}/pedidos`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const contenido = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(contenido.mensaje || "Error al obtener pedidos asignados");
  }

  return contenido;
}

/**
 * Actualiza el estado de un pedido.
 * @param pedidoId - ID del pedido.
 * @param nuevoEstado - Nuevo estado (debe ser uno de los definidos en EstadoPedido).
 */
export async function actualizarEstadoPedido(pedidoId: number, nuevoEstado: EstadoPedido): Promise<void> {
  const respuesta = await fetch(`${API_URL}/v1/pedidos/${pedidoId}/estado`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ estado: nuevoEstado }),
  });

  const contenido = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(contenido.mensaje || "Error al actualizar estado del pedido");
  }

  return;
}

export async function obtenerHistorialRepartidor(id: number): Promise<PedidoAsignado[]> {
  const respuesta = await fetch(`${API_URL}/v1/repartidor/${id}/historial`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const contenido = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(contenido.mensaje || "Error al obtener historial del repartidor");
  }

  return contenido;
}
