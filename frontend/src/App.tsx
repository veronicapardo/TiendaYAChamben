import { useState } from "react";
import "./styles/global.css";
import "./styles/role-selection.css";
import "./styles/login.css";
import "./styles/dashboard-cajero.css";
import "./styles/buscar-producto.css";

import { NuevaVentaPage } from "./pages/cajero/NuevaVentaPage";
import { RoleSelectionPage } from "./pages/RoleSelectionPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardCajeroPage } from "./pages/cajero/DashboardCajeroPage";
import { Dashboard_de_admin } from "./pages/admin/Dashboard_de_admin";
import { BuscarProductoPage } from "./pages/cajero/BuscarProductoPage";
import { RegistrarPedidoPage } from "./pages/cajero/RegistrarPedidoPage";
import type { VistaCajero } from "./types/navigation";
import { PedidosPendientesPage } from "./pages/cajero/PedidosPendientesPage";
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
  const [vistaCajero, setVistaCajero] = useState<VistaCajero>("dashboard");

  if (usuarioLogueado?.rol === "ADMINISTRADOR" || usuarioLogueado?.rol === "DUENO" ) {
    return <Dashboard_de_admin usuario={usuarioLogueado} setUsuarioLogueado={setUsuarioLogueado} />;
  }

  if (usuarioLogueado?.rol === "CAJERO") {
    if (vistaCajero === "nueva-venta") {
  return (
    <NuevaVentaPage
      usuario={usuarioLogueado}
      onNavigate={setVistaCajero}
    />
  );
}
if (vistaCajero === "registrar-pedido") {
  return (
    <RegistrarPedidoPage
      usuario={usuarioLogueado}
      onNavigate={setVistaCajero}
    />
  );
}

if (vistaCajero === "pedidos-pendientes") {
  return (
    <PedidosPendientesPage
      usuario={usuarioLogueado}
      onNavigate={setVistaCajero}
    />
  );
}

    if (vistaCajero === "buscar-producto") {
      return (
        <BuscarProductoPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
        />
      );
    }

    return (
      <DashboardCajeroPage
        usuario={usuarioLogueado}
        onNavigate={setVistaCajero}
      />
    );
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

export async function cancelarPedido(id: number) {
  const respuesta = await fetch(`http://localhost:3000/v1/pedidos/${id}`, {
    method: "DELETE",
  });

  let resultado: any = null;

  try {
    resultado = await respuesta.json();
  } catch {
    resultado = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      resultado?.mensaje ||
        resultado?.message ||
        resultado?.error ||
        "No se pudo cancelar el pedido"
    );
  }

  return resultado;
}