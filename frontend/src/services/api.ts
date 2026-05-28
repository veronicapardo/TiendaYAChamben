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
    createdAt?: string;
  updatedAt?: string;
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
  createdAt: producto.createdAt,
  updatedAt: producto.updatedAt || producto.fechaActualizacion || producto.createdAt,
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
  repartidorId?: number | null;
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
 repartidorId?: number | null;
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

export type MovimientoCierreCajaApi = {
  fechaHora: string;
  movimiento: string;
  metodoPago: string;
  monto: number;
};

export type CierreCajaResponse = {
  ventasDelDia: number;
  transacciones: number;
  facturasEmitidas: number;
  pedidosConvertidos: number;
  efectivo: number;
  qrTransferencia: number;
  mixto: number;
  enviosCobrados: number;
  descuentosAplicados: number;
  totalRecaudado: number;
  ultimosMovimientos: MovimientoCierreCajaApi[];
};

export async function obtenerCierreCaja(): Promise<CierreCajaResponse> {
  const respuesta = await fetch("http://localhost:3000/v1/cierre-caja");

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
        "No se pudo cargar el cierre de caja"
    );
  }

  return resultado;
}

export type CreateCierreCajaRequest = {
  usuarioId?: number;
  montoBaseInicial: number;
  efectivoEsperado: number;
  efectivoContado: number;
  diferencia: number;
  totalRecaudado: number;
  observaciones: string;
};

export type CierreCajaGuardadoResponse = {
  id: number;
  fechaCierre: string;
  ventasDia: number;
  transacciones: number;
  facturasEmitidas: number;
  pedidosConvertidos: number;
  efectivo: number;
  qrTransferencias: number;
  mixto: number;
  enviosCobrados: number;
  descuentosAplicados: number;
  totalRecaudado: number;
  montoBaseInicial: number;
  efectivoEsperado: number;
  efectivoContado: number;
  diferencia: number;
  observaciones: string;
  estado: string;
  activo: boolean;
};

export async function cerrarCaja(
  datos: CreateCierreCajaRequest
): Promise<CierreCajaGuardadoResponse> {
  const respuesta = await fetch(`${API_URL}/v1/cierre-caja`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudo cerrar la caja"
    );
  }

  return contenido;
}
export type ReporteVentaDiaApi = {
  dia: string;
  valor: number;
};

export type ReporteMetodoPagoApi = {
  label: string;
  pct: number;
  monto: number;
};

export type ReporteProductoTopApi = {
  pos: number;
  nombre: string;
  cant: number;
  emoji: string;
};

export type ReporteMovimientoApi = {
  fecha: string;
  tipo: string;
  cliente: string;
  metodo: string;
  total: number;
  estado: string;
};

export type ReporteCanalApi = {
  nombre: string;
  total: number;
  porcentaje: number;
  transacciones: number;
};

export type ReporteGeneralResponse = {
  ventasTotales: number;
  pedidosEntregados: number;
  ticketPromedio: number;
  facturasEmitidas: number;
  ventasPorDia: ReporteVentaDiaApi[];
  metodosPago: ReporteMetodoPagoApi[];
  productosTop: ReporteProductoTopApi[];
  ultimosMovimientos: ReporteMovimientoApi[];
  resumenCanal: ReporteCanalApi[];
};

export async function obtenerReportes(params?: {
  desde?: string;
  hasta?: string;
  metodo?: string;
  estado?: string;
}): Promise<ReporteGeneralResponse> {
  const query = new URLSearchParams();

  if (params?.desde) query.set("desde", params.desde);
  if (params?.hasta) query.set("hasta", params.hasta);
  if (params?.metodo) query.set("metodo", params.metodo);
  if (params?.estado) query.set("estado", params.estado);

  const respuesta = await fetch(`${API_URL}/v1/reportes?${query.toString()}`);

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudo cargar el reporte"
    );
  }

  return contenido;
}

export type ClienteApi = {
  id: number;
  nombre: string;
  telefono: string;
  direccion?: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateClienteRequest = {
  nombre: string;
  telefono: string;
  direccion?: string;
};

export type UpdateClienteRequest = {
  nombre?: string;
  telefono?: string;
  direccion?: string;
  activo?: boolean;
};

export async function obtenerClientes(): Promise<ClienteApi[]> {
  const respuesta = await fetch(`${API_URL}/v1/clientes`);

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudieron cargar los clientes"
    );
  }

  return Array.isArray(contenido) ? contenido : [];
}

export async function crearCliente(
  datos: CreateClienteRequest
): Promise<ClienteApi> {
  const respuesta = await fetch(`${API_URL}/v1/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudo crear el cliente"
    );
  }

  return contenido;
}

export async function actualizarCliente(
  id: number,
  datos: UpdateClienteRequest
): Promise<ClienteApi> {
  const respuesta = await fetch(`${API_URL}/v1/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos),
  });

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudo actualizar el cliente"
    );
  }

  return contenido;
}

export async function eliminarCliente(id: number) {
  const respuesta = await fetch(`${API_URL}/v1/clientes/${id}`, {
    method: "DELETE",
  });

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudo eliminar el cliente"
    );
  }

  return contenido;
}

export type PedidoAsignadoRepartidor = {
  id: number;
  clienteNombre: string;
  repartidorId?: number;
  repartidorNombre?: string;
  direccionEntrega: string;
  estado: string;
  total: number;
  detalles?: unknown[];
  createdAt?: string;
  updatedAt?: string;
};
export async function obtenerPedidosAsignados(repartidorId: number): Promise<PedidoAsignadoRepartidor[]> {
  const respuesta = await fetch(`${API_URL}/v1/repartidor/${repartidorId}/pedidos`);

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudieron cargar los pedidos del repartidor"
    );
  }

  return Array.isArray(contenido) ? contenido : [];
}

export async function obtenerHistorialRepartidor(
  repartidorId: number
): Promise<PedidoAsignadoRepartidor[]> {
  const respuesta = await fetch(`${API_URL}/v1/repartidor/${repartidorId}/historial`);

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudo cargar el historial del repartidor"
    );
  }

  return Array.isArray(contenido) ? contenido : [];
}

export async function actualizarEstadoPedido(
  pedidoId: number,
  estado:
    | "PENDIENTE"
    | "EN_PREPARACION"
    | "LISTO_PARA_ENTREGAR"
    | "EN_CAMINO"
    | "ENTREGADO"
    | "CANCELADO"
    | "ENTREGA_FALLIDA",
  repartidorId?: number
) {
  const body: {
    estado: string;
    repartidorId?: number;
  } = {
    estado,
  };

  if (repartidorId !== undefined) {
    body.repartidorId = repartidorId;
  }

  const respuesta = await fetch(`${API_URL}/v1/pedidos/${pedidoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudo actualizar el estado del pedido"
    );
  }

  return contenido;
}

export type RepartidorApi = {
  id: number;
  nombre: string;
  telefono?: string;
  estadoDisponible?: boolean;
  activo?: boolean;
};

export async function obtenerRepartidoresDisponibles(): Promise<RepartidorApi[]> {
  const respuesta = await fetch(`${API_URL}/v1/repartidores/disponibles`);

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudieron cargar los repartidores disponibles"
    );
  }

  return Array.isArray(contenido) ? contenido : [];
}

export type ProductoResponseDto = ProductoApi;

export type PedidoAdminDto = {
  id: number;
  clienteId?: number;
  clienteNombre: string;
  clienteTelefono?: string;
  repartidorId?: number | null;
  repartidorNombre?: string | null;
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
  detalles?: PedidoDetalleApi[];
  createdAt?: string;
  updatedAt?: string;
};

export type VentaResponseDto = {
  id: number;
  clienteNombre?: string;
  fechaVenta: string;
  montoTotal: number;
  estadoVenta: "PENDIENTE" | "COMPLETADA" | "CANCELADA";
  metodoPago?: string;
};

export async function obtenerTodosLosProductos(): Promise<ProductoResponseDto[]> {
  return obtenerProductos();
}

export async function obtenerPedidosAdmin(): Promise<PedidoAdminDto[]> {
  const pedidos = await obtenerPedidos();

  return pedidos.map((pedido: any) => ({
    id: Number(pedido.id),
    clienteId: pedido.clienteId,
    clienteNombre: pedido.clienteNombre || "Cliente sin nombre",
    clienteTelefono: pedido.clienteTelefono,
    repartidorId: pedido.repartidorId ?? null,
    repartidorNombre: pedido.repartidorNombre ?? null,
    fechaHora:
      pedido.fechaHora ||
      pedido.fechaPedido ||
      pedido.createdAt ||
      pedido.updatedAt ||
      new Date().toISOString(),
    direccionEntrega: pedido.direccionEntrega || "Sin dirección",
    estado: pedido.estado || "PENDIENTE",
    total: Number(pedido.total || 0),
    detalles: pedido.detalles || [],
    createdAt: pedido.createdAt,
    updatedAt: pedido.updatedAt,
  }));
}

export async function obtenerVentas(): Promise<VentaResponseDto[]> {
  const respuesta = await fetch(`${API_URL}/v1/ventas`);

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudieron cargar las ventas"
    );
  }

  const lista = Array.isArray(contenido) ? contenido : [];

  return lista.map((venta: any) => ({
    id: Number(venta.id),
    clienteNombre: venta.clienteNombre || venta.cliente?.nombre || "Cliente sin nombre",
    fechaVenta:
      venta.fechaVenta ||
      venta.fechaHora ||
      venta.createdAt ||
      venta.updatedAt ||
      new Date().toISOString(),
    montoTotal: Number(venta.montoTotal || venta.total || 0),
    estadoVenta: venta.estadoVenta || venta.estado || "COMPLETADA",
    metodoPago: venta.metodoPago,
  }));
}

export type CrearProductoAdminDto = {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imageUrl?: string;
};

export async function crearProducto(data: CrearProductoAdminDto): Promise<ProductoResponseDto> {
  const respuesta = await fetch(`${API_URL}/v1/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const contenido = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(contenido?.mensaje || "No se pudo crear el producto");
  }

  return normalizarProducto(contenido);
}

export async function actualizarProducto(
  id: number,
  data: Partial<CrearProductoAdminDto>
): Promise<ProductoResponseDto> {
  const respuesta = await fetch(`${API_URL}/v1/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const contenido = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(contenido?.mensaje || "No se pudo actualizar el producto");
  }

  return normalizarProducto(contenido);
}

export async function eliminarProducto(id: number) {
  const respuesta = await fetch(`${API_URL}/v1/productos/${id}`, {
    method: "DELETE",
  });

  let contenido: any = null;

  try {
    contenido = await respuesta.json();
  } catch {
    contenido = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      contenido?.mensaje ||
        contenido?.message ||
        contenido?.error ||
        "No se pudo eliminar el producto"
    );
  }

  return contenido;
}