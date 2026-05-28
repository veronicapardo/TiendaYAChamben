import "../../../styles/estilos_admin/stockadmin.css";

import {
  CalendarDays,
  Bell,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Plus,
} from "lucide-react";

export function StockPage() {
  return (
    <div className="stock-page">

      
      <div className="topbar-admin">

        <div className="topbar-title">
          <Package size={28} />
          <h1>Stock</h1>
        </div>

        <div className="topbar-right">

          <div className="topbar-box">
            <CalendarDays size={18} />
          </div>

          <div className="topbar-box">
            <span>May 12, 2026</span>
          </div>

          <div className="topbar-box">
            <span>9:41 AM</span>
          </div>

          <div className="topbar-box">
            <Bell size={18} />
          </div>

        </div>

      </div>

      
      <div className="cards-grid">

        <div className="admin-card">

          <div>
            <h3>Total de Productos</h3>
            <h2>152</h2>
            <p>Productos</p>
          </div>

          <Package size={40} className="card-icon black" />

        </div>

        <div className="admin-card">

          <div>
            <h3>En Stock</h3>
            <h2 className="green">124</h2>
            <p>Productos</p>
          </div>

          <CheckCircle size={40} className="card-icon green" />

        </div>

        <div className="admin-card">

          <div>
            <h3>Stock Bajo</h3>
            <h2 className="orange">18</h2>
            <p>Productos</p>
          </div>

          <AlertTriangle size={40} className="card-icon orange" />

        </div>

        <div className="admin-card">

          <div>
            <h3>Sin Stock</h3>
            <h2 className="red">10</h2>
            <p>Productos</p>
          </div>

          <XCircle size={40} className="card-icon red" />

        </div>

      </div>

      
      <div className="filters-row">

        <div className="search-box">

          <input
            type="text"
            placeholder="Buscar producto..."
            className="search-input"
          />

          <Search size={18} className="search-icon" />

        </div>

        <select className="filter-select">
          <option>Todas las categorías</option>
        </select>

        <button className="add-btn">

          <Plus size={18} />

          Agregar producto

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