import { useState } from "react";

import "../../styles/dashboardadmin.css";

import { DashboardView } from "./views/DashboardView";
import { StockPage } from "./views/StockPage";
import { PedidosPage } from "./views/PedidosPage";
import { ProveedoresPage } from "./views/ProveedoresPage";
import { ReportesPage } from "./views/ReportesPage";

import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

interface DashboardDeAdminProps {
  usuario: any;
  setUsuarioLogueado: (usuario: any) => void;
}

export const Dashboard_de_admin = ({
  usuario,
  setUsuarioLogueado,
}: DashboardDeAdminProps) => {

  const [pestañaActual, setPestañaActual] = useState<
    "dashboard" |
    "stock" |
    "pedidos" |
    "proveedores" |
    "reportes"
  >("dashboard");

  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="admin-layout">

      <aside className="sidebar">

        <div className="logo-container">

          <img
            src="/logo.svg"
            alt="Logo TiendaYa"
            className="logo-img"
          />

        </div>

        <nav className="menu">

          <button
            className={`menu-btn ${
              pestañaActual === "dashboard" ? "active" : ""
            }`}
            onClick={() => setPestañaActual("dashboard")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button
            className={`menu-btn ${
              pestañaActual === "stock" ? "active" : ""
            }`}
            onClick={() => setPestañaActual("stock")}
          >
            <Package size={20} />
            <span>Stock</span>
          </button>

          <button
            className={`menu-btn ${
              pestañaActual === "pedidos" ? "active" : ""
            }`}
            onClick={() => setPestañaActual("pedidos")}
          >
            <ClipboardList size={20} />
            <span>Pedidos recientes</span>
          </button>

          <button
            className={`menu-btn ${
              pestañaActual === "proveedores" ? "active" : ""
            }`}
            onClick={() => setPestañaActual("proveedores")}
          >
            <Users size={20} />
            <span>Proveedores</span>
          </button>

          <button
            className={`menu-btn ${
              pestañaActual === "reportes" ? "active" : ""
            }`}
            onClick={() => setPestañaActual("reportes")}
          >
            <BarChart3 size={20} />
            <span>Reportes</span>
          </button>

          <button className="menu-btn">
            <Settings size={20} />
            <span>Configuración</span>
          </button>

        </nav>

        <div className="admin-user-modern">

          <button
            className="admin-dropdown"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >

            <div className="admin-left">

              <div className="admin-circle">
                A
              </div>

              <span>Administrador</span>

            </div>

            <span>▼</span>

          </button>

          {menuAbierto && (

            <div className="dropdown-menu">

              <button>
                Perfil
              </button>

              <button>
                Configuración
              </button>

              <button
                className="logout-item"
                onClick={() => setUsuarioLogueado(null)}
              >
                Cerrar sesión
              </button>

            </div>

          )}

        </div>

      </aside>

      <main className="main-content">

        <section className="content-area">

          {pestañaActual === "dashboard" && <DashboardView />}

          {pestañaActual === "stock" && <StockPage />}

          {pestañaActual === "pedidos" && <PedidosPage />}

          {pestañaActual === "proveedores" && <ProveedoresPage />}

          {pestañaActual === "reportes" && <ReportesPage />}

        </section>

      </main>

    </div>
  );
};