import { useEffect, useState } from "react";
import type { UsuarioLogueado } from "../../App";
import "../../styles/estilos_repartidor/historial.css";

import {
  LayoutDashboard,
  Truck,
  Clock,
  Package,
  MapPin,
} from "lucide-react";

interface Props {
  usuario: UsuarioLogueado;
  cambiarVista: (vista: string) => void;
}

interface HistorialPedido {
  id: number;
  cliente: string;
  telefono: string;
  direccion: string;
  total: number;
  fecha: string;
  hora: string;
  estado: string;
}

export function HistorialRepartidorPage({
  usuario,
  cambiarVista,
}: Props) {

  const [historial, setHistorial] = useState<HistorialPedido[]>([]);

  useEffect(() => {
    cargarHistorial();
  }, []);

  async function cargarHistorial() {

    try {

      const res = await fetch(
        "http://localhost:3000/v1/pedidos"
      );

      const data = await res.json();

      const pedidos = data
        .filter(
          (p: any) =>
            p.repartidorId === usuario.id
        )
        .map((p: any) => ({
          id: p.id,
          cliente: p.clienteNombre,
          telefono: ["77723372"],
          direccion: p.direccionEntrega,
          total: p.total,
          fecha: "25/05/26",
          hora: "10:00AM",
          estado: p.estado,
        }));

      setHistorial(pedidos);

    } catch (error) {

      console.error(error);

    }
  }

  function obtenerEstadoClase(estado: string) {

    switch (estado) {

      case "ENTREGADO":
        return "entregado";

      case "EN_CAMINO":
        return "en_camino";

      default:
        return "pendiente";
    }
  }

  function obtenerEstadoTexto(estado: string) {

    switch (estado) {

      case "ENTREGADO":
        return "Pedido entregado";

      case "EN_CAMINO":
        return "En camino";

      default:
        return "En preparación";
    }
  }

  return (
    <main className="historial-page">

      {/* SIDEBAR */}
      <aside className="historial-sidebar">

        <div className="repartidor-logo">

          <span className="logo-text-small">
            tienda
          </span>

          <span className="logo-text-main">
            Ya!
          </span>

        </div>

        <nav className="historial-menu">

          <button
            className="menu-item"
            onClick={() => cambiarVista("dashboard")}
          >
            <LayoutDashboard size={20} />
            <span>Home</span>
          </button>

          <button
            className="menu-item"
            onClick={() => cambiarVista("pedidos")}
          >
            <Truck size={20} />
            <span>Pedidos Asignados</span>
          </button>

          <button
            className="menu-item active"
            onClick={() => cambiarVista("historial")}
          >
            <Clock size={20} />
            <span>Historial De Pedidos</span>
          </button>

        </nav>
        <div className="sidebar-user">
          👤 Repartidor
        </div>

      </aside>

      {/* CONTENIDO */}
      <section className="historial-content">

        <h1>
          Historial de pedidos
        </h1>

        <div className="historial-lista">

          {historial.map((pedido) => (

            <article
              className="historial-card"
              key={pedido.id}
            >

              {/* TOP */}
              <div className="historial-top">

                <div className="historial-left">

                  <div className="camion-icon">
                    <Truck size={36} />
                  </div>

                  <div className="historial-info">

                    <div className="historial-header">

                      <h2>
                        Pedido #{pedido.id}
                      </h2>

                      <span
                        className={`estado ${obtenerEstadoClase(
                          pedido.estado
                        )}`}
                      >
                        {obtenerEstadoTexto(
                          pedido.estado
                        )}
                      </span>

                    </div>

                    <p>
                      Cliente: {pedido.cliente}
                    </p>

                    <p>
                      Telefono: {pedido.telefono}
                    </p>

                  </div>

                </div>

                <div className="historial-hora">

                  <span>{pedido.hora}</span>

                  <span>{pedido.fecha}</span>

                </div>

              </div>

              {/* BOTTOM */}
              <div className="historial-bottom">

                <div className="historial-productos">

                  <Package size={36} />

                  <div>

                    <strong>
                      3 Productos
                    </strong>

                    <p>
                      Total: {pedido.total} Bs
                    </p>

                  </div>

                </div>

                <div className="historial-direccion">

                  <MapPin size={36} />

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