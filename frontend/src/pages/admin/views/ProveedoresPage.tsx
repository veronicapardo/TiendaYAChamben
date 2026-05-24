import "../../../styles/estilos_admin/proveedoresadmin.css";

export function ProveedoresPage() {
  return (
    <div className="proveedores-page">

      <div className="topbar-admin">
        <h1>Proveedores</h1>

        <div className="topbar-right">
          <span>May 12, 2026</span>
          <span>9:41 AM</span>
        </div>
      </div>

      <div className="cards-grid">

        <div className="admin-card">
          <h3>Total de Proveedores</h3>
          <h2>18</h2>
          <p>Proveedores</p>
        </div>

        <div className="admin-card">
          <h3>Activos</h3>
          <h2 className="green">8</h2>
          <p>Proveedores</p>
        </div>

        <div className="admin-card">
          <h3>Inactivos</h3>
          <h2 className="red">3</h2>
          <p>Proveedores</p>
        </div>

        <div className="admin-card">
          <h3>Nuevos este mes</h3>
          <h2 className="blue">11</h2>
          <p>Proveedores</p>
        </div>

      </div>

      <div className="filters-row">

        <input
          type="text"
          placeholder="Buscar proveedor..."
          className="search-input"
        />

        <select className="filter-select">
          <option>Todas los estados</option>
        </select>

        <button className="add-btn">
          + Agregar proveedor
        </button>

      </div>

      <div className="table-container">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Productos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Abarrotes del Sur</td>
              <td>Camila Lopez</td>
              <td>71234568</td>
              <td>adsur.bo@gmail.com</td>
              <td>
                <span className="badge purple">
                  45 Productos
                </span>
              </td>
              <td>
                <span className="badge green">
                  Activo
                </span>
              </td>
              <td className="acciones">
                Ver lotes Editar Umbral
              </td>
            </tr>

            <tr>
              <td>Productos la Roca</td>
              <td>Diego Fernández</td>
              <td>76543210</td>
              <td>plroca@gmail.com</td>
              <td>
                <span className="badge green">
                  32 Productos
                </span>
              </td>
              <td>
                <span className="badge green">
                  Activo
                </span>
              </td>
              <td className="acciones">
                Ver lotes Editar Umbral
              </td>
            </tr>

            <tr>
              <td>Mayorista Tito</td>
              <td>Valeria Quispe</td>
              <td>70192837</td>
              <td>mtito.bo@gmail.com</td>
              <td>
                <span className="badge purple">
                  28 Productos
                </span>
              </td>
              <td>
                <span className="badge green">
                  Activo
                </span>
              </td>
              <td className="acciones">
                Ver lotes Editar Umbral
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}