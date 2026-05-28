import { useState } from "react";
import "./styles/global.css";
import "./styles/role-selection.css";
import "./styles/login.css";

import { RoleSelectionPage } from "./pages/RoleSelectionPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardCajeroPage } from "./pages/cajero/DashboardCajeroPage";
import { Dashboard_de_admin } from "./pages/admin/Dashboard_de_admin";
import { DashboardRepartidorPage } from "./pages/repartidor/DashboardRepartidorPage";
import { PedidosRepartidorPage } from "./pages/repartidor/PedidosRepartidorPage";
import { MapaRepartidorPage } from "./pages/repartidor/MapaRepartidorPage";
import { HistorialRepartidorPage } from "./pages/repartidor/HistorialRepartidorPage";

const DashboardRepartidorPageAny = DashboardRepartidorPage as any;
const PedidosRepartidorPageAny = PedidosRepartidorPage as any;
const MapaRepartidorPageAny = MapaRepartidorPage as any;
const HistorialRepartidorPageAny = HistorialRepartidorPage as any;

export type RolUsuario = "CLIENTE" | "CAJERO" | "REPARTIDOR" | "ADMINISTRADOR";

export type UsuarioLogueado = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

function App() {
  const [rolSeleccionado, setRolSeleccionado] = useState<RolUsuario | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<UsuarioLogueado | null>(null);
  const [vistaRepartidor, setVistaRepartidor] = useState<
  "dashboard" | "pedidos" | "mapa" | "historial"
>("dashboard");

  // Administrador
  if (usuarioLogueado?.rol === "ADMINISTRADOR" || usuarioLogueado?.rol === "DUENO") {
    return <Dashboard_de_admin usuario={usuarioLogueado} setUsuarioLogueado={setUsuarioLogueado} />;
  }

  // Cajero, Cliente y Repartidor usan el mismo dashboard (por ahora)
  if (usuarioLogueado?.rol === "CAJERO" || usuarioLogueado?.rol === "CLIENTE") {
    return <DashboardCajeroPage usuario={usuarioLogueado} />;
  }

 if (usuarioLogueado?.rol === "REPARTIDOR") {

  if (vistaRepartidor === "dashboard") {
    return (
      <DashboardRepartidorPageAny
        usuario={usuarioLogueado}
        cambiarVista={setVistaRepartidor}
      />
    );
  }

  if (vistaRepartidor === "pedidos") {
    return (
      <PedidosRepartidorPageAny
        usuario={usuarioLogueado}
        cambiarVista={setVistaRepartidor}
      />
    );
  }

  if (vistaRepartidor === "mapa") {
    return (
      <MapaRepartidorPageAny
        usuario={usuarioLogueado}
        cambiarVista={setVistaRepartidor}
      />
    );
  }

  if (vistaRepartidor === "historial") {
    return (
      <HistorialRepartidorPageAny
        usuario={usuarioLogueado}
        cambiarVista={setVistaRepartidor}
      />
    );
  }
}
  // Si no hay usuario logueado, mostrar selección de rol
  if (rolSeleccionado === null) {
    return <RoleSelectionPage onSeleccionarRol={setRolSeleccionado} />;
  }

  return (
    <LoginPage
      rol={rolSeleccionado}
      onVolver={() => setRolSeleccionado(null)}
      onLoginCorrecto={setUsuarioLogueado}
    />
  );
}

export default App;