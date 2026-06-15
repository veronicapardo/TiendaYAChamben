import "../../../styles/estilos_admin/reportesadmin.css";

import { useState } from "react";
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


interface Venta {
  id: number;
  fecha: string;
  cliente: string;
  pedido: string;
  productos: number;
  total: number;
  estado: "Completado" | "Pendiente" | "Cancelado";
}


const ventasData: Venta[] = [
  { id: 1, fecha: "12/05/2026", cliente: "Maria Lopez",    pedido: "#021", productos: 4,  total: 45.00,  estado: "Completado" },
  { id: 2, fecha: "12/05/2026", cliente: "Juan Pérez",     pedido: "#020", productos: 2,  total: 32.50,  estado: "Completado" },
  { id: 3, fecha: "12/05/2026", cliente: "Ana Torres",     pedido: "#019", productos: 5,  total: 50.75,  estado: "Completado" },
  { id: 4, fecha: "11/05/2026", cliente: "Carlos Mendoza", pedido: "#018", productos: 3,  total: 78.00,  estado: "Pendiente"  },
  { id: 5, fecha: "11/05/2026", cliente: "Lucia Quispe",   pedido: "#017", productos: 1,  total: 21.00,  estado: "Completado" },
  { id: 6, fecha: "10/05/2026", cliente: "Roberto Mamani", pedido: "#016", productos: 6,  total: 112.30, estado: "Cancelado"  },
  { id: 7, fecha: "10/05/2026", cliente: "Sofía Choque",   pedido: "#015", productos: 2,  total: 38.90,  estado: "Completado" },
  { id: 8, fecha: "09/05/2026", cliente: "Diego Fernández",pedido: "#014", productos: 8,  total: 200.00, estado: "Completado" },
];

const badgeEstado: Record<string, string> = {
  Completado: "badge-green",
  Pendiente:  "badge-orange",
  Cancelado:  "badge-red",
};


export function ReportesPage() {
  const [rangoFecha, setRangoFecha]       = useState("mayo");
  const [compararCon, setCompararCon]     = useState("semana-anterior");
  const [tipoReporte, setTipoReporte]     = useState("ventas");
  const [busqueda, setBusqueda]           = useState("");


  const ventasFiltradas = ventasData.filter((v) => {
    const coincide =
      v.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.pedido.toLowerCase().includes(busqueda.toLowerCase());

    if (rangoFecha === "mayo")   return coincide && v.fecha.includes("/05/");
    if (rangoFecha === "semana") return coincide && ["12/05","11/05"].some(d => v.fecha.startsWith(d));
    return coincide;
  });

  const totalVentas    = ventasFiltradas.filter(v => v.estado === "Completado").reduce((a, v) => a + v.total, 0);
  const totalPedidos   = ventasFiltradas.length;
  const clientesUnicos = new Set(ventasFiltradas.map(v => v.cliente)).size;
  const promedio       = totalPedidos > 0 ? totalVentas / totalPedidos : 0;

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
          <span>May 12, 2026</span>
          <span>9:41 AM</span>
          <div className="top-icon"><Bell size={20} /></div>
        </div>
      </div>

      {/* CARDS */}
      <div className="reportes-cards">
        <div className="reporte-card">
          <div>
            <p>Ventas Totales</p>
            <h2>Bs/ {totalVentas.toLocaleString("es-BO", { minimumFractionDigits: 2 })}</h2>
            <span className="positivo">↑ 12,5% vs semana pasada</span>
          </div>
          <CreditCard size={42} className="icon-card" />
        </div>

        <div className="reporte-card">
          <div>
            <p>Pedidos Totales</p>
            <h2>{totalPedidos}</h2>
            <span className="positivo">↑ 8,3% vs semana pasada</span>
          </div>
          <ShoppingBag size={42} className="icon-card" />
        </div>

        <div className="reporte-card">
          <div>
            <p>Clientes Atendidos</p>
            <h2>{clientesUnicos}</h2>
            <span className="positivo">↑ 6,7% vs semana pasada</span>
          </div>
          <Users size={42} className="icon-card" />
        </div>

        <div className="reporte-card">
          <div>
            <p>Venta Promedio</p>
            <h2>Bs/ {promedio.toFixed(2)}</h2>
            <span className="positivo">↑ 9,4% vs semana pasada</span>
          </div>
          <BadgeCheck size={42} className="icon-card green-icon" />
        </div>
      </div>

      {/* FILTROS */}
      <div className="filtros-reportes">
        <div className="filtro-box">
          <label>Rango de fechas</label>
          <select value={rangoFecha} onChange={(e) => setRangoFecha(e.target.value)}>
            <option value="todo">Todo el período</option>
            <option value="semana">Esta semana</option>
            <option value="mayo">Mayo 2026</option>
          </select>
        </div>

        <div className="filtro-box">
          <label>Comparar con</label>
          <select value={compararCon} onChange={(e) => setCompararCon(e.target.value)}>
            <option value="semana-anterior">Semana anterior</option>
            <option value="mes-anterior">Mes anterior</option>
            <option value="año-anterior">Año anterior</option>
          </select>
        </div>

        <div className="filtro-box">
          <label>Tipo de reporte</label>
          <select value={tipoReporte} onChange={(e) => setTipoReporte(e.target.value)}>
            <option value="ventas">Ventas</option>
            <option value="pedidos">Pedidos</option>
            <option value="clientes">Clientes</option>
          </select>
        </div>

        <button className="btn-descargar">
          <Download size={18} />
          Descargar reporte
        </button>
      </div>

      {/* TABLA */}
      <div className="table-container">

        {/* Buscador dentro de la tabla */}
        <div className="tabla-header">
          <h3>Detalle de {tipoReporte === "ventas" ? "Ventas" : tipoReporte === "pedidos" ? "Pedidos" : "Clientes"}</h3>
          <div className="search-box-reporte">
            <input
              type="text"
              placeholder="Buscar cliente o pedido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "#888" }}>
                  No se encontraron registros
                </td>
              </tr>
            ) : (
              ventasFiltradas.map((v) => (
                <tr key={v.id}>
                  <td><strong>{v.pedido}</strong></td>
                  <td>{v.fecha}</td>
                  <td>{v.cliente}</td>
                  <td>{v.productos} productos</td>
                  <td><strong>Bs/ {v.total.toFixed(2)}</strong></td>
                  <td>
                    <span className={`badge-estado ${badgeEstado[v.estado]}`}>
                      {v.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Total */}
        <div className="tabla-total">
          <span>Total: <strong>Bs/ {totalVentas.toFixed(2)}</strong> en {ventasFiltradas.filter(v => v.estado === "Completado").length} ventas completadas</span>
        </div>

      </div>

    </div>
  );
}
