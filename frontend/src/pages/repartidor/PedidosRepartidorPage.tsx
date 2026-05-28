import { useEffect, useState } from "react";
import type { UsuarioLogueado } from "../../App";
import * as api from "../../services/api";
import "../../styles/estilos_repartidor/pedidos.css";

import {
  LayoutDashboard,
  Truck,
  Clock,
  Package,
  MapPin,
} from "lucide-react";

interface Pedido {
  id: number;
  cliente: string;
  estado: "pendiente" | "en_camino" | "entregado";
  total: number;
  direccion: string;
}

interface Props {
  usuario: UsuarioLogueado;
  cambiarVista: (vista: string) => void;
}

export function PedidosRepartidorPage({
  usuario,
  cambiarVista,
}: Props) {

  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function cargarPedidos() {

    try {

      const data = await api.obtenerPedidosAsignados(
        usuario.id
      );

      const pedidosMapeados: Pedido[] =
        (data as any[]).map((p) => ({

          id: p.id,

          cliente:
            p.clienteNombre ||
            "Cliente",

          direccion:
            p.direccionEntrega ||
            "Sin dirección",

          total:
            Number(p.total) || 0,

          estado:
            p.estado === "PENDIENTE" ||
            p.estado === "EN_PREPARACION"
              ? "pendiente"
              : p.estado === "EN_CAMINO"
              ? "en_camino"
              : "entregado",

        }));

      setPedidos(pedidosMapeados);

    } catch (error) {

      console.error(
        "Error cargando pedidos:",
        error
      );
    }
  }

  return (

    <main className="historials-page">

      {/* SIDEBAR */}
      <aside className="historials-sidebar">

        <div className="repartidor-logo">

          <span className="logo-text-small">
            tienda
          </span>

          <span className="logo-text-main">
            Ya!
          </span>

        </div>

        <nav className="sidebar-menu">

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
            className="sidebar-item active"
            onClick={() =>
              cambiarVista("pedidos")
            }
          >
            <Truck size={20} />
            <span>
              Pedidos Asignados
            </span>
          </button>

          <button
            className="sidebar-item"
            onClick={() =>
              cambiarVista("historial")
            }
          >
            <Clock size={20} />
            <span>
              Historial de Pedidos
            </span>
          </button>

        </nav>

        <div className="sidebar-user">
          👤 Repartidor
        </div>

      </aside>

      {/* CONTENIDO */}
      <section className="historials-content">

        <h1>
          PEDIDOS ASIGNADOS
        </h1>

        <div className="historials-lista">

          {pedidos.map((pedido) => (

            <article
              className="historial-card"
              key={pedido.id}
            >

              {/* TOP */}
              <div className="historial-top">

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >

                  <div className="historial-icon">
                    <Truck size={34} />
                  </div>

                  <div className="historial-main">

                    <div className="historial-header">

                      <div>

                        <h2>
                          Pedido #
                          {pedido.id}
                        </h2>

                        <p>
                          Cliente:{" "}
                          {pedido.cliente}
                        </p>

                        <p>
                          Teléfono: 77723372
                        </p>

                      </div>

                      <span
                        className={`estado ${pedido.estado}`}
                      >

                        {pedido.estado ===
                          "pendiente" &&
                          "En preparación"}

                        {pedido.estado ===
                          "en_camino" &&
                          "En camino"}

                        {pedido.estado ===
                          "entregado" &&
                          "Pedido entregado"}

                      </span>

                    </div>

                  </div>

                </div>

                <div className="historial-hora">

                  <span>
                    10:00AM
                  </span>

                  <span>
                    25/05/26
                  </span>

                </div>

              </div>

              {/* BOTTOM */}
              <div className="historial-bottom">

                <div className="historial-extra">

                  <Package size={34} />

                  <div>
                    <strong>
                      3 Productos
                    </strong>

                    <p>
                      Total:
                      {" "}
                      Bs{" "}
                      {pedido.total.toFixed(2)}
                    </p>
                  </div>

                </div>

                <div className="historial-extra">

                  <MapPin size={34} />

                  <div>
                    <strong>
                      Dirección:
                    </strong>

                    <p>
                      {pedido.direccion}
                    </p>
                  </div>

                </div>

              </div>

            </article>

          ))}

        </div>

      </section>

    </main>
  );
}