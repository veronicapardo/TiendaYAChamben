import "../../../styles/estilos_admin/pedidosadmin.css";

export function PedidosPage() {
  return (
    <div className="pedidos-page">

      <div className="topbar-admin">
        <h1>Pedidos recientes</h1>

        <div className="topbar-right">
          <span>May 12, 2026</span>
          <span>9:41 AM</span>
        </div>
      </div>

      <div className="cards-grid">

        <div className="admin-card">
          <h3>Total de Pedidos</h3>
          <h2>21</h2>
          <p>Pedidos</p>
        </div>

        <div className="admin-card">
          <h3>En Preparación</h3>
          <h2 className="blue">8</h2>
          <p>Pedidos</p>
        </div>

        <div className="admin-card">
          <h3>En Camino</h3>
          <h2 className="orange">9</h2>
          <p>Pedidos</p>
        </div>

        <div className="admin-card">
          <h3>Entregados hoy</h3>
          <h2 className="green">11</h2>
          <p>Pedidos</p>
        </div>

      </div>

      <div className="filters-row">

        <input
          type="text"
          placeholder="Buscar pedido..."
          className="search-input"
        />

        <select className="filter-select">
          <option>Todas los estados</option>
        </select>

        <button className="add-btn">
          + Nuevo pedido
        </button>

      </div>

      <div className="table-container">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Hora</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>#021</td>
              <td>12/05/2026</td>
              <td>Maria Lopez</td>
              <td>Av. America 123</td>
              <td>10:25 am</td>
              <td>Bs/ 45.00</td>
              <td>
                <span className="badge blue">
                  En preparación
                </span>
              </td>
              <td className="acciones">
                Ver lotes
              </td>
            </tr>

            <tr>
              <td>#020</td>
              <td>12/05/2026</td>
              <td>Juan Pérez</td>
              <td>Av. Libertador 453</td>
              <td>10:05 am</td>
              <td>Bs/ 32.50</td>
              <td>
                <span className="badge orange">
                  En camino
                </span>
              </td>
              <td className="acciones">
                Ver lotes
              </td>
            </tr>

            <tr>
              <td>#019</td>
              <td>12/05/2026</td>
              <td>Ana Torres</td>
              <td>Av. Beijing 1001</td>
              <td>09:45 am</td>
              <td>Bs/ 50.75</td>
              <td>
                <span className="badge green">
                  Pedido entregado
                </span>
              </td>
              <td className="acciones">
                Ver lotes
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}