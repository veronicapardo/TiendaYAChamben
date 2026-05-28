import type { UsuarioLogueado } from "../../App";
import "../../styles/estilos_repartidor/mapa.css";
import {
  LayoutDashboard,
  Truck,
  MapPinned,
  Clock,
  User,
} from "lucide-react";
type Props = {
  usuario: UsuarioLogueado;
  cambiarVista: (
    vista:
      | "dashboard"
      | "pedidos"
      | "mapa"
      | "historial"
  ) => void;
};

export function MapaRepartidorPage({ usuario, cambiarVista }: Props) {
  void usuario;

  return (
    <main className="repartidor-page">

      <header className="page-header">
        <div>
          <h1>Mapa de entregas 🗺️</h1>
          <p>Visualiza tu ruta y pedidos</p>
        </div>
      </header>
        <aside className="repartidor-sidebar">

      <div className="repartidor-logo">
        <span className="logo-text-small">tienda</span>
        <span className="logo-text-main">Ya!</span>
      </div>

      <nav className="repartidor-menu">

       <button
            className="menu-item"
            onClick={() => cambiarVista("dashboard")}
        >
        <LayoutDashboard size={22} />
        <span>Dashboard</span>
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
      <section className="mapa-container">

        <div className="mapa-placeholder">

          <h2>Mapa interactivo</h2>

          <p>
            Aquí podrás integrar:
          </p>

          <ul>
            <li>Google Maps</li>
            <li>Leaflet</li>
            <li>OpenStreetMap</li>
            <li>Rutas en tiempo real</li>
            <li>Seguimiento GPS</li>
          </ul>

        </div>

        <aside className="ruta-sidebar">

          <h3>Ruta actual</h3>

          <div className="ruta-item">
            <strong>Pedido #104</strong>
            <p>Zona Norte</p>
          </div>

          <div className="ruta-item">
            <strong>Pedido #108</strong>
            <p>Zona Central</p>
          </div>

          <div className="ruta-item">
            <strong>Pedido #111</strong>
            <p>Zona Sur</p>
          </div>

        </aside>

      </section>

    </main>
  );
}