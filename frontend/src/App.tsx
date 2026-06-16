import { useState } from "react";

import "./styles/global.css";
import "./styles/role-selection.css";
import "./styles/login.css";
import "./styles/dashboard-cajero.css";
import "./styles/buscar-producto.css";
import "./styles/nueva-venta.css";
import "./styles/registrar-pedido.css";
import "./styles/pedidos-pendientes.css";
import "./styles/clientes.css";
import "./styles/cierre-de-caja.css";
import "./styles/reportes.css";
import type { ItemCarrito } from "./types/carrito";

import { Dashboard_de_admin } from "./pages/admin/Dashboard_de_admin";
import { HomeClientePage } from "./pages/cliente/HomeClientePage";
import { ProductosClientePage } from "./pages/cliente/ProductosClientePage";
import { CarritoClientePage } from "./pages/cliente/CarritoClientePage";
import { CheckoutClientePage } from "./pages/cliente/CheckoutClientePage";
import { PedidosClientePage } from "./pages/cliente/PedidosClientePage";
import { PerfilClientePage } from "./pages/cliente/PerfilClientePage";

import "./styles/cliente/home-cliente.css";
import "./styles/cliente/ProductosClientePage.css";
import "./styles/cliente/carrito-cliente.css";
import "./styles/cliente/checkout-cliente.css";
import "./styles/cliente/pedidos-cliente.css";
import "./styles/cliente/perfil-cliente.css";
import "./styles/cliente/navbar-cliente.css";
import "./styles/cliente/producto-card.css";
import "./styles/cliente/carrito-item.css";
import "./styles/cliente/categoria.css";
import "./styles/cliente/searchbar.css";
import "./styles/cliente/pagina-actual.css";

import { DashboardRepartidorPage } from "./pages/repartidor/DashboardRepartidorPage";
import { PedidosRepartidorPage } from "./pages/repartidor/PedidosRepartidorPage";
import { HistorialRepartidorPage } from "./pages/repartidor/HistorialRepartidorPage";
import "./styles/dashboard-repartidor.css";
import "./styles/estilos_repartidor/pedidos.css";
import "./styles/estilos_repartidor/historial.css";

import { RoleSelectionPage } from "./pages/RoleSelectionPage";
import { LoginPage } from "./pages/LoginPage";

import { DashboardCajeroPage } from "./pages/cajero/DashboardCajeroPage";
import { NuevaVentaPage } from "./pages/cajero/NuevaVentaPage";
import { RegistrarPedidoPage } from "./pages/cajero/RegistrarPedidoPage";
import { BuscarProductoPage } from "./pages/cajero/BuscarProductoPage";
import { PedidosPendientesPage } from "./pages/cajero/PedidosPendientesPage";
import { ClientesPage } from "./pages/cajero/ClientesPage";
import { CierreDeCajaPage } from "./pages/cajero/CierreDeCajaPage";
import { ReportesPage } from "./pages/cajero/ReportesPage";

import type { VistaCajero } from "./types/navigation";

export type RolUsuario = "CLIENTE" | "CAJERO" | "REPARTIDOR" | "ADMINISTRADOR";

export type UsuarioLogueado = {
  id: number;
  nombre: string;
  email: string;
  rol: string;
};

type VistaRepartidor = "dashboard" | "pedidos" | "historial";
type VistaCliente = "home" | "productos" | "carrito" | "checkout" | "pedidos" | "perfil";
function App() {
  const [rolSeleccionado, setRolSeleccionado] = useState<RolUsuario | null>(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState<UsuarioLogueado | null>(null);
  const [vistaCajero, setVistaCajero] = useState<VistaCajero>("dashboard");
  const [vistaRepartidor, setVistaRepartidor] = useState<VistaRepartidor>("dashboard");

  const [vistaCliente, setVistaCliente] = useState<VistaCliente>("home");
  const [carritoCliente, setCarritoCliente] = useState<ItemCarrito[]>([]);

  function cambiarVistaRepartidor(vista: string) {
  if (vista === "dashboard" || vista === "pedidos" || vista === "historial") {
    setVistaRepartidor(vista);
  }
}

  function cerrarSesion() {
  setUsuarioLogueado(null);
  setRolSeleccionado(null);
  setVistaCajero("dashboard");
  setVistaRepartidor("dashboard");
  setVistaCliente("home");
}

function navegarCliente(pagina: string) {
  if (
    pagina === "home" ||
    pagina === "productos" ||
    pagina === "carrito" ||
    pagina === "checkout" ||
    pagina === "pedidos" ||
    pagina === "perfil"
  ) {
    setVistaCliente(pagina);
  }
}

function actualizarCantidadCliente(producto: ItemCarrito, cambio: number) {
  setCarritoCliente((actual) => {
    const existe = actual.find((item) => item.id === producto.id);

    if (!existe && cambio > 0) {
      return [...actual, { ...producto, cantidad: 1 }];
    }

    return actual
      .map((item) =>
        item.id === producto.id
          ? { ...item, cantidad: Math.max(0, item.cantidad + cambio) }
          : item
      )
      .filter((item) => item.cantidad > 0);
  });
}

function actualizarCantidadCarrito(id: number, cambio: number) {
  setCarritoCliente((actual) =>
    actual
      .map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.max(0, item.cantidad + cambio) }
          : item
      )
      .filter((item) => item.cantidad > 0)
  );
}

function eliminarProductoCarrito(id: number) {
  setCarritoCliente((actual) => actual.filter((item) => item.id !== id));
}

if (usuarioLogueado?.rol === "CLIENTE") {
  if (vistaCliente === "productos") {
    return (
      <ProductosClientePage
        onNavigate={navegarCliente}
        carrito={carritoCliente}
        onActualizarCantidad={actualizarCantidadCliente}
      />
    );
  }

  if (vistaCliente === "carrito") {
    return (
      <CarritoClientePage
        onNavigate={navegarCliente}
        carrito={carritoCliente}
        onActualizarCantidad={actualizarCantidadCarrito}
        onEliminarProducto={eliminarProductoCarrito}
      />
    );
  }

  if (vistaCliente === "checkout") {
  return (
    <CheckoutClientePage
      usuario={usuarioLogueado}
      onNavigate={navegarCliente}
      carrito={carritoCliente}
    />
  );
}

  if (vistaCliente === "pedidos") {
  return (
    <PedidosClientePage
      usuario={usuarioLogueado}
      onNavigate={navegarCliente}
    />
  );
}
  if (vistaCliente === "perfil") {
    return <PerfilClientePage onNavigate={navegarCliente} />;
  }

  return (
    <HomeClientePage
      onNavigate={navegarCliente}
      carrito={carritoCliente}
      onActualizarCantidad={actualizarCantidadCliente}
    />
  );
}
  if (usuarioLogueado?.rol === "REPARTIDOR") {
    if (vistaRepartidor === "pedidos") {
      return (
        <PedidosRepartidorPage
  usuario={usuarioLogueado}
  cambiarVista={cambiarVistaRepartidor}
  onLogout={cerrarSesion}
/>
      );
    }

    if (vistaRepartidor === "historial") {
      return (
       <HistorialRepartidorPage
  usuario={usuarioLogueado}
  cambiarVista={cambiarVistaRepartidor}
  onLogout={cerrarSesion}
/>
      );
    }

    return (
      <DashboardRepartidorPage
  usuario={usuarioLogueado}
  cambiarVista={cambiarVistaRepartidor}
  onLogout={cerrarSesion}
/>
    );
  }
  
  if (
  usuarioLogueado?.rol === "ADMINISTRADOR" ||
  usuarioLogueado?.rol === "DUENO"
) {
  return (
    <Dashboard_de_admin
      usuario={usuarioLogueado}
      setUsuarioLogueado={() => cerrarSesion()}
    />
  );
}


  

  if (usuarioLogueado?.rol === "CAJERO") {
    if (vistaCajero === "nueva-venta") {
      return (
        <NuevaVentaPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "registrar-pedido") {
      return (
        <RegistrarPedidoPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "pedidos-pendientes") {
      return (
        <PedidosPendientesPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "buscar-producto") {
      return (
        <BuscarProductoPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "clientes") {
      return (
        <ClientesPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "cierre-caja") {
      return (
        <CierreDeCajaPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    if (vistaCajero === "reportes") {
      return (
        <ReportesPage
          usuario={usuarioLogueado}
          onNavigate={setVistaCajero}
          onLogout={cerrarSesion}
        />
      );
    }

    return (
      <DashboardCajeroPage
        usuario={usuarioLogueado}
        onNavigate={setVistaCajero}
        onLogout={cerrarSesion}
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
