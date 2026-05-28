import "../../../styles/estilos_admin/proveedoresadmin.css";

import {
  CalendarDays,
  Bell,
  Search,
  Filter,
  Plus,
  Users,
  UserCheck,
  UserX,
  UserPlus,
} from "lucide-react";

export function ProveedoresPage() {
  return (
    <div className="proveedores-page">

      {/* TOPBAR */}
      <div className="topbar-admin">

        <div className="page-title">
          <Users size={30} />
          <h1>Proveedores</h1>
        </div>

        <div className="topbar-right">

          <div className="top-icon">
            <CalendarDays size={20} />
          </div>

          <span>May 12, 2026</span>
          <span>9:41 AM</span>

          <div className="top-icon">
            <Bell size={20} />
          </div>

        </div>
      </div>

      
      <div className="cards-grid">

        <div className="admin-card">
          <div>
            <h3>Total de Proveedores</h3>
            <h2>18</h2>
            <p>Proveedores</p>
          </div>

          <Users className="card-icon black-icon" size={38} />
        </div>

        <div className="admin-card">
          <div>
            <h3>Activos</h3>
            <h2 className="green">8</h2>
            <p>Proveedores</p>
          </div>

          <UserCheck className="card-icon green-icon" size={38} />
        </div>

        <div className="admin-card">
          <div>
            <h3>Inactivos</h3>
            <h2 className="red">3</h2>
            <p>Proveedores</p>
          </div>

          <UserX className="card-icon red-icon" size={38} />
        </div>

        <div className="admin-card">
          <div>
            <h3>Nuevos este mes</h3>
            <h2 className="blue">11</h2>
            <p>Proveedores</p>
          </div>

          <UserPlus className="card-icon blue-icon" size={38} />
        </div>

      </div>

      
      <div className="filters-row">

        <div className="search-box">

          <input
            type="text"
            placeholder="Buscar proveedor..."
            className="search-input"
          />

          <Search size={18} className="search-icon" />

        </div>

        <div className="filter-wrapper">

          <Filter size={18} className="filter-icon" />

          <select className="filter-select">
            <option>Todos los estados</option>
          </select>

        </div>

        <button className="add-btn">

          <Plus size={18} />

          Agregar proveedor

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
              <th>Productos que suministra</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            <tr>

              <td>

                <div className="cliente-info">

                  <div className="avatar pink">
                    AS
                  </div>

                  Abarrotes del Sur

                </div>

              </td>

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

              <td>

                <div className="cliente-info">

                  <div className="avatar green-avatar">
                    PR
                  </div>

                  Productos la Roca

                </div>

              </td>

              <td>Diego Fernández</td>
              <td>76543210</td>
              <td>plroca@gmail.com</td>

              <td>
                <span className="badge green-products">
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

              <td>

                <div className="cliente-info">

                  <div className="avatar purple-avatar">
                    MT
                  </div>

                  Mayorista Tito

                </div>

              </td>

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