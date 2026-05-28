import "../../styles/cliente/checkout-cliente.css";

import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { Logo } from "../../components/logo";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import { useState } from "react";

import type { ItemCarrito } from "../../types/carrito";

type Props = {
  onNavigate: (pagina: string) => void;
  carrito: ItemCarrito[];
};

export function CheckoutClientePage({onNavigate,carrito}: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nit, setNit] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<"ENVIO" | "RECOJO">("ENVIO");
  const [autocompletar, setAutocompletar] = useState(false);

  const total = carrito.reduce(
  (acc, item) => acc + item.precio * item.cantidad,
  0
  );
  const totalEnvio = tipoEntrega === "ENVIO" ? 10 : 0;
  const totalFinal = total + totalEnvio;

  const productosPedido = carrito.map((item) => ({
  productoId: item.id,
  cantidad: item.cantidad,
  precioUnitario: item.precio,
  totalProducto: item.precio * item.cantidad,
  })); 
  async function finalizarPedido() {
  try {
    const body = {
      clienteId: 1,
      direccionEntrega:
        tipoEntrega === "RECOJO"
          ? "Venta en tienda"
          : direccion,
      productos: productosPedido,
    };

    const response = await fetch(
      "http://localhost:3000/v1/pedidos",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.mensaje ||
        "No se pudo registrar el pedido"
      );
    }

    const pedidoCreado = await response.json();

    console.log("Pedido creado:", pedidoCreado);

    alert("Pedido realizado correctamente");

    onNavigate("pedidos");
  } catch (error: any) {
    console.error(error);

    alert(
      error.message ||
      "Error al crear pedido"
    );
  }
}

  function cancelarPedido() {
    setNombre("");
    setApellido("");
    setDireccion("");
    setEmail("");
    setTelefono("");
    setNit("");
    setIndicaciones("");
    setTipoEntrega("ENVIO");
    setAutocompletar(false);
  }

  return (
    <main className="checkout-cliente-page">
      <header className="cliente-header">
        <Logo width="260px" />
      </header>

      <PaginaActualC titulo="Checkout ✅" />
      
      <strong>
        <span style={{ fontWeight: "bold" }}>Datos para el pedido:</span>
      </strong> 

      <form className="checkout-form">
        <label>Nombre</label>
        <input
          type="text"
          placeholder="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
       
        <label>Apellido</label>
        <input
          type="text"
          placeholder="apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
       
        {/* ENTREGA */}
        <label>Tipo de entrega</label>
        <div className="tipo-entrega">
          <label>
            <input
              type="radio"
              name="tipoEntrega"
              value="ENVIO"
              checked={tipoEntrega === "ENVIO"}
              onChange={(e) => setTipoEntrega(e.target.value as "ENVIO" | "RECOJO")}
            />
            Envío
          </label>

          <label>
            <input
              type="radio"
              name="tipoEntrega"
              value="RECOJO"
              checked={tipoEntrega === "RECOJO"}
              onChange={(e) => setTipoEntrega(e.target.value as "ENVIO" | "RECOJO")}
            />
            Recoger en tienda
          </label>
        </div>
       
        <label>Dirección de envío</label>
        <input
          type="text"
          placeholder="dirección"
          value={tipoEntrega === "RECOJO" ? "Venta en tienda" : direccion}
          disabled={tipoEntrega === "RECOJO"}
          onChange={(e) => setDireccion(e.target.value)}
        />
       
        <label>Email</label>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
       
        <label>Teléfono</label>
        <input
          type="text"
          placeholder="teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
       
        <label>NIT</label>
        <input
          type="text"
          placeholder="NIT"
          value={nit}
          onChange={(e) => setNit(e.target.value)}
        />
       
        <label>Indicaciones adicionales</label>
        <textarea
          placeholder="*opcional"
          rows={4}
          value={indicaciones}
          onChange={(e) => setIndicaciones(e.target.value)}
        />
      </form>

      <label className="autocompletar">
        <input
          type="checkbox"
          checked={autocompletar}
          onChange={(e) => setAutocompletar(e.target.checked)}
        />
        <span>Guardar datos para futuras compras</span>
      </label>
            
      <section className="resumen-checkout">
        <p>Subtotal: Bs. {total}</p>
        <p>Envío: Bs. {totalEnvio}</p>
        <hr />
        <strong>Total Final: Bs. {totalFinal}</strong>
      </section>
    
      <div className="checkout-botones">
        <button
          type="button"
          className="btn-cancelar"
          onClick={cancelarPedido}
          >Cancelar
        </button>

        <button
          type="button"
          className="btn-finalizar"
          disabled={
              !nombre ||
              !apellido ||
              !telefono ||
              !email ||
              (tipoEntrega === "ENVIO" && !direccion)
          }
          onClick={finalizarPedido}
          >
          Finalizar Pedido
        </button>
      </div>
    
      <NavbarCliente paginaActiva="Carrito" onNavigate={onNavigate} />
    </main>
  );
}
      