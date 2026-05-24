import { useState } from "react";

import "../../styles/dashboardadmin.css";

import { DashboardView } from "./views/DashboardView";
import { StockPage } from "./views/StockPage";
import { PedidosPage } from "./views/PedidosPage";
import { ProveedoresPage } from "./views/ProveedoresPage";
import { ReportesPage } from "./views/ReportesPage";

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

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo-container">
          <h2 className="logo-text">TiendaYa</h2>
        </div>

        <nav className="menu">

          <button
            className={`menu-btn ${
              pestañaActual === "dashboard" ? "active" : ""
            }`}
            onClick={() => setPestañaActual("dashboard")}
          >
            Panel
          </button>

          <button
            className={`menu-btn ${
              pestañaActual === "stock" ? "active" : ""
            }`}
            onClick={() => setPestañaActual("stock")}
          >
            Existencias
          </button>

          <button
            className={`menu-btn ${
              pestañaActual === "pedidos" ? "active" : ""
            }`}
            onClick={() => setPestañaActual("pedidos")}
          >
            Pedidos recientes
          </button>

          <button
            className={`menu-btn ${
              pestañaActual === "proveedores" ? "active" : ""
            }`}
            onClick={() => setPestañaActual("proveedores")}
          >
            Proveedores
          </button>

          <button
            className={`menu-btn ${
              pestañaActual === "reportes" ? "active" : ""
            }`}
            onClick={() => setPestañaActual("reportes")}
          >
            Informes
          </button>

        </nav>

        <div className="admin-user">

          <span>{usuario.nombre}</span>

          <button
            className="logout-btn"
            onClick={() => setUsuarioLogueado(null)}
          >
            Salir
          </button>

        </div>

      </aside>

      <main className="main-content">

        <header className="topbar">

          <h1>

            {pestañaActual === "dashboard" && "Panel"}
            {pestañaActual === "stock" && "Existencias"}
            {pestañaActual === "pedidos" && "Pedidos recientes"}
            {pestañaActual === "proveedores" && "Proveedores"}
            {pestañaActual === "reportes" && "Informes"}

          </h1>

        </header>

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