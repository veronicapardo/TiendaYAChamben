import "../../styles/cliente/pedidos-cliente.css";
import { useState, useEffect } from "react";
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { Logo } from "../../components/logo";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import { PedidoCard } from "../../components/cliente/PedidoCard";
import type { UsuarioLogueado } from "../../App";
import { cancelarPedido } from "../../services/api";
import type { Pedido } from "../../types/pedido";

type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (pagina: string) => void;
};

export function PedidosClientePage({ usuario, onNavigate }: Props) {
  const [filtro, setFiltro] = useState("TODOS");
  // CONEXIÓN BACKEND: Aquí guardaremos la lista de pedidos reales que devuelva el servidor
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(false);

  const [mensaje, setMensaje] = useState("");
const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error" | "">("");
  const cargarHistorialPedidos = async () => {
  try {
    setCargando(true);

   const limpiarTelefono = (valor: unknown) =>
  String(valor || "").replace(/\D/g, "");

const claveIds = `clientePedidosIds_${usuario.id}`;
const claveTelefonos = `clienteTelefonosPedidos_${usuario.id}`;

const idsGuardados = JSON.parse(
  localStorage.getItem(claveIds) || "[]"
) as number[];

const telefonosGuardados = JSON.parse(
  localStorage.getItem(claveTelefonos) || "[]"
) as string[];

const telefonoGuardado = localStorage.getItem("clienteTelefonoPedido");

const idsClienteActual = new Set(
  idsGuardados
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id))
);

const telefonosClienteActual = Array.from(
  new Set([
    ...telefonosGuardados.map(limpiarTelefono),
    limpiarTelefono(telefonoGuardado),
  ])
).filter((telefono) => telefono !== "");

const respuesta = await fetch("http://localhost:3000/v1/pedidos");
    if (!respuesta.ok) {
      throw new Error("Error al obtener pedidos");
    }

    const datos = await respuesta.json();
    const pedidosDelCliente = datos.filter((pedido: any) => {
  const pedidoId = Number(pedido.id);

  const pertenecePorId = idsClienteActual.has(pedidoId);

  const telefonoPedido = limpiarTelefono(
    pedido.clienteTelefono ||
      pedido.telefonoCliente ||
      pedido.cliente?.telefono ||
      ""
  );

  const pertenecePorTelefono =
    telefonoPedido !== "" && telefonosClienteActual.includes(telefonoPedido);

  const pertenecePorClienteId = Number(pedido.clienteId) === Number(usuario.id);

  return pertenecePorId || pertenecePorTelefono || pertenecePorClienteId;
});
    const pedidosMapeados = pedidosDelCliente
  .map((pedido: any) => ({
    id: pedido.id,
    fecha: pedido.fechaHora || pedido.createdAt || pedido.updatedAt || "Sin fecha",
    total: Number(pedido.total || 0),
    estado: pedido.estado,
    tipoEntrega:
      String(pedido.direccionEntrega || "").toLowerCase().includes("venta en tienda")
        ? "RECOJO"
        : "ENVIO",
  }))
  .sort((a: Pedido, b: Pedido) => {
    const fechaA = new Date(a.fecha).getTime();
    const fechaB = new Date(b.fecha).getTime();

    return fechaB - fechaA;
  });
    setPedidos(pedidosMapeados);
  } catch (error) {
    console.error("Error al traer el historial de pedidos:", error);
  } finally {
    setCargando(false);
  }
};
useEffect(() => {
  cargarHistorialPedidos();
}, [usuario.id]);

  const pedidosFiltrados = pedidos.filter((pedido) => {
  const estadoPedido = String(pedido.estado || "").toUpperCase();
  const tipoPedido = String(pedido.tipoEntrega || "").toUpperCase();

  if (filtro === "TODOS") {
    return true;
  }

  if (filtro === "ENVIO") {
    return tipoPedido === "ENVIO";
  }

  if (filtro === "RECOJO") {
    return tipoPedido === "RECOJO";
  }

  if (filtro === "CANCELADOS") {
    return estadoPedido === "CANCELADO" || estadoPedido === "ENTREGA_FALLIDA";
  }

  return true;
});

  async function manejarCancelarPedido(id: number) {
  try {
    setMensaje("");
    setTipoMensaje("");

    const pedido = pedidos.find((item) => item.id === id);

    if (!pedido) {
      setTipoMensaje("error");
      setMensaje("No se encontró el pedido seleccionado.");
      return;
    }

    if (pedido.estado !== "PENDIENTE") {
      setTipoMensaje("error");
      setMensaje("Solo puedes cancelar pedidos que todavía están pendientes.");
      return;
    }

    await cancelarPedido(id);

    setPedidos((actuales) =>
      actuales.map((item) =>
        item.id === id ? { ...item, estado: "CANCELADO" } : item
      )
    );

    setFiltro("CANCELADOS");
    setTipoMensaje("exito");
    setMensaje(`Pedido #${id} cancelado correctamente.`);
  } catch (error) {
    console.error(error);

    setTipoMensaje("error");

    if (error instanceof Error) {
      setMensaje(error.message);
    } else {
      setMensaje("No se pudo cancelar el pedido.");
    }
  }
}
  return (
    <main className="pedidos-cliente">
      <header className="cliente-header">
        <Logo width="260px" />
      </header>

      <PaginaActualC titulo="Mis Pedidos 🚚" />

      {mensaje && (
  <div className={`cliente-mensaje ${tipoMensaje}`}>
    {mensaje}
  </div>
)}

      <section className="pedidos-tabs">
        <button
          className={filtro === "TODOS" ? "activo" : ""}
          onClick={() => setFiltro("TODOS")}
        >
          Todos
        </button>

        <button
          className={filtro === "ENVIO" ? "activo" : ""}
          onClick={() => setFiltro("ENVIO")}
        >
          Envíos
        </button>

        <button
          className={filtro === "RECOJO" ? "activo" : ""}
          onClick={() => setFiltro("RECOJO")}
        >
          Recojo
        </button>

        <button
          className={filtro === "CANCELADOS" ? "activo" : ""}
          onClick={() => setFiltro("CANCELADOS")}
        >
          Cancelados
        </button>
      </section>

      <section className="pedidos-lista">
        {cargando && <p>Cargando tus pedidos...</p>}
        
        {!cargando && pedidos.length === 0 && (
  <p>No tienes pedidos aún</p>
)}

{!cargando && pedidos.length > 0 && pedidosFiltrados.length === 0 && (
  <p>No hay pedidos en este filtro.</p>
)}

{!cargando && pedidosFiltrados.map((pedido) => (
          <PedidoCard
  key={pedido.id}
  id={pedido.id}
  fecha={pedido.fecha}
  total={pedido.total}
  estado={pedido.estado}
  tipoEntrega={pedido.tipoEntrega}
  onCancelar={manejarCancelarPedido}
/>
        ))}
      </section>

      <NavbarCliente paginaActiva="pedidos" onNavigate={onNavigate} />
    </main>
  );
}