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

  useEffect(() => {
    /* CONEXIÓN BACKEND (Instrucciones para el desarrollador Backend):
       - MÉTODO HTTP: GET
       - ENDPOINT RECOMENDADO: /api/pedidos/mis-pedidos
       - DESCRIPCIÓN: Retorna el historial de compras del cliente actualmente autenticado (usando su Token/Sesión).
       - REGLA DE NEGOCIO: Cada objeto del arreglo devuelto debe incluir los campos id, fecha, total, estado, tipoEntrega
         y el sub-arreglo o string con el desglose de productos para la PedidoCard.
    */
    const cargarHistorialPedidos = async () => {
      try {
        setCargando(true);
        // const respuesta = await fetch("URL_DEL_BACKEND/api/pedidos/mis-pedidos");
        // const datos = await respuesta.json();
        // setPedidos(datos);
      } catch (error) {
        console.error("Error al traer el historial de pedidos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarHistorialPedidos();

    // MIENTRAS TANTO: datosfake
    setPedidos([
      {
        id: 1258,
        fecha: "2026-06-10",
        total: 120,
        estado: "PENDIENTE", // Puede mutar a "EN_CAMINO", "PREPARACION", "LISTO", "ENTREGADO", "CANCELADO"
        tipoEntrega: "ENVIO",
      },
      {
        id: 1268,
        fecha: "2026-06-10",
        total: 10,
        estado: "ENTREGADO",
        tipoEntrega: "RECOJO",
      },
      {
        id: 3,
        fecha: "2026-05-20",
        total: 60,
        estado: "ENTREGADO",
        tipoEntrega: "ENVIO",
      },
    ]);
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