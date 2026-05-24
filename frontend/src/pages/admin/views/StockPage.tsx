import "../../../styles/estilos_admin/stockadmin.css";

export function StockPage() {
  return (
    <div className="stock-page">

      <div className="topbar-admin">
        <h1>Stock</h1>

        <div className="topbar-right">
          <span>May 12, 2026</span>
          <span>9:41 AM</span>
        </div>
      </div>

      <div className="cards-grid">

        <div className="admin-card">
          <h3>Total de Productos</h3>
          <h2>152</h2>
          <p>Productos</p>
        </div>

        <div className="admin-card">
          <h3>En Stock</h3>
          <h2 className="green">124</h2>
          <p>Productos</p>
        </div>

        <div className="admin-card">
          <h3>Stock Bajo</h3>
          <h2 className="orange">18</h2>
          <p>Productos</p>
        </div>

        <div className="admin-card">
          <h3>Sin Stock</h3>
          <h2 className="red">10</h2>
          <p>Productos</p>
        </div>

      </div>

      <div className="filters-row">

        <input
          type="text"
          placeholder="Buscar producto..."
          className="search-input"
        />

        <select className="filter-select">
          <option>Todas las categorías</option>
        </select>

        <button className="add-btn">
          + Agregar producto
        </button>

      </div>

      <div className="table-container">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock Disponible</th>
              <th>Stock Mínimo</th>
              <th>Estado</th>
              <th>Última actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Nuggets Dino Sofía 1 kg</td>
              <td>35 uds</td>
              <td>20</td>
              <td>
                <span className="badge green">
                  En stock
                </span>
              </td>
              <td>12/05/2026</td>
              <td className="acciones">
                Ver Lotes Editar Umbral
              </td>
            </tr>

            <tr>
              <td>Leche pil</td>
              <td>15 uds</td>
              <td>10</td>
              <td>
                <span className="badge orange">
                  Bajo Stock
                </span>
              </td>
              <td>12/05/2026</td>
              <td className="acciones">
                Ver Lotes Editar Umbral
              </td>
            </tr>

            <tr>
              <td>Dulce de leche PIL 250 gr</td>
              <td>0 uds</td>
              <td>20</td>
              <td>
                <span className="badge red">
                  Agotado
                </span>
              </td>
              <td>12/05/2026</td>
              <td className="acciones">
                Ver Lotes Editar Umbral
              </td>
            </tr>

            <tr>
              <td>Aceite Vegetol</td>
              <td>30 uds</td>
              <td>10</td>
              <td>
                <span className="badge green">
                  En stock
                </span>
              </td>
              <td>12/05/2026</td>
              <td className="acciones">
                Ver Lotes Editar Umbral
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}