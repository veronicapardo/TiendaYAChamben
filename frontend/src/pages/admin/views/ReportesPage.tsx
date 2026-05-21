import "../../../styles/estilos_admin/reportesadmin.css";

export function ReportesPage() {
  return (
    <div className="reportes-container">

      <div className="report-cards">

        <div className="report-card">
          <h2>Ventas Totales</h2>
          <p>Bs/ 15,890.93</p>
        </div>

        <div className="report-card">
          <h2>Pedidos Totales</h2>
          <p>287</p>
        </div>

      </div>

    </div>
  );
}