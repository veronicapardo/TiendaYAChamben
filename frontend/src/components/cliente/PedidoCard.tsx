import { useState } from "react";
import "../../styles/cliente/pedido-card.css";
import type { EstadoPedido, TipoEntrega } from "../../types/pedido";

type ProductoComprado = {
  nombre: string;
  cantidad: number;
  precioSubtotal: number;
};

type Props = {
  id: number;
  fecha: string;
  total: number;
  estado: EstadoPedido;
  tipoEntrega: TipoEntrega;
  productos?: ProductoComprado[];
  onCancelar?: (id: number) => void;
};

export function PedidoCard({
  id,
  fecha,
  total,
  estado,
  tipoEntrega,
  productos,
  onCancelar,
}: Props) {
  const [abierto, setAbierto] = useState(false);

  function obtenerTextoEstado() {
    switch (estado) {
      case "PENDIENTE":
        return "Pendiente";
      case "EN_PREPARACION":
        return "En preparación";
      case "EN_CAMINO":
        return "En camino";
      case "LISTO_RECOJO":
        return "Listo para recojo";
      case "ENTREGADO":
        return "Entregado";
      case "CANCELADO":
        return "Cancelado";
      case "ENTREGA_FALLIDA":
        return "Entrega fallida ⚠️";
      default:
        return estado;
    }
  }

  // Datos mock por defecto
  const listaProductos = productos || [
    { nombre: "Monster sin azúcar", cantidad: 4, precioSubtotal: 80 },
    { nombre: "Oreo", cantidad: 5, precioSubtotal: 40 },
  ];

  // Determinamos 
  const esEstadoInvalidoParaProgreso = estado === "CANCELADO" || estado === "ENTREGA_FALLIDA";

  return (
    <article className="pedido-card-contenedor">
      <div className="pedido-card-header" onClick={() => setAbierto(!abierto)}>
        <div>
          <strong>Pedido #{id}</strong>
          <p className="pedido-fecha">{fecha}</p>
        </div>

        <span className={`pedido-estado ${estado.toLowerCase()}`}>
          {obtenerTextoEstado()}
          {abierto ? " ▲" : " ▼"}
        </span>
      </div>

      {abierto && (
        <div className="pedido-detalle">
          <p className="pedido-tipo">
            {tipoEntrega === "ENVIO" ? "🚚 Envío a domicilio" : "📍 Recojo en tienda"}
          </p>

          <div className="pedido-productos">
            {listaProductos.map((prod, index) => (
              <div className="producto-mini" key={index}>
                <span>
                  {prod.cantidad}x {prod.nombre}
                </span>
                <strong>{prod.precioSubtotal} Bs.</strong>
              </div>
            ))}
          </div>

          <div className="pedido-total">
            <strong>Total: {total} Bs.</strong>
          </div>

          <div className="pedido-stepper-contenedor">
            <p className="stepper-titulo">Estado del pedido:</p>
            
            {estado === "ENTREGA_FALLIDA" && (
              <p className="alerta-error">El repartidor no pudo concretar la entrega de tu pedido.</p>
            )}

            <div className="pedido-stepper">
              <div className={`step ${!esEstadoInvalidoParaProgreso ? "activo" : ""}`}>
                <div className="circle">1</div>
                <span>Pendiente</span>
              </div>

              <div className={`step ${
                !esEstadoInvalidoParaProgreso && (
                  estado === "EN_PREPARACION" || 
                  estado === "EN_CAMINO" || 
                  estado === "LISTO_RECOJO" || 
                  estado === "ENTREGADO"
                ) ? "activo" : ""
              }`}>
                <div className="circle">2</div>
                <span>En preparación</span>
              </div>
              {tipoEntrega === "ENVIO" ? (
                <>
                  <div className={`step ${!esEstadoInvalidoParaProgreso && (estado === "EN_CAMINO" || estado === "ENTREGADO") ? "activo" : ""}`}>
                    <div className="circle">3</div>
                    <span>Listo para entrega</span>
                  </div>

                  <div className={`step ${!esEstadoInvalidoParaProgreso && (estado === "EN_CAMINO" || estado === "ENTREGADO") ? "activo" : ""}`}>
                    <div className="circle">4</div>
                    <span>En Camino</span>
                  </div>

                  <div className={`step ${estado === "ENTREGADO" ? "activo" : ""}`}>
                    <div className="circle">5</div>
                    <span>Recibido</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={`step ${!esEstadoInvalidoParaProgreso && (estado === "LISTO_RECOJO" || estado === "ENTREGADO") ? "activo" : ""}`}>
                    <div className="circle">3</div>
                    <span>Listo recojo</span>
                  </div>

                  <div className={`step ${estado === "ENTREGADO" ? "activo" : ""}`}>
                    <div className="circle">4</div>
                    <span>Entregado</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {estado !== "ENTREGADO" && estado !== "CANCELADO" && estado !== "ENTREGA_FALLIDA" && (
            <button
  type="button"
  className="btn-cancelar"
  onClick={() => {
    if (onCancelar) {
      onCancelar(id);
    }
  }}
>
  Cancelar pedido
</button>
          )}
        </div>
      )}
    </article>
  );
}