import { useEffect, useState } from "react";
import {
  LayoutDashboard, 
  ShoppingCart, 
  ClipboardList, 
  Search,
  PackageCheck, 
  Users, 
  WalletCards, 
  BarChart3, 
  LogOut, 
  Calendar, 
  Clock, 
  DollarSign, 
  ShoppingBag,
  FileText, 
  Package, 
  TrendingUp, 
  ArrowUpRight,
  Filter, 
  RefreshCw, 
  FileDown, 
  TableProperties,
  Bike,
} from "lucide-react";
import type { UsuarioLogueado } from "../../App";
import type { VistaCajero } from "../../types/navigation";
import {
  obtenerReportes,
  type ReporteGeneralResponse,
} from "../../services/api";
type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (vista: VistaCajero) => void;
  onLogout: () => void;
};
 

 
 
 
function formatBs(v: number) {
  return `Bs. ${v.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
 
// ── Donut SVG puro ──────────────────────────────────────────
function DonutChart({
  datos,
  total,
}: {
  datos: { label: string; pct: number; monto: number }[];
  total: number;
}) {
  const cx = 90, cy = 90, r = 65, stroke = 28;
  const circ = 2 * Math.PI * r;

  const colores = ["#10B981", "#3B82F6", "#F28C00", "#8B5CF6"];
  const pcts = datos.length > 0 ? datos.map((m) => m.pct) : [100];

  let offset = 0;

  const slices = pcts.map((p, i) => {
    const len = (p / 100) * circ;
    const dash = `${len} ${circ - len}`;
    const rotate = offset * 3.6 - 90;
    offset += p;

    return {
      dash,
      rotate,
      color: datos.length > 0 ? colores[i % colores.length] : "#e5e7eb",
    };
  });

  return (
    <svg viewBox="0 0 180 180" width="180" height="180">
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={stroke}
          strokeDasharray={s.dash}
          strokeDashoffset={0}
          transform={`rotate(${s.rotate} ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      ))}

      <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />

      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fontSize="11"
        fill="#6b7280"
        fontWeight="600"
      >
        Total
      </text>

      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fontSize="13"
        fill="#111827"
        fontWeight="800"
      >
        {formatBs(total).replace("Bs. ", "Bs.")}
      </text>
    </svg>
  );
}
 
// ── Bar chart SVG puro ──────────────────────────────────────
function BarChart({
  datos,
}: {
  datos: { dia: string; valor: number }[];
}) {
  const datosGrafico = datos.length > 0 ? datos : [{ dia: "-", valor: 0 }];

  const max = Math.max(...datosGrafico.map((d) => d.valor), 1);
  const W = 420, H = 160, pad = { l: 40, r: 10, t: 20, b: 30 };
  const bw = (W - pad.l - pad.r) / datosGrafico.length;
  const barW = bw * 0.55;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
      {[0, 500, 1000, 1500, 2000].map((v) => {
        const y = pad.t + (H - pad.t - pad.b) * (1 - Math.min(v / Math.max(max, 2000), 1));

        return (
          <g key={v}>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={y}
              y2={y}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
            <text
              x={pad.l - 6}
              y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill="#9ca3af"
            >
              {v === 0 ? "0" : `${v / 1000}k`}
            </text>
          </g>
        );
      })}

      {datosGrafico.map((d, i) => {
        const x = pad.l + i * bw + (bw - barW) / 2;
        const barH = (d.valor / max) * (H - pad.t - pad.b);
        const y = pad.t + (H - pad.t - pad.b) - barH;

        return (
          <g key={`${d.dia}-${i}`}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx="5"
              fill="#F28C00"
            />

            <text
              x={x + barW / 2}
              y={y - 5}
              textAnchor="middle"
              fontSize="9"
              fill="#374151"
              fontWeight="700"
            >
              {d.valor > 0 ? (d.valor / 1000).toFixed(2).replace(".", ",") : "0"}
            </text>

            <text
              x={x + barW / 2}
              y={H - 4}
              textAnchor="middle"
              fontSize="9"
              fill="#9ca3af"
            >
              {d.dia}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
 
 
// ── Componente principal ────────────────────────────────────
export function ReportesPage({ usuario, onNavigate, onLogout }: Props) {
  const [desde, setDesde] = useState("2026-05-16");
const [hasta, setHasta] = useState("2026-05-27");
const [metodo, setMetodo] = useState("TODOS");
const [estado, setEstado] = useState("TODOS");

const [reporte, setReporte] = useState<ReporteGeneralResponse | null>(null);
const [cargando, setCargando] = useState(false);
const [error, setError] = useState("");
const [mostrarTodosMovimientos, setMostrarTodosMovimientos] = useState(false);

async function cargarReporte() {
  try {
    setCargando(true);
    setError("");

    const datos = await obtenerReportes({
      desde,
      hasta,
      metodo,
      estado,
    });

    setReporte(datos);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError("No se pudo cargar el reporte.");
    }
  } finally {
    setCargando(false);
  }
}

function limpiarFiltros() {
  const fechaDesdeInicial = "2026-05-16";
  const fechaHastaInicial = "2026-05-27";

  setDesde(fechaDesdeInicial);
  setHasta(fechaHastaInicial);
  setMetodo("TODOS");
  setEstado("TODOS");
  setMostrarTodosMovimientos(false);

  obtenerReportes({
    desde: fechaDesdeInicial,
    hasta: fechaHastaInicial,
    metodo: "TODOS",
    estado: "TODOS",
  })
    .then((datos) => {
      setReporte(datos);
      setError("");
    })
    .catch((error) => {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("No se pudo cargar el reporte.");
      }
    });
}

function exportarPDF() {
  window.print();
}

function exportarExcel() {
  const movimientos = reporte?.ultimosMovimientos || [];

  const cabecera = ["Fecha", "Tipo", "Cliente", "Método", "Total", "Estado"];

  const filas = movimientos.map((movimiento) => [
    new Date(movimiento.fecha).toLocaleString("es-BO"),
    movimiento.tipo,
    movimiento.cliente,
    movimiento.metodo,
    movimiento.total,
    movimiento.estado,
  ]);

  const csv = [cabecera, ...filas]
    .map((fila) => fila.map((celda) => `"${celda}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "reporte-tiendaya.csv";
  enlace.click();

  URL.revokeObjectURL(url);
}

useEffect(() => {
  cargarReporte();
}, []);
 
  const ahora = new Date();
  const fechaStr = `${ahora.getDate()}/${ahora.getMonth() + 1}/${ahora.getFullYear()}`;
  const horaStr  = ahora.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });

  const ventasTotales = reporte?.ventasTotales || 0;
const pedidosEntregados = reporte?.pedidosEntregados || 0;
const ticketPromedio = reporte?.ticketPromedio || 0;
const facturasEmitidas = reporte?.facturasEmitidas || 0;

const ventasPorDia = reporte?.ventasPorDia || [];
const metodosPago = reporte?.metodosPago || [];
const productosTop = reporte?.productosTop || [];
const ultimosMovimientos = reporte?.ultimosMovimientos || [];
const resumenCanal = reporte?.resumenCanal || [];

const movimientosVisibles = mostrarTodosMovimientos
  ? ultimosMovimientos
  : ultimosMovimientos.slice(0, 5);

const canalNuevaVenta = resumenCanal.find(
  (canal) => canal.nombre === "Nueva venta"
);

const canalDelivery = resumenCanal.find(
  (canal) => canal.nombre === "Pedidos delivery"
);
 
  return (
    <main className="cajero-dashboard">
      {/* ── Sidebar ── */}
      <aside className="cajero-sidebar">
        <div className="cajero-logo">
          <span className="logo-text-small">tienda</span>
          <span className="logo-text-main">Ya!</span>
        </div>
        <nav className="cajero-menu">
          <button className="menu-item" onClick={() => onNavigate("dashboard")}><LayoutDashboard size={22}/><span>Dashboard</span></button>
          <button className="menu-item" onClick={() => onNavigate("nueva-venta")}><ShoppingCart size={22}/><span>Nueva Venta</span></button>
          <button className="menu-item" onClick={() => onNavigate("registrar-pedido")}><ClipboardList size={22}/><span>Registrar Pedido</span></button>
          <button className="menu-item" onClick={() => onNavigate("buscar-producto")}><Search size={22}/><span>Buscar Producto</span></button>
          <button className="menu-item" onClick={() => onNavigate("pedidos-pendientes")}><PackageCheck size={22}/><span>Pedidos Pendientes</span></button>
          <button className="menu-item" onClick={() => onNavigate("clientes")}><Users size={22}/><span>Clientes</span></button>
          <button className="menu-item" onClick={() => onNavigate("cierre-caja")}><WalletCards size={22}/><span>Cierre de Caja</span></button>
          <button className="menu-item active" onClick={() => onNavigate("reportes")}><BarChart3 size={22}/><span>Reportes</span></button>
        </nav>
        <div className="sidebar-user">
  <div className="sidebar-user-icon">
    <Users size={22} />
  </div>

  <div>
    <strong>{usuario.nombre}</strong>
    <p>Turno: Mañana</p>
  </div>

  <button
    type="button"
    onClick={onLogout}
    style={{
      border: "none",
      background: "transparent",
      color: "#b91c1c",
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
    }}
  >
    <LogOut size={18} />
  </button>
</div>
      </aside>
 
      {/* ── Content ── */}
      <section className="cajero-content">
 
        {/* Header */}
        <header className="rp-header">
          <div>
            <h1>Reportes</h1>
            <p>Consulta ventas, pedidos y rendimiento del negocio</p>
          </div>
          <div className="rp-header-meta">
            <span className="rp-meta-item"><Calendar size={16}/> {fechaStr}</span>
            <span className="rp-meta-item"><Clock size={16}/> {horaStr}</span>
            <span className="rp-online"><span className="rp-dot"/>Online</span>
          </div>
        </header>
 
        {/* Filtros */}
        <div className="rp-filtros-bar">
          <div className="rp-filtro-group">
            <label>Desde</label>
            <div className="rp-input-wrap">
              <Calendar size={14} className="rp-input-icon"/>
              <input
  type="date"
  className="rp-input"
  value={desde}
  onChange={(e) => setDesde(e.target.value)}
/>
            </div>
          </div>

          
          <div className="rp-filtro-group">
            <label>Hasta</label>
            <div className="rp-input-wrap">
              <Calendar size={14} className="rp-input-icon"/>
              <input
  type="date"
  className="rp-input"
  value={hasta}
  onChange={(e) => setHasta(e.target.value)}
/>
            </div>
          </div>
          <div className="rp-filtro-group">
            <label>Método de pago</label>
            <select className="rp-select" value={metodo} onChange={e => setMetodo(e.target.value)}>
              <option value="TODOS">Todos</option>
<option value="EFECTIVO">Efectivo</option>
<option value="QR">QR</option>
<option value="TRANSFERENCIA">Transferencia</option>
<option value="MIXTO">Mixto</option>
            </select>
          </div>
          <div className="rp-filtro-group">
            <label>Estado</label>
            <select className="rp-select" value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="TODOS">Todos</option>
<option value="COMPLETADA">Completada</option>
<option value="PENDIENTE">Pendiente</option>
<option value="CANCELADA">Cancelada</option>
            </select>
          </div>
          <div className="rp-filtro-acciones">
            <button
  className="rp-btn-aplicar"
  onClick={cargarReporte}
  disabled={cargando}
>
  <Filter size={15}/>
  {cargando ? "Cargando..." : "Aplicar"}
</button>

<button
  className="rp-btn-limpiar"
  onClick={limpiarFiltros}
  disabled={cargando}
>
  <RefreshCw size={15}/>
  Limpiar
</button>
          </div>
          <div className="rp-export-btns">
            <button className="rp-btn-export pdf" onClick={exportarPDF}>
  <FileDown size={15}/>
  Exportar PDF
</button>

<button className="rp-btn-export excel" onClick={exportarExcel}>
  <TableProperties size={15}/>
  Exportar Excel
</button>
          </div>
        </div>

                {error && (
          <div
            className="rp-card"
            style={{ padding: 14, marginBottom: 16, color: "#b91c1c" }}
          >
            {error}
          </div>
        )}
 
        {/* KPI stats */}
        <div className="rp-stats">
          <div className="rp-stat-card">
            <div className="rp-stat-icon" style={{ background: "#F0FFF4" }}><DollarSign size={24} color="#10B981"/></div>
            <div>
              <div className="rp-stat-label">Ventas totales</div>
              <div className="rp-stat-value">{formatBs(ventasTotales)}</div>
              <div className="rp-stat-sub"><ArrowUpRight size={12} color="#10B981"/> <span className="verde">12,6%</span> vs periodo anterior</div>
            </div>
          </div>
          <div className="rp-stat-card">
            <div className="rp-stat-icon" style={{ background: "#FFF7ED" }}><ShoppingBag size={24} color="#F28C00"/></div>
            <div>
              <div className="rp-stat-label">Pedidos entregados</div>
              <div className="rp-stat-value">{pedidosEntregados}</div>
              <div className="rp-stat-sub"><ArrowUpRight size={12} color="#10B981"/> <span className="verde">8,3%</span> vs periodo anterior</div>
            </div>
          </div>
          <div className="rp-stat-card">
            <div className="rp-stat-icon" style={{ background: "#F5F3FF" }}><TrendingUp size={24} color="#8B5CF6"/></div>
            <div>
              <div className="rp-stat-label">Ticket promedio</div>
              <div className="rp-stat-value">{formatBs(ticketPromedio)}</div>
              <div className="rp-stat-sub"><ArrowUpRight size={12} color="#10B981"/> <span className="verde">5,7%</span> vs periodo anterior</div>
            </div>
          </div>
          <div className="rp-stat-card">
            <div className="rp-stat-icon" style={{ background: "#EFF6FF" }}><FileText size={24} color="#3B82F6"/></div>
            <div>
              <div className="rp-stat-label">Facturas emitidas</div>
              <div className="rp-stat-value">{facturasEmitidas}</div>
              <div className="rp-stat-sub"><ArrowUpRight size={12} color="#10B981"/> <span className="verde">14,1%</span> vs periodo anterior</div>
            </div>
          </div>
        </div>
 
        {/* Gráficas row */}
        <div className="rp-graficas-row">
          {/* Ventas por día */}
          <div className="rp-card rp-card-barras">
            <div className="rp-card-header">
              <span className="rp-card-title">Ventas por día</span>
              <button className="rp-chip">Total (Bs.) ▾</button>
            </div>
            <div className="rp-barchart-wrap">
              <BarChart datos={ventasPorDia} />
            </div>
          </div>
 
          {/* Métodos de pago */}
          <div className="rp-card rp-card-donut">
            <div className="rp-card-header">
              <span className="rp-card-title">Métodos de pago</span>
            </div>
            <div className="rp-donut-layout">
              <DonutChart datos={metodosPago} total={ventasTotales} />
              <div className="rp-donut-leyenda">
                {metodosPago.length === 0 && (
  <div className="rp-leyenda-item">
    <span className="rp-leyenda-dot" style={{ background: "#e5e7eb" }} />
    <div>
      <div className="rp-leyenda-label">Sin datos</div>
      <div className="rp-leyenda-sub">{formatBs(0)} (0%)</div>
    </div>
  </div>
)}

{metodosPago.map((m, index) => {
  const colores = ["#10B981", "#3B82F6", "#F28C00", "#8B5CF6"];

  return (
    <div className="rp-leyenda-item" key={m.label}>
      <span
        className="rp-leyenda-dot"
        style={{ background: colores[index % colores.length] }}
      />

      <div>
        <div className="rp-leyenda-label">{m.label}</div>
        <div className="rp-leyenda-sub">
          {formatBs(m.monto)} ({m.pct}%)
        </div>
      </div>
    </div>
  );
})}

<div className="rp-leyenda-total">
  Total: {formatBs(ventasTotales)}
</div>
              </div>
            </div>
          </div>
 
          {/* Productos más vendidos */}
          <div className="rp-card rp-card-productos">
            <div className="rp-card-header">
              <span className="rp-card-title">Productos más vendidos</span>
              <span className="rp-card-cant-label">Cant.</span>
            </div>
            <div className="rp-productos-lista">
              {productosTop.length === 0 && (
  <div className="rp-producto-fila">
    <span className="rp-prod-pos">-</span>
    <span className="rp-prod-emoji">📦</span>
    <span className="rp-prod-nombre">Sin productos vendidos</span>
    <span className="rp-prod-cant">0</span>
  </div>
)}

{productosTop.map((p) => (
  <div className="rp-producto-fila" key={p.pos}>
    <span className="rp-prod-pos">{p.pos}</span>
    <span className="rp-prod-emoji">{p.emoji}</span>
    <span className="rp-prod-nombre">{p.nombre}</span>
    <span className="rp-prod-cant">{p.cant}</span>
  </div>
))}
            </div>
          </div>
        </div>
 
        {/* Movimientos + Resumen canal */}
        <div className="rp-bottom-row">
          {/* Últimos movimientos */}
          <div className="rp-card rp-card-movimientos">
            <div className="rp-card-header">
              <span className="rp-card-title">Últimos movimientos</span>
            </div>
            <table className="rp-tabla">
              <thead>
                <tr>
                  <th>Fecha</th><th>Tipo</th><th>Cliente</th>
                  <th>Método</th><th>Total</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
  {movimientosVisibles.length === 0 && (
    <tr>
      <td colSpan={6} className="rp-fecha-cell">
        No hay movimientos registrados en este periodo.
      </td>
    </tr>
  )}

  {movimientosVisibles.map((m, i) => (
    <tr key={`${m.fecha}-${i}`}>
      <td className="rp-fecha-cell">
        {new Date(m.fecha).toLocaleString("es-BO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>

      <td>
        <span className={`rp-tipo ${m.tipo === "Pedido" ? "pedido" : "venta"}`}>
          {m.tipo === "Pedido" ? "📋 Pedido" : "🛒 Venta"}
        </span>
      </td>

      <td className="rp-cliente-cell">{m.cliente}</td>

      <td>
        <span
          className={`rp-badge ${
            m.metodo === "Efectivo"
              ? "efectivo"
              : m.metodo === "QR" || m.metodo === "Transferencia"
                ? "qr"
                : "mixto"
          }`}
        >
          {m.metodo}
        </span>
      </td>

      <td className="rp-monto-cell">{formatBs(m.total)}</td>

      <td>
        <span
          className={`rp-estado ${
            m.estado === "Entregado" ? "entregado" : "completado"
          }`}
        >
          {m.estado}
        </span>
      </td>
    </tr>
  ))}
</tbody>
            </table>
            <button
  className="rp-ver-todos"
  onClick={() => setMostrarTodosMovimientos((valor) => !valor)}
>
  {mostrarTodosMovimientos ? "Ver menos movimientos ↑" : "Ver todos los movimientos →"}
</button>
          </div>
 
          {/* Resumen por canal */}
          <div className="rp-card rp-card-canal">
            <div className="rp-card-header">
              <span className="rp-card-title">Resumen por canal</span>
              <button className="rp-chip">Total (Bs.) ▾</button>
            </div>
            <div className="rp-canal-grid">
  <div className="rp-canal-item verde">
    <div className="rp-canal-icon verde">
      <Package size={22} color="#10B981" />
    </div>

    <div>
      <div className="rp-canal-nombre">Nueva venta</div>

      <div className="rp-canal-val">
        {formatBs(canalNuevaVenta?.total || 0)}
      </div>

      <div className="rp-canal-sub">
        {canalNuevaVenta?.porcentaje || 0}% del total
      </div>

      <div className="rp-barra-wrap">
        <div
          className="rp-barra"
          style={{
            width: `${canalNuevaVenta?.porcentaje || 0}%`,
            background: "#10B981",
          }}
        />
      </div>
    </div>
  </div>

  <div className="rp-canal-item naranja">
    <div className="rp-canal-icon naranja">
      <Bike size={22} color="#F28C00" />
    </div>

    <div>
      <div className="rp-canal-nombre">Pedidos delivery</div>

      <div className="rp-canal-val">
        {formatBs(canalDelivery?.total || 0)}
      </div>

      <div className="rp-canal-sub">
        {canalDelivery?.porcentaje || 0}% del total
      </div>

      <div className="rp-barra-wrap">
        <div
          className="rp-barra"
          style={{
            width: `${canalDelivery?.porcentaje || 0}%`,
            background: "#F28C00",
          }}
        />
      </div>
    </div>
  </div>
</div>

<div className="rp-canal-transacciones">
  <div className="rp-trans-item">
    <span>Transacciones</span>
    <span className="rp-trans-val">
      {canalNuevaVenta?.transacciones || 0}
    </span>
  </div>

  <div className="rp-trans-item">
    <span>Transacciones</span>
    <span className="rp-trans-val">
      {canalDelivery?.transacciones || 0}
    </span>
  </div>
</div>

<div className="rp-total-general">
  <span>Total general</span>
  <span className="rp-total-val">{formatBs(ventasTotales)}</span>
</div>
          </div>
        </div>
 
      </section>
    </main>
  );
}
 