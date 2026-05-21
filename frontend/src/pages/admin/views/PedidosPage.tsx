import "../../../styles/estilos_admin/pedidosadmin.css";

export function PedidosPage() {
  return (
    <div className="pedidos-container">

      <div className="top-cards">
        <div className="card">Total de Pedidos: 21</div>
        <div className="card">En Preparación: 8</div>
        <div className="card">En Camino: 9</div>
        <div className="card">Entregados Hoy: 11</div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>#021</td>
              <td>Maria Lopez</td>
              <td>Bs/ 45.00</td>
              <td>En preparación</td>
            </tr>

            <tr>
              <td>#020</td>
              <td>Juan Pérez</td>
              <td>Bs/ 32.50</td>
              <td>En camino</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}