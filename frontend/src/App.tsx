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
import { BuscarProductoPage } from "./pages/cajero/BuscarProductoPage";
import { RegistrarPedidoPage } from "./pages/cajero/RegistrarPedidoPage";
import type { VistaCajero } from "./types/navigation";
import { PedidosPendientesPage } from "./pages/cajero/PedidosPendientesPage";
//cliente
import { ProductosClientePage } from "./pages/cliente/ProductosClientePage";
import { CarritoClientePage } from "./pages/cliente/CarritoClientePage";
import { CheckoutClientePage } from "./pages/cliente/CheckoutClientePage";
import { PedidosClientePage } from "./pages/cliente/PedidosClientePage";
import { PerfilClientePage } from "./pages/cliente/PerfilClientePage";
import { HomeClientePage } from "./pages/cliente/HomeClientePage";
import type { ItemCarrito } from "./types/carrito";
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
   //cliente
  const [vistaCliente, setVistaCliente] =useState("home");
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
function actualizarCantidadCarrito(
  producto: ItemCarrito,
  cambio: number
) {
  setCarrito((prev) => {
    const existente = prev.find((p) => p.id === producto.id);

    // SI NO EXISTE Y SE QUIERE AÑADIR
    if (!existente && cambio > 0) {
      return [
        ...prev,
        {
          ...producto,
          cantidad: 1,
        },
      ];
    }

    // SI YA EXISTE
    return prev
      .map((p) =>
        p.id === producto.id
          ? { ...p, cantidad: p.cantidad + cambio }
          : p
      )
      .filter((p) => p.cantidad > 0);
  });
}
   if (usuarioLogueado?.rol === "CLIENTE") {

  if (vistaCliente === "home") {
    return (
      <HomeClientePage
        onNavigate={setVistaCliente}
        carrito={carrito}
        onActualizarCantidad={actualizarCantidadCarrito}
      />
    );
  }

  if (vistaCliente === "productos") {
    return (
      <ProductosClientePage
        onNavigate={setVistaCliente}
        carrito={carrito}
        onActualizarCantidad={actualizarCantidadCarrito}
      />
    );
  }

  if (vistaCliente === "carrito") {
  return (
    <CarritoClientePage 
      onNavigate={setVistaCliente}
      carrito={carrito}
      onActualizarCantidad={(id, cambio) => {
        const producto = carrito.find((p) => p.id === id);
    
        if (producto) {
          actualizarCantidadCarrito(producto, cambio);
        }
      }}
      onEliminarProducto={(id) => {
        setCarrito((prev) => prev.filter((p) => p.id !== id));
      }}
    />
  );
}

  if (vistaCliente === "checkout") {
    return (
      <CheckoutClientePage onNavigate={setVistaCliente} />
    );
  }

  if (vistaCliente === "pedidos") {
    return (
      <PedidosClientePage onNavigate={setVistaCliente} />
    );
  }

  if (vistaCliente === "perfil") {
    return (
      <PerfilClientePage onNavigate={setVistaCliente} />
    );
  }

}
 //cajero

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