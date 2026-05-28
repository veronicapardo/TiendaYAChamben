// frontend/src/pages/repartidor/DashboardRepartidorPage.tsx
import { useState, useEffect } from "react";
import type { UsuarioLogueado } from "../../App";
import * as api from "../../services/api";
import "../../styles/dashboard-repartidor.css"; // lo crearemos luego

import {
  LayoutDashboard,
  Truck,
  MapPinned,
  Clock,
  User,
} from "lucide-react";
import { obtenerRepartidorId }from "../../services/Repartidor.ts";
type Props = {
  usuario: UsuarioLogueado;

  cambiarVista: (vista: "dashboard" | "pedidos" | "mapa" | "historial") => void;
};
interface Pedido {
  id: number;
  cliente: string;
  direccion: string;
  estado: "pendiente" | "en_camino" | "entregado";
  total: number;
}

export function DashboardRepartidorPage({ usuario, cambiarVista }: Props) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {
    try {
      setCargando(true);
      // Ejemplo de llamada a API – ajusta según tu backend
      const repartidorId =
  obtenerRepartidorId(usuario.id);

const data =
  await api.obtenerPedidosAsignados(
    repartidorId
  );
      // El backend puede devolver estados en mayúsculas o con nombres diferentes.
      // Normalizamos a los valores esperados por este componente.
      const normalizados: Pedido[] = (data as any[]).map(d => {
        const estadoRaw: string = (d.estado || "").toString();
        let estado: Pedido["estado"] = "pendiente";
        switch (estadoRaw.toLowerCase()) {
          case "pendiente":
          case "pendiente".toLowerCase():
          case "pendiente".toUpperCase():
          case "pendiente":
            estado = "pendiente";
            break;
          case "en_camino":
          case "en camino":
          case "en_camino".toLowerCase():
          case "en_camino".toUpperCase():
          case "en camino".toUpperCase():
            estado = "en_camino";
            break;
          case "entregado":
          case "entregado".toUpperCase():
            estado = "entregado";
            break;
          // soportar valores en mayúsculas como PENDIENTE, EN_CAMINO, ENTREGADO
          case "pendiente":
          default:
            // manejar posibles valores en mayúsculas como PENDIENTE
            if (estadoRaw.toUpperCase() === "PENDIENTE") estado = "pendiente";
            else if (estadoRaw.toUpperCase() === "EN_CAMINO" || estadoRaw.toUpperCase() === "EN CAMINO") estado = "en_camino";
            else if (estadoRaw.toUpperCase() === "ENTREGADO") estado = "entregado";
            else estado = "pendiente";
        }

        return {
          id: d.id,

        cliente:
            d.clienteNombre ||
            d.cliente ||
            "Cliente",

          direccion:
            d.direccionEntrega ||
            d.direccion ||
            "Sin dirección",

          total: Number(d.total) || 0,

        estado,
        } as Pedido;
      });

      setPedidos(normalizados);
    } catch (err) {
      setError("No se pudieron cargar los pedidos");
      console.error(err);
    } finally {
      setCargando(false);
    }
  }

  async function cambiarEstado(pedidoId: number, nuevoEstado: Pedido["estado"]) {
    try {
      const nuevoEstadoApi =
        nuevoEstado === "pendiente"
          ? "PENDIENTE"
          : nuevoEstado === "en_camino"
          ? "EN_CAMINO"
          : "ENTREGADO";

      await api.actualizarEstadoPedido(
        pedidoId,
        nuevoEstadoApi as Parameters<typeof api.actualizarEstadoPedido>[1]
      );

      // Actualizar localmente
      setPedidos(prev =>
        prev.map(p => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
      );
    } catch (err) {
      console.error("Error al actualizar estado", err);
    }
  }

  if (cargando) return <div className="loading">Cargando pedidos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
  <main className="repartidor-dashboard">

    <aside className="repartidor-sidebar">

      <div className="repartidor-logo">
        <span className="logo-text-small">tienda</span>
        <span className="logo-text-main">Ya!</span>
      </div>

      <nav className="repartidor-menu">
        <button
            className="sidebar-item"
            onClick={() =>
              cambiarVista("dashboard")
            }
          >
            <LayoutDashboard size={20} />
            <span>Home</span>
          </button>
        <button
            className="menu-item"
            onClick={() => cambiarVista("pedidos")}
        >
        <Truck size={22} />
        <span>Pedidos</span>
        </button>


        <button
            className="menu-item"
            onClick={() => cambiarVista("historial")}
        >
          <Clock size={22} />
          <span>Historial</span>
        </button>

      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-icon">
          <User size={20} />
        </div>

        <div>
          <strong>{usuario.nombre}</strong>
          <p>Repartidor</p>
        </div>
      </div>

    </aside>

    <section className="repartidor-content">

      <header className="dashboard-header">

        <div>
          <h1>Hola, {usuario.nombre} 🚚</h1>
          <p>Gestiona tus entregas asignadas.</p>
        </div>

        <div className="online-badge">
          <span></span>
          Online
        </div>

      </header>

      <section className="resumen-cards">

        <div className="resumen-card">
          <h3>{pedidos.length}</h3>
          <p>Pedidos asignados</p>
        </div>

        <div className="resumen-card">
          <h3>
            {pedidos.filter(p => p.estado === "en_camino").length}
          </h3>
          <p>En camino</p>
        </div>

        <div className="resumen-card">
          <h3>
            {pedidos.filter(p => p.estado === "entregado").length}
          </h3>
          <p>Entregados</p>
        </div>

      </section>

      <section className="pedidos-panel">

        <div className="panel-header">
          <h2>Pedidos asignados</h2>
        </div>

        {pedidos.length === 0 ? (
          <p className="empty-text">
            No hay pedidos asignados.
          </p>
        ) : (
          pedidos.map(pedido => (
            <article
              key={pedido.id}
              className="pedido-item"
            >

              <div className={`pedido-status ${pedido.estado}`}>
                <Truck size={22} />
              </div>

              <div className="pedido-info">
                <strong>Pedido #{pedido.id}</strong>
                <p>{pedido.cliente}</p>
                <small>{pedido.direccion}</small>
              </div>

              <div className="pedido-extra">
                <strong>
                  S/ {pedido.total.toFixed(2)}
                </strong>

                <span className={`estado-tag ${pedido.estado}`}>
                  {pedido.estado}
                </span>
              </div>

              <div className="pedido-actions">

                {pedido.estado === "pendiente" && (
                  <button
                    className="btn-primary"
                    onClick={() =>
                      cambiarEstado(pedido.id, "en_camino")
                    }
                  >
                    Iniciar entrega
                  </button>
                )}

                {pedido.estado === "en_camino" && (
                  <button
                    className="btn-success"
                    onClick={() =>
                      cambiarEstado(pedido.id, "entregado")
                    }
                  >
                    Entregado
                  </button>
                )}

                {pedido.estado === "entregado" && (
                  <span className="entregado-label">
                    ✓ Entregado
                  </span>
                )}

              </div>

            </article>
          ))
        )}

      </section>

    </section>

  </main>
);
}