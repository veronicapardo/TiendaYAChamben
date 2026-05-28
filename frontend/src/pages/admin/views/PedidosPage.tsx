import "../../../styles/estilos_admin/pedidosadmin.css";

import {
  CalendarDays,
  Bell,
  Package,
  Loader,
  Truck,
  CheckCircle,
  Search,
  Plus,
  SlidersHorizontal,
} from "lucide-react";

export function PedidosPage() {
  return (
    <div className="pedidos-page">

      
      <div className="topbar-admin">

        <div className="topbar-title">
          <Package size={28} />
          <h1>Pedidos recientes</h1>
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
            <h3>Total de Pedidos</h3>
            <h2>21</h2>
            <p>Pedidos</p>
          </div>

          <Package size={38} className="card-icon brown" />

        </div>

        <div className="admin-card">

          <div>
            <h3>En Preparación</h3>
            <h2 className="blue">8</h2>
            <p>Pedidos</p>
          </div>

          <Loader size={38} className="card-icon blue" />

        </div>

        <div className="admin-card">

          <div>
            <h3>En Camino</h3>
            <h2 className="orange">9</h2>
            <p>Pedidos</p>
          </div>

          <Truck size={38} className="card-icon orange" />

        </div>

        <div className="admin-card">

          <div>
            <h3>Entregados hoy</h3>
            <h2 className="green">11</h2>
            <p>Pedidos</p>
          </div>

          <CheckCircle size={38} className="card-icon green" />

        </div>

      </div>

     
      <div className="filters-row">

        <div className="search-box">

          <input
            type="text"
            placeholder="Buscar pedido..."
            className="search-input"
          />

          <Search size={18} className="search-icon" />

        </div>

        <div className="filter-wrapper">

          <SlidersHorizontal size={18} />

          <select className="filter-select">
            <option>Todas los estados</option>
          </select>

        </div>

        <button className="add-btn">

          <Plus size={18} />

          Nuevo pedido

        </button>

      </div>

      {/* TABLA */}
      <div className="table-container">

        <table className="admin-table">

          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fecha del pedido</th>
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

              <td>
                <div className="cliente-box">

                  <div className="cliente-avatar pink">
                    ML
                  </div>

                  <div>
                    <p className="cliente-nombre">
                      Maria Lopez
                    </p>

                    <span className="cliente-phone">
                      77232321
                    </span>
                  </div>

                </div>
              </td>

              <td>Av. America 123</td>
              <td>10:25 am</td>

              <td className="total-bold">
                Bs/ 45.00
              </td>

              <td>
                <span className="badge blue">
                  En preparación
                </span>
              </td>

              <td className="acciones">
                Ver Lotes
              </td>
            </tr>

            <tr>
              <td>#020</td>
              <td>12/05/2026</td>

              <td>
                <div className="cliente-box">

                  <div className="cliente-avatar green-avatar">
                    JP
                  </div>

                  <div>
                    <p className="cliente-nombre">
                      Juan Pérez
                    </p>

                    <span className="cliente-phone">
                      70012123
                    </span>
                  </div>

                </div>
              </td>

              <td>Av. Libertador 453</td>
              <td>10:05 am</td>

              <td className="total-bold">
                Bs/ 32.50
              </td>

              <td>
                <span className="badge orange">
                  En camino
                </span>
              </td>

              <td className="acciones">
                Ver Lotes
              </td>
            </tr>

            <tr>
              <td>#019</td>
              <td>12/05/2026</td>

              <td>
                <div className="cliente-box">

                  <div className="cliente-avatar purple">
                    AT
                  </div>

                  <div>
                    <p className="cliente-nombre">
                      Ana Torres
                    </p>

                    <span className="cliente-phone">
                      78182394
                    </span>
                  </div>

                </div>
              </td>

              <td>Av. Beijing 1001</td>
              <td>09:45 am</td>

              <td className="total-bold">
                Bs/ 50.75
              </td>

              <td>
                <span className="badge green">
                  Pedido entregado
                </span>
              </td>

              <td className="acciones">
                Ver Lotes
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}