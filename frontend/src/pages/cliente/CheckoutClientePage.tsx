import "../../styles/cliente/checkout-cliente.css";

import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { Logo } from "../../components/logo";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import { useState } from "react";

type Props = {
  onNavigate: (pagina: string) => void;
};

export function CheckoutClientePage({ onNavigate }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nit, setNit] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<"ENVIO" | "RECOJO">("ENVIO");
  const [autocompletar, setAutocompletar] = useState(false);

  const total = 48;
  const totalEnvio = tipoEntrega === "ENVIO" ? 10 : 0;
  const totalFinal = total + totalEnvio;

  function finalizarPedido() {
    // tipoEntrega se calcula desde direccion para cliente.
    // Si direccion === "TIENDA" => RECOJO
    // Caso contrario => ENVIO
    const pedido = {
      nombre,
      apellido,
      direccion: tipoEntrega === "RECOJO" ? "Venta en tienda" : direccion,
      email,
      telefono,
      nit,
      indicaciones,
      tipoEntrega,
      autocompletar,
      subtotal: total,
      envio: totalEnvio,
      totalFinal,
    };

    console.log("Pedido enviado:");
    console.log(pedido);

    /*  CONEXIÓN BACKEND (Instrucciones para el desarrollador Backend):
       - MÉTODO HTTP: POST
       - ENDPOINT RECOMENDADO: /api/pedidos/cliente
       - DESCRIPCIÓN: Este endpoint debe recibir el objeto "pedido" detallado aquí arriba.
       - REGLA DE NEGOCIO: La columna 'direccion' recibirá el string "Venta en tienda" si el usuario eligió RECOJO,
         sirviendo internamente para clasificar el tipo de entrega en el sistema sin alterar la estructura básica de la BD.
    */

    alert("Pedido realizado correctamente");
    onNavigate("pedidos");
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

      <PaginaActualC titulo="Checkout" />
      
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
        <button className="btn-cancelar" onClick={cancelarPedido}>
          Cancelar Pedido
        </button>

        <button
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
      