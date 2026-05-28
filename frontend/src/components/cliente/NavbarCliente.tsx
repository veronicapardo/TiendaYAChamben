import "../../styles/cliente/navbar-cliente.css";

import {
  Home,
  ShoppingBag,
  ShoppingCart,
  ClipboardList,
  User,
} from "lucide-react";

type Props = {
  paginaActiva: string;
  onNavigate: (pagina: string) => void;
};

export function NavbarCliente({
  paginaActiva,
  onNavigate,
}: Props) {

  return (
    <nav className="navbar-cliente">

      <button
        className={paginaActiva === "home" ? "activo" : ""}
        onClick={() => onNavigate("home")}
      >
        <Home size={22} />
        <span>Home</span>
      </button>

      <button
        className={paginaActiva === "productos" ? "activo" : ""}
        onClick={() => onNavigate("productos")}
      >
        <ShoppingBag size={22} />
        <span>Productos</span>
      </button>

      <button
        className={paginaActiva === "carrito" ? "activo" : ""}
        onClick={() => onNavigate("carrito")}
      >
        <ShoppingCart size={22} />
        <span>Carrito</span>
      </button>

      <button
        className={paginaActiva === "pedidos" ? "activo" : ""}
        onClick={() => onNavigate("pedidos")}
      >
        <ClipboardList size={22} />
        <span>Mis pedidos</span>
      </button>

      <button
        className={paginaActiva === "perfil" ? "activo" : ""}
        onClick={() => onNavigate("perfil")}
      >
        <User size={22} />
        <span>Perfil</span>
      </button>

    </nav>
  );
}