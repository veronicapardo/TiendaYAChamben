import { useState } from "react";
import "../../styles/dashboardadmin.css";

import { DashboardView } from "./views/DashboardView";
import { StockPage } from "./views/StockPage";

interface DashboardDeAdminProps {
  usuario: any;
  setUsuarioLogueado: (usuario: any) => void;
}

export const Dashboard_de_admin = ({
  usuario,
  setUsuarioLogueado,
}: DashboardDeAdminProps) => {
  const [pestañaActual, setPestañaActual] = useState<
    "dashboard" | "stock"
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
            Dashboard
          </button>

          <button
            className={`menu-btn ${
              pestañaActual === "stock" ? "active" : ""
            }`}
            onClick={() => setPestañaActual("stock")}
          >
            Stock
          </button>

          <button className="menu-btn">
            Pedidos
          </button>

          <button className="menu-btn">
            Proveedores
          </button>

          <button className="menu-btn">
            Reportes
          </button>

          <button className="menu-btn">
            Configuración
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

      {/* CONTENIDO */}
      <main className="main-content">

        <header className="topbar">
          <h1>Dashboard</h1>
        </header>

        <section className="welcome-card">
          <h2>¡Bienvenido, Administrador! 👋</h2>
          <p>
            Aquí tienes el resumen de tu tienda del día de hoy.
          </p>
        </section>

        <section className="content-area">
          {pestañaActual === "dashboard" ? (
            <DashboardView />
          ) : (
            <StockPage />
          )}
        </section>

      </main>
    </div>
  );
};