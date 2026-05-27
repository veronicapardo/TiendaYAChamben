import "../../styles/cliente/carrito-cliente.css";
import { useState } from "react";
import { Logo } from "../../components/logo";  
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import { SearchBar } from "../../components/cliente/SearchBar";
import { CarritoItem } from "../../components/cliente/CarritoItem";

type ItemCarrito = {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
};

type Props = {
  onNavigate: (pagina: string) => void;
  carrito?: ItemCarrito[];
  onActualizarCantidad?: (id: number, cambio: number) => void;
  onEliminarProducto?: (id: number) => void;
};

export function CarritoClientePage({ onNavigate, carrito = [], onActualizarCantidad, onEliminarProducto }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [metodoPago, setMetodoPago] = useState("");

  const productosEnCarrito = carrito.filter((p) => p.cantidad > 0);

  const total = productosEnCarrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const irAlFormularioCheckout = () => {
    if (!metodoPago) return;
    onNavigate("checkout");
  };

  return (
    <main className="carrito-cliente-page">
      <header className="cliente-header">
        <Logo width="260px" />
      </header>

      <PaginaActualC titulo="Carrito" />
      <SearchBar busqueda={busqueda} setBusqueda={setBusqueda} />

      <strong><span style={{ color: "#0a0a0a" }}>Tu Carrito:</span></strong>
      {productosEnCarrito.length === 0 && <p>Tu carrito está vacío</p>}

      <section className="productos-carrito">
        {productosEnCarrito
          .filter((producto) =>
            producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
          )
          .map((producto) => (
            <CarritoItem
              key={producto.id}
              nombre={producto.nombre}
              precio={producto.precio} 
              cantidad={producto.cantidad}
              imagen={producto.imagen}
              onAumentar={() => onActualizarCantidad?.(producto.id, 1)}
              onDisminuir={() => onActualizarCantidad?.(producto.id, -1)}
              onEliminar={() => onEliminarProducto?.(producto.id)}
            />
          ))}
      </section>    

      <strong style={{ display: "block", marginTop: "15px" }}>TOTAL: {total} bs</strong>
      <p><span style={{ color: "#787474ec", fontWeight: "lighter" }}>*no incluye envio</span></p>
      
      <p>Elija el metodo de pago antes del checkout:</p>
      
      <div className="metodos-pago">
        <label className="metodo-item">
          <input type="radio" name="metodoPago" value="EFECTIVO" checked={metodoPago === "EFECTIVO"} onChange={(e) => setMetodoPago(e.target.value)} />
          <span>Efectivo</span>
        </label>
        <label className="metodo-item">
          <input type="radio" name="metodoPago" value="QR" checked={metodoPago === "QR"} onChange={(e) => setMetodoPago(e.target.value)} />
          <span>QR</span>
        </label>
        <label className="metodo-item">
          <input type="radio" name="metodoPago" value="TARJETA" checked={metodoPago === "TARJETA"} onChange={(e) => setMetodoPago(e.target.value)} />
          <span>Tarjeta</span>
        </label>
      </div>
      
      <div className="checkout" style={{ marginTop: "20px" }}>
        <button 
          className="btn-checkout"
          disabled={!metodoPago || productosEnCarrito.length === 0}
          onClick={irAlFormularioCheckout}
        >
          Checkout
        </button>
      </div>

      <NavbarCliente paginaActiva="carrito" onNavigate={onNavigate} />
    </main> 
  ); 
}