import "../../styles/cliente/checkout-cliente.css";

import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { Logo } from "../../components/logo";
import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import { useState } from "react";

import type { ItemCarrito } from "../../types/carrito";
import type { UsuarioLogueado } from "../../App";

import {
  crearPedidoRapido,
  type CreatePedidoRapidoDto,
} from "../../services/api";

type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (pagina: string) => void;
  carrito: ItemCarrito[];
};

export function CheckoutClientePage({ usuario, onNavigate, carrito }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nit, setNit] = useState("");
  const [indicaciones, setIndicaciones] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState<"ENVIO" | "RECOJO">("ENVIO");
  const [autocompletar, setAutocompletar] = useState(false);
  const [mensaje, setMensaje] = useState("");
const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error" | "">("");
const [enviando, setEnviando] = useState(false);

  const total = carrito.reduce(
  (acc, item) => acc + item.precio * item.cantidad,
  0
  );
  const totalEnvio = tipoEntrega === "ENVIO" ? 10 : 0;
  const totalFinal = total + totalEnvio;

  const productosPedido = carrito.map((item) => ({
  productoId: item.id,
  cantidad: item.cantidad,
}));
  async function finalizarPedido() {
  try {
    setMensaje("");
    setTipoMensaje("");
    setEnviando(true);

    if (carrito.length === 0) {
      setTipoMensaje("error");
      setMensaje("Tu carrito está vacío. Agrega productos antes de finalizar el pedido.");
      return;
    }

    const pedidoRapido: CreatePedidoRapidoDto = {
  clienteNombre: `${nombre} ${apellido}`.trim(),
  clienteTelefono: telefono,
  direccionEntrega: tipoEntrega === "RECOJO" ? "Venta en tienda" : direccion,
  referenciaEntrega: indicaciones.trim() === "" ? undefined : indicaciones,
  zona: tipoEntrega === "RECOJO" ? "Recojo en tienda" : "Envío a domicilio",
  observaciones: nit.trim() === "" ? undefined : `NIT: ${nit}`,
  costoEnvio: totalEnvio,
  repartidorId: null,
  productos: productosPedido,
};

    const pedidoCreado = await crearPedidoRapido(pedidoRapido);

   const limpiarTelefono = (valor: string) => valor.replace(/\D/g, "");

const claveIds = `clientePedidosIds_${usuario.id}`;
const claveTelefonos = `clienteTelefonosPedidos_${usuario.id}`;

const pedidoIdCreado = Number((pedidoCreado as any)?.id);

if (Number.isFinite(pedidoIdCreado)) {
  const idsGuardados = JSON.parse(
    localStorage.getItem(claveIds) || "[]"
  ) as number[];

  const nuevosIds = Array.from(
    new Set([...idsGuardados, pedidoIdCreado])
  );

  localStorage.setItem(claveIds, JSON.stringify(nuevosIds));
}

const telefonoLimpio = limpiarTelefono(telefono);

const telefonosGuardados = JSON.parse(
  localStorage.getItem(claveTelefonos) || "[]"
) as string[];

const nuevosTelefonos = Array.from(
  new Set([...telefonosGuardados, telefonoLimpio])
);

localStorage.setItem(claveTelefonos, JSON.stringify(nuevosTelefonos));
localStorage.setItem("clienteTelefonoPedido", telefonoLimpio);

    setTipoMensaje("exito");
    setMensaje("Pedido realizado correctamente. Puedes revisar el estado en Mis pedidos.");

    setTimeout(() => {
      onNavigate("pedidos");
    }, 900);
  } catch (error) {
    console.error(error);

    setTipoMensaje("error");

    if (error instanceof Error) {
      setMensaje(error.message);
    } else {
      setMensaje("Error al crear pedido.");
    }
  } finally {
    setEnviando(false);
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

{mensaje && (
  <div className={`checkout-mensaje ${tipoMensaje}`}>
    {mensaje}
  </div>
)}
      
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
    enviando ||
    carrito.length === 0 ||
    !nombre ||
    !apellido ||
    !telefono ||
    !email ||
    (tipoEntrega === "ENVIO" && !direccion)
  }
  onClick={finalizarPedido}
>
  {enviando ? "Registrando pedido..." : "Finalizar pedido"}
</button>
      </div>
    
      <NavbarCliente paginaActiva="Carrito" onNavigate={onNavigate} />
    </main>
  );
}
      