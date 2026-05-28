import "../../styles/cliente/producto-card.css";

type Props = {
  id: number; 
  nombre: string;
  precio: number;
  imagen: string;
  disponible?: boolean;
  cantidad?: number;
  mostrarDisponibilidad?: boolean;
  variante?: "vertical" | "horizontal"; // la forma de la tarjeta
  onAumentar?: () => void;  // 
  onDisminuir?: () => void; // 
};

export function ProductoCard({
  id,
  nombre,
  precio,
  imagen,
  disponible = true, // asumimos que sí hay stock
  cantidad = 0,
  mostrarDisponibilidad = false,
  variante = "vertical", 
  onAumentar,
  onDisminuir,
}: Props) {
  
  const estaBloqueado = !disponible; //bloquar el boton

  return (
    <article className={`producto-card ${variante}`}>
      <img className="producto-imagen" src={imagen} alt={nombre}  />
      <div className="producto-info-wrapper">
        <h3>{nombre}</h3>
        <p className="precio">Bs. {precio}</p>

        {mostrarDisponibilidad && (
          <p className={disponible ? "disponible" : "nodisponible"}>
            {disponible ? "Disponible" : "No disponible"}
          </p>
        )}

    
        {cantidad > 0 && disponible ? (
          <div className="contador">
            <button onClick={onDisminuir}>-</button>
            <span>{cantidad}</span>
            <button onClick={onAumentar}>+</button>
          </div>
        ) : (
          <button 
            disabled={estaBloqueado} 
            className={`btn-anadir ${estaBloqueado ? "deshabilitado" : ""}`}
            onClick={onAumentar}
          >
            {disponible ? "Añadir" : "Agotado"}
          </button>
        )}
      </div>

    </article>
  );
}