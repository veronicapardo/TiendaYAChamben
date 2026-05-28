import "../../styles/cliente/pedidos-cliente.css";
import { useState, useEffect } from "react";
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { Logo } from "../../components/logo";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import { PedidoCard } from "../../components/cliente/PedidoCard";

import type { Pedido } from "../../types/pedido";

type Props = {
  onNavigate: (pagina: string) => void;
};

export function PedidosClientePage({ onNavigate }: Props) {
  const [filtro, setFiltro] = useState("TODOS");
  // CONEXIÓN BACKEND: Aquí guardaremos la lista de pedidos reales que devuelva el servidor
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarHistorialPedidos = async () => {
  try {
    setCargando(true);

    const respuesta = await fetch(
      "http://localhost:3000/v1/pedidos/cliente/1"
    );

    if (!respuesta.ok) {
      throw new Error("Error al obtener pedidos");
    }

    const datos = await respuesta.json();

    const pedidosMapeados = datos.map((pedido: any) => ({
      id: pedido.id,
      fecha: pedido.fechaHora,
      total: Number(pedido.total),
      estado: pedido.estado,
      tipoEntrega:
        pedido.direccionEntrega === "Venta en tienda"
          ? "RECOJO"
          : "ENVIO",
    }));

    setPedidos(pedidosMapeados);
  } catch (error) {
    console.error("Error al traer el historial de pedidos:", error);
  } finally {
    setCargando(false);
  }
};
useEffect(() => {
  cargarHistorialPedidos();
}, []);

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtro === "TODOS") {
      return true;
    }
    if (filtro === "ENVIO") {
      return pedido.tipoEntrega === "ENVIO";
    }
    if (filtro === "RECOJO") {
      return pedido.tipoEntrega === "RECOJO";
    }
    if (filtro === "CANCELADOS") {
      return pedido.estado === "CANCELADO";
    }
    return true;
  });

  return (
    <main className="pedidos-cliente">
      <header className="cliente-header">
        <Logo width="260px" />
      </header>

      <PaginaActualC titulo="Mis Pedidos 🚚" />

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

        {!cargando && pedidosFiltrados.map((pedido) => (
          <PedidoCard
            key={pedido.id}
            id={pedido.id}
            fecha={pedido.fecha}
            total={pedido.total}
            estado={pedido.estado}
            tipoEntrega={pedido.tipoEntrega}
          />
        ))}
      </section>

      <NavbarCliente paginaActiva="pedidos" onNavigate={onNavigate} />
    </main>
  );
}