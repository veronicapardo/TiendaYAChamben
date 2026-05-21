import { useState } from "react";
import "./styles/global.css";
import "./styles/role-selection.css";
import "./styles/login.css";

import { RoleSelectionPage } from "./pages/RoleSelectionPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardCajeroPage } from "./pages/cajero/DashboardCajeroPage";
import { Dashboard_de_admin } from "./pages/admin/Dashboard_de_admin"; 

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

  if (usuarioLogueado?.rol === "ADMINISTRADOR" || usuarioLogueado?.rol === "DUENO" ) {
    return <Dashboard_de_admin usuario={usuarioLogueado} setUsuarioLogueado={setUsuarioLogueado} />;
  }

  if (usuarioLogueado?.rol === "CAJERO") {
    return <DashboardCajeroPage usuario={usuarioLogueado} />;
  }

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