import "../../styles/cliente/carrito-item.css";
import { Trash2 } from "lucide-react";
type Props = {
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
  onAumentar: () => void;
  onDisminuir: () => void;
  onEliminar: () => void;
};

export function CarritoItem({
  nombre,
  precio,
  cantidad,
  imagen,
  onAumentar,
  onDisminuir,
  onEliminar,
}: Props) {

  return (
    <article className="carrito-item">

      <img src={imagen} alt={nombre} />

      <div className="carrito-info">

        <h3>{nombre}</h3>

        <p>Bs. {precio}</p>

         <div className="contador">
       <button onClick={onDisminuir}>-</button>
          <span>{cantidad}</span>
       <button onClick={onAumentar}>+</button>
       </div>
     
     <button className="btn-eliminar" onClick={onEliminar}>
       <Trash2 size={18} />
     </button>
      </div>

      <div className="carrito-total">

        <strong>
          Bs. {precio * cantidad}
        </strong>

      </div>

    </article>
  );
}