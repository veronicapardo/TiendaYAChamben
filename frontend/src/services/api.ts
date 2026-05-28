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
  imageUrl: string;
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

export type ProductoApi = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  unidad: string;
  proveedor: string;
  fechaActualizacion: string;
  activo: boolean;
  imageUrl: string;
};

type ProductoBackend = {
  id: number;
  nombre?: string;
  categoria?: string;
  precio?: number;
  precioVenta?: number;
  precioUnitario?: number;
  stock?: number;
  unidad?: string;
  proveedor?: string;
  fechaActualizacion?: string;
  fechaVencimiento?: string;
  createdAt?: string;
  updatedAt?: string;
  activo?: boolean;
  imageUrl?: string;
  image_url?: string;
};

function normalizarProducto(producto: ProductoBackend): ProductoApi {
  const fecha =
    producto.fechaActualizacion ||
    producto.updatedAt ||
    producto.createdAt ||
    producto.fechaVencimiento ||
    "";

  return {
    id: producto.id,
    nombre: producto.nombre || "Producto sin nombre",
    categoria: producto.categoria || "Sin categoría",
    precio: Number(
      producto.precio ??
      producto.precioVenta ??
      producto.precioUnitario ??
      0
    ),
    stock: Number(producto.stock ?? 0),
    unidad: producto.unidad || "Unidad",
    proveedor: producto.proveedor || "No registrado",
    fechaActualizacion: fecha
      ? new Date(fecha).toLocaleDateString("es-BO")
      : "-",
    activo: producto.activo !== false,
    imageUrl: producto.imageUrl || producto.image_url || "",
  };
}

export async function obtenerProductos(): Promise<ProductoApi[]> {
  const respuesta = await fetch(`${API_URL}/v1/productos`);

  const contenido = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(contenido.mensaje || "Error al cargar productos");
  }

  const lista = Array.isArray(contenido) ? contenido : [];

  return lista
    .map((producto: ProductoBackend) => normalizarProducto(producto))
    .filter((producto: ProductoApi) => producto.activo);
}

export type CreateVentaRapidaDto = {
  costoEnvio?: number;
  clienteNombre?: string;
  observaciones?: string;
  metodoPago: "EFECTIVO" | "QR" | "TRANSFERENCIA" | "MIXTO";
  montoRecibido?: number;
  montoEfectivo?: number;
  montoDigital?: number;
  referenciaPago?: string;
  generarFactura: boolean;
  nitCi?: string;
  razonSocial?: string;
  productos: {
    productoId: number;
    cantidad: number;
  }[];
};

export async function crearVentaRapida(data: CreateVentaRapidaDto) {
  const respuesta = await fetch("http://localhost:3000/v1/ventas/rapida", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || "No se pudo registrar la venta");
  }

  return resultado;
}

export type FacturaResponse = {
  id: number;
  ventaId: number;
  nitCi: string;
  razonSocial: string;
  fechaEmision: string;
  total: number;
  metodoPago: "EFECTIVO" | "QR" | "TRANSFERENCIA" | "MIXTO";
  estadoFactura: "EMITIDA" | "ANULADA";
};

export async function obtenerFacturaPorVenta(ventaId: number): Promise<FacturaResponse> {
  const respuesta = await fetch(`http://localhost:3000/v1/facturas/venta/${ventaId}`);

  let resultado: any = null;

  try {
    resultado = await respuesta.json();
  } catch {
    resultado = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      resultado?.mensaje ||
        resultado?.message ||
        resultado?.error ||
        "No se pudo obtener la factura"
    );
  }

  return resultado;
}

export type CreatePedidoDto = {
  clienteId: number;
  repartidorId?: number;
  direccionEntrega: string;
  productos: {
    productoId: number;
    cantidad: number;
  }[];
};

export async function crearPedido(data: CreatePedidoDto) {
  const respuesta = await fetch("http://localhost:3000/v1/pedidos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let resultado: any = null;

  try {
    resultado = await respuesta.json();
  } catch {
    resultado = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      resultado?.mensaje ||
        resultado?.message ||
        resultado?.error ||
        "No se pudo registrar el pedido"
    );
  }

  return resultado;
}

export type CreatePedidoRapidoDto = {
  clienteNombre: string;
  clienteTelefono: string;
  direccionEntrega: string;
  referenciaEntrega?: string;
  zona?: string;
  observaciones?: string;
  repartidorId?: number;
  costoEnvio?: number;
  productos: {
    productoId: number;
    cantidad: number;
  }[];
};

export async function crearPedidoRapido(data: CreatePedidoRapidoDto) {
  const respuesta = await fetch("http://localhost:3000/v1/pedidos/rapido", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let resultado: any = null;

  try {
    resultado = await respuesta.json();
  } catch {
    resultado = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      resultado?.mensaje ||
        resultado?.message ||
        resultado?.error ||
        "No se pudo registrar el pedido pendiente"
    );
  }

  return resultado;
}

export type PedidoDetalleApi = {
  id: number;
  productoId?: number;
  productoNombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
};

export type PedidoApi = {
  id: number;
  clienteId?: number;
  clienteNombre?: string;
  clienteTelefono?: string;
  repartidorId?: number;
  repartidorNombre?: string;
  direccionEntrega: string;
  total: number;
  estado: "PENDIENTE" | "EN_PROCESO" | "ENTREGADO" | "CANCELADO";
  fechaPedido?: string;
  createdAt?: string;
  detalles?: PedidoDetalleApi[];
};

export async function obtenerPedidos(): Promise<PedidoApi[]> {
  const respuesta = await fetch("http://localhost:3000/v1/pedidos");

  let resultado: any = null;

  try {
    resultado = await respuesta.json();
  } catch {
    resultado = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      resultado?.mensaje ||
        resultado?.message ||
        resultado?.error ||
        "No se pudieron cargar los pedidos"
    );
  }

  return resultado;
}

export async function cancelarPedido(id: number) {
  const respuesta = await fetch(`http://localhost:3000/v1/pedidos/${id}`, {
    method: "DELETE",
  });

  let resultado: any = null;

  try {
    resultado = await respuesta.json();
  } catch {
    resultado = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      resultado?.mensaje ||
        resultado?.message ||
        resultado?.error ||
        "No se pudo cancelar el pedido"
    );
  }

  return resultado;
}

export type ConvertirPedidoVentaDto = {
  metodoPago: "EFECTIVO" | "QR" | "TRANSFERENCIA" | "MIXTO";
  montoRecibido?: number;
  montoEfectivo?: number;
  montoDigital?: number;
  referenciaPago?: string;
  generarFactura: boolean;
  nitCi?: string;
  razonSocial?: string;
};

export async function convertirPedidoEnVenta(
  pedidoId: number,
  data: ConvertirPedidoVentaDto
) {
  const respuesta = await fetch(
    `http://localhost:3000/v1/ventas/pedido/${pedidoId}/convertir-venta`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  let resultado: any = null;

  try {
    resultado = await respuesta.json();
  } catch {
    resultado = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      resultado?.mensaje ||
        resultado?.message ||
        resultado?.error ||
        "No se pudo convertir el pedido en venta"
    );
  }

  return resultado;
}

// ============================================================
// TIPOS PARA EL ADMIN DASHBOARD
// ============================================================

export type VentaResponseDto = {
  id: number;
  pedidoId: number;
  pagoId: number | null;
  clienteNombre: string;
  fechaVenta: string; // LocalDateTime viene como string ISO
  montoTotal: number;
  estadoVenta: "PENDIENTE" | "COMPLETADA" | "CANCELADA";
  comprobante: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductoResponseDto = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  fechaVencimiento: string | null;
  imageUrl: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PedidoAdminDto = {
  id: number;
  clienteId: number;
  clienteNombre: string;
  repartidorId: number | null;
  repartidorNombre: string | null;
  fechaHora: string;
  direccionEntrega: string;
  estado:
    | "PENDIENTE"
    | "EN_PREPARACION"
    | "LISTO_PARA_ENTREGAR"
    | "EN_CAMINO"
    | "ENTREGADO"
    | "CANCELADO"
    | "ENTREGA_FALLIDA";
  total: number;
  detalles: {
    id: number;
    productoId: number;
    productoNombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
  createdAt: string;
  updatedAt: string;
};


export async function obtenerVentas(): Promise<VentaResponseDto[]> {
  const res = await fetch(`${API_URL}/v1/ventas`);
  if (!res.ok) throw new Error("Error al obtener ventas");
  return res.json();
}

export async function obtenerPedidosAdmin(): Promise<PedidoAdminDto[]> {
  const res = await fetch(`${API_URL}/v1/pedidos`);
  if (!res.ok) throw new Error("Error al obtener pedidos");
  return res.json();
}


export async function obtenerTodosLosProductos(): Promise<ProductoResponseDto[]> {
  const res = await fetch(`${API_URL}/v1/productos`);
  if (!res.ok) throw new Error("Error al obtener productos");
  return res.json();
}

export type CreateProductoPayload = {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  fechaVencimiento?: string;
  imageUrl?: string;
};

export async function crearProducto(
  data: CreateProductoPayload
): Promise<ProductoResponseDto> {
  const res = await fetch(`${API_URL}/v1/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.mensaje || "Error al crear producto");
  return json;
}

export async function actualizarProducto(
  id: number,
  data: Partial<CreateProductoPayload> & { activo?: boolean }
): Promise<ProductoResponseDto> {
  const res = await fetch(`${API_URL}/v1/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.mensaje || "Error al actualizar producto");
  return json;
}

export async function eliminarProducto(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/v1/productos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
}

export async function actualizarEstadoPedido(
  id: number,
  estado: PedidoAdminDto["estado"]
): Promise<PedidoAdminDto> {
  const res = await fetch(`${API_URL}/v1/pedidos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.mensaje || "Error al actualizar pedido");
  return json;
}

export async function eliminarPedido(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/v1/pedidos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar pedido");
}