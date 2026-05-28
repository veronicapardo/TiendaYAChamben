import { useEffect, useState } from "react";
import "../../../styles/estilos_admin/reportesadmin.css";
import {
  CalendarDays, Bell, BarChart3, CreditCard,
  ShoppingBag, Users, BadgeCheck, Download,
} from "lucide-react";
import {
  obtenerVentas,
  obtenerPedidosAdmin,
  type VentaResponseDto,
  type PedidoAdminDto,
} from "../../../services/api";

export function ReportesPage() {
  const [ventas, setVentas] = useState<VentaResponseDto[]>([]);
  const [pedidos, setPedidos] = useState<PedidoAdminDto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const [v, p] = await Promise.all([obtenerVentas(), obtenerPedidosAdmin()]);
        setVentas(v);
        setPedidos(p);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const ventasCompletadas = ventas.filter((v) => v.estadoVenta === "COMPLETADA");
  const ventasTotales = ventasCompletadas.reduce((acc, v) => acc + Number(v.montoTotal), 0);
  const pedidosTotales = pedidos.length;
  const clientesUnicos = new Set(pedidos.map((p) => p.clienteId)).size;
  const ventaPromedio = ventasCompletadas.length > 0
    ? ventasTotales / ventasCompletadas.length
    : 0;

  const descargarCSV = () => {
    const cabecera = "ID,Cliente,Fecha,Monto,Estado\n";
    const filas = ventas.map((v) =>
      `${v.id},"${v.clienteNombre}",${v.fechaVenta},${v.montoTotal},${v.estadoVenta}`
    ).join("\n");
    const blob = new Blob([cabecera + filas], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte_ventas_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (cargando) return <div className="reportes-container"><p>Cargando reportes...</p></div>;

  return (
    <div className="reportes-container">
      {/* HEADER */}
      <div className="reportes-header">
        <div className="titulo-reportes">
          <BarChart3 size={34} />
          <h1>Reportes</h1>
        </div>
        <div className="header-actions">
          <div className="top-icon"><CalendarDays size={20} /></div>
          <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          <div className="top-icon"><Bell size={20} /></div>
        </div>
      </div>

      {/* CARDS */}
      <div className="reportes-cards">
        <div className="reporte-card">
          <div>
            <p>Ventas Totales</p>
            <h2>Bs/ {ventasTotales.toLocaleString("es-BO", { minimumFractionDigits: 2 })}</h2>
          </div>
          <CreditCard size={42} className="icon-card" />
        </div>
        <div className="reporte-card">
          <div>
            <p>Pedidos Totales</p>
            <h2>{pedidosTotales}</h2>
          </div>
          <ShoppingBag size={42} className="icon-card" />
        </div>
        <div className="reporte-card">
          <div>
            <p>Clientes Atendidos</p>
            <h2>{clientesUnicos}</h2>
          </div>
          <Users size={42} className="icon-card" />
        </div>
        <div className="reporte-card">
          <div>
            <p>Venta Promedio</p>
            <h2>Bs/ {ventaPromedio.toFixed(2)}</h2>
          </div>
          <BadgeCheck size={42} className="icon-card green-icon" />
        </div>
      </div>

      {/* ACCIONES */}
      <div className="filtros-reportes">
        <div className="filtro-box">
          <label>Tipo de reporte</label>
          <select><option>Ventas</option></select>
        </div>
        <button className="btn-descargar" onClick={descargarCSV}>
          <Download size={18} />
          Descargar CSV
        </button>
      </div>

      {/* TABLA DE VENTAS */}
      <div style={{ marginTop: 24, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 10, overflow: "hidden" }}>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              {["ID", "Cliente", "Fecha", "Monto", "Estado"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ventas.slice(0, 20).map((v) => (
              <tr key={v.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "10px 16px" }}>#{v.id}</td>
                <td style={{ padding: "10px 16px" }}>{v.clienteNombre}</td>
                <td style={{ padding: "10px 16px" }}>{new Date(v.fechaVenta).toLocaleDateString("es-BO")}</td>
                <td style={{ padding: "10px 16px", fontWeight: 600 }}>Bs/ {Number(v.montoTotal).toFixed(2)}</td>
                <td style={{ padding: "10px 16px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: v.estadoVenta === "COMPLETADA" ? "#dcfce7" : v.estadoVenta === "CANCELADA" ? "#fee2e2" : "#fef9c3",
                    color: v.estadoVenta === "COMPLETADA" ? "#16a34a" : v.estadoVenta === "CANCELADA" ? "#dc2626" : "#ca8a04",
                  }}>
                    {v.estadoVenta}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}