import "../../../styles/estilos_admin/reportesadmin.css";

import {
  CalendarDays,
  Bell,
  BarChart3,
  CreditCard,
  ShoppingBag,
  Users,
  BadgeCheck,
  Download,
} from "lucide-react";

export function ReportesPage() {
  return (
    <div className="reportes-container">

      
      <div className="reportes-header">

        <div className="titulo-reportes">
          <BarChart3 size={34} />
          <h1>Reportes</h1>
        </div>

        <div className="header-actions">

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

      
      <div className="reportes-cards">

        <div className="reporte-card">

          <div>
            <p>Ventas Totales</p>
            <h2>Bs/ 15,890.93</h2>

            <span className="positivo">
              12,5% vs semana pasada
            </span>
          </div>

          <CreditCard size={42} className="icon-card" />

        </div>

        <div className="reporte-card">

          <div>
            <p>Pedidos Totales</p>
            <h2>287</h2>

            <span className="positivo">
              8,3% vs semana pasada
            </span>
          </div>

          <ShoppingBag size={42} className="icon-card" />

        </div>

        <div className="reporte-card">

          <div>
            <p>Clientes Atendidos</p>
            <h2>9</h2>

            <span className="positivo">
              6,7% vs semana pasada
            </span>
          </div>

          <Users size={42} className="icon-card" />

        </div>

        <div className="reporte-card">

          <div>
            <p>Ventas Promedio</p>
            <h2>11</h2>

            <span className="positivo">
              9,4% vs semana pasada
            </span>
          </div>

          <BadgeCheck
            size={42}
            className="icon-card green-icon"
          />

        </div>

      </div>

      
      <div className="filtros-reportes">

        <div className="filtro-box">

          <label>Rango de fechas</label>

          <select>
            <option>
              01 May 2026 - 01 Jun 2026
            </option>
          </select>

        </div>

        <div className="filtro-box">

          <label>Comparar con</label>

          <select>
            <option>Semana anterior</option>
          </select>

        </div>

        <div className="filtro-box">

          <label>Tipo de reporte</label>

          <select>
            <option>Ventas</option>
          </select>

        </div>

        <button className="btn-descargar">

          <Download size={18} />

          Descargar reporte

        </button>

      </div>

    </div>
  );
}