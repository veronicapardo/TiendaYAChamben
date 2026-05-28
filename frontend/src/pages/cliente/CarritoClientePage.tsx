import "../../styles/cliente/carrito-cliente.css";
import { useState } from "react";
import { Logo } from "../../components/logo";  
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import { SearchBar } from "../../components/cliente/SearchBar";
import { CarritoItem } from "../../components/cliente/CarritoItem";
import type { ItemCarrito } from "../../types/carrito";
import { ProductoCard } from "../../components/cliente/ProductoCard";
import { useEffect } from "react";
type Props = {
  onNavigate: (pagina: string) => void;
  carrito?: ItemCarrito[];
  onActualizarCantidad?: (id: number, cambio: number) => void;
  onEliminarProducto?: (id: number) => void;
};

export function CarritoClientePage({ onNavigate, carrito = [], onActualizarCantidad, onEliminarProducto }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [productos, setProductos] = useState<any[]>([]);
  const productosEnCarrito = carrito.filter((p) => p.cantidad > 0);

  const total = productosEnCarrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  useEffect(() => {
  const obtenerProductos = async () => {
    try {
      const res = await fetch("http://localhost:3000/v1/productos");
      const data = await res.json();

      const productosMapeados = data.map((p: any) => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        imagen: p.imageUrl || "/decor/producto-default.jpg",
        disponible: p.stock > 0,
      }));

      setProductos(productosMapeados);
    } catch (error) {
      console.error(error);
    }
  };

  obtenerProductos();
}, []);
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
      <section className="sugerencias-carrito">
        <h3>También podría gustarte</h3>
      
        <div className="sugerencias-scroll">
          {productos.slice(0, 10).map((producto) => (
            <div className="producto-sugerido" key={producto.id}>
              <ProductoCard
                id={producto.id}
                nombre={producto.nombre}
                precio={producto.precio}
                imagen={producto.imagen}
                disponible={producto.disponible}
                cantidad={0}
                variante="horizontal"
                mostrarDisponibilidad={false}
                onAumentar={() => {}}
                onDisminuir={() => {}}
              />
            </div>
          ))}
        </div>
      </section>
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