import { useEffect, useState } from "react";
import "../../../styles/dashboardadmin.css";
import {
  obtenerVentas,
  obtenerPedidosAdmin,
  obtenerTodosLosProductos,
  type VentaResponseDto,
  type PedidoAdminDto,
  type ProductoResponseDto,
} from "../../../services/api";

// Umbral de "stock bajo" (puedes ajustarlo)
const STOCK_BAJO_UMBRAL = 10;

export function DashboardView() {
  const [ventas, setVentas] = useState<VentaResponseDto[]>([]);
  const [pedidos, setPedidos] = useState<PedidoAdminDto[]>([]);
  const [productos, setProductos] = useState<ProductoResponseDto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [v, p, pr] = await Promise.all([
          obtenerVentas(),
          obtenerPedidosAdmin(),
          obtenerTodosLosProductos(),
        ]);
        setVentas(v);
        setPedidos(p);
        setProductos(pr);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  // --- CALCULOS ---
  const hoy = new Date().toDateString();

  // Ventas del día (ventas completadas hoy)
  const ventasHoy = ventas
    .filter(
      (v) =>
        v.estadoVenta === "COMPLETADA" &&
        new Date(v.fechaVenta).toDateString() === hoy
    )
    .reduce((acc, v) => acc + Number(v.montoTotal), 0);

  // Pedidos del día
  const pedidosHoy = pedidos.filter(
    (p) => new Date(p.fechaHora).toDateString() === hoy
  ).length;

  // Clientes únicos atendidos hoy
  const clientesHoy = new Set(
    pedidos
      .filter((p) => new Date(p.fechaHora).toDateString() === hoy)
      .map((p) => p.clienteId)
  ).size;

  // Ventas de los últimos 7 días para el gráfico
  const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - (6 - i));
    const label = fecha.toLocaleDateString("es-BO", {
      day: "numeric",
      month: "short",
    });
    const totalDia = ventas
      .filter(
        (v) =>
          v.estadoVenta === "COMPLETADA" &&
          new Date(v.fechaVenta).toDateString() === fecha.toDateString()
      )
      .reduce((acc, v) => acc + Number(v.montoTotal), 0);
    return { dia: label, ventas: totalDia };
  });

  // Productos con stock bajo
  const stockBajo = productos
    .filter((p) => p.activo && p.stock <= STOCK_BAJO_UMBRAL && p.stock > 0)
    .slice(0, 4);

  // Pedidos recientes (últimos 3)
  const pedidosRecientes = [...pedidos]
    .sort(
      (a, b) =>
        new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
    )
    .slice(0, 3);

  const getEstadoClase = (estado: string) => {
    if (estado === "EN_PREPARACION") return "estado preparando";
    if (estado === "EN_CAMINO") return "estado camino";
    if (estado === "ENTREGADO") return "estado entregado";
    return "estado preparando";
  };

  const getEstadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      PENDIENTE: "Pendiente",
      EN_PREPARACION: "En preparación",
      LISTO_PARA_ENTREGAR: "Listo",
      EN_CAMINO: "En camino",
      ENTREGADO: "Entregado",
      CANCELADO: "Cancelado",
      ENTREGA_FALLIDA: "Fallido",
    };
    return labels[estado] || estado;
  };

  if (cargando) return <div className="dashboard-container"><p>Cargando...</p></div>;
  if (error) return <div className="dashboard-container"><p style={{ color: "red" }}>Error: {error}</p></div>;

  return (
    <div className="dashboard-container">
      {/* TARJETAS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div>
            <h4>Ventas del Día</h4>
            <h2>Bs/ {ventasHoy.toFixed(2)}</h2>
          </div>
          <span className="card-icon">💳</span>
        </div>

        <div className="dashboard-card">
          <div>
            <h4>Pedidos del Día</h4>
            <h2>{pedidosHoy}</h2>
          </div>
          <span className="card-icon">👜</span>
        </div>

        <div className="dashboard-card">
          <div>
            <h4>Clientes atendidos</h4>
            <h2>{clientesHoy}</h2>
          </div>
          <span className="card-icon">👥</span>
        </div>
      </div>

     {/* GRÁFICO + STOCK BAJO */}
<div className="admin-dashboard-grid">
  <div className="chart-real admin-chart-simple">
    {ultimos7Dias.map((item) => {
      const maximo = Math.max(...ultimos7Dias.map((dia) => dia.ventas), 1);
      const alto = Math.max((item.ventas / maximo) * 220, 8);

      return (
        <div className="admin-bar-item" key={item.dia}>
          <div className="admin-bar-value">
            Bs/ {item.ventas.toFixed(0)}
          </div>

          <div
            className="admin-bar"
            style={{ height: `${alto}px` }}
          />

          <span>{item.dia}</span>
        </div>
      );
    })}
  </div>

  <div className="stock-box">
    <div className="stock-header">
      <h3>Productos con stock bajo</h3>
    </div>

    {stockBajo.length === 0 ? (
      <p style={{ color: "green", padding: "1rem" }}>
        ✅ Todos los productos tienen stock suficiente
      </p>
    ) : (
      stockBajo.map((p) => (
        <div className="stock-item" key={p.id}>
          {p.imageUrl && <img src={p.imageUrl} alt={p.nombre} />}

          <div>
            <p>{p.nombre}</p>
          </div>

          <span style={{ color: "red" }}>{p.stock} unidades</span>
        </div>
      ))
    )}
  </div>
</div>
      {/* PEDIDOS RECIENTES */}
      <div className="recent-orders">
        <h3>Pedidos recientes</h3>
        <table>
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Hora</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidosRecientes.map((p) => (
              <tr key={p.id}>
                <td>#{p.id}</td>
                <td>{p.clienteNombre}</td>
                <td>
                  {new Date(p.fechaHora).toLocaleTimeString("es-BO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>Bs/ {Number(p.total).toFixed(2)}</td>
                <td>
                  <span className={getEstadoClase(p.estado)}>
                    {getEstadoLabel(p.estado)}
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