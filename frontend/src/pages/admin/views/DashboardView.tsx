import "../../../styles/dashboardadmin.css";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { dia: "14 May", ventas: 400 },
  { dia: "15 May", ventas: 1200 },
  { dia: "16 May", ventas: 1900 },
  { dia: "17 May", ventas: 1200 },
  { dia: "18 May", ventas: 2300 },
  { dia: "19 May", ventas: 1600 },
  { dia: "20 May", ventas: 2400 },
];

export function DashboardView() {
  return (
    <div className="dashboard-container">

      
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div>
            <h4>Ventas del Día</h4>
            <h2>Bs/ 2,340.50</h2>
            <p className="green">12,5% vs ayer</p>
          </div>

          <span className="card-icon">💳</span>
        </div>

        <div className="dashboard-card">
          <div>
            <h4>Pedidos del Día</h4>
            <h2>28</h2>
            <p className="green">8,2% vs ayer</p>
          </div>

          <span className="card-icon">👜</span>
        </div>

        <div className="dashboard-card">
          <div>
            <h4>Clientes atendidos</h4>
            <h2>18</h2>
            <p className="green">8,2% vs ayer</p>
          </div>

          <span className="card-icon">👥</span>
        </div>

      </div>

      
      <div className="dashboard-grid">

        
        <div className="chart-box">
          <h3>Ventas de los últimos 7 días</h3>

          <div className="chart-real">

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>

                <XAxis dataKey="dia" />
                <YAxis />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#f59e0b"
                  fill="#fde68a"
                />

                <Line
                  type="monotone"
                  dataKey="ventas"
                  stroke="#f59e0b"
                  strokeWidth={3}
                />

              </AreaChart>
            </ResponsiveContainer>

          </div>
        </div>

       
        <div className="stock-box">

          <div className="stock-header">
            <h3>Productos con stock bajo</h3>
            <span>Ver todos</span>
          </div>

          
          <div className="stock-item">

            <img
              src="/productos/Nuggets Dino.svg"
              alt="Nuggets Dino"
            />

            <div>
              <p>Nuggets Dino Sofia 1 kg</p>
            </div>

            <span>2 unidades</span>

          </div>

          
          <div className="stock-item">

            <img
              src="/productos/Leche Pil Deslactosada.svg"
              alt="Leche Pil"
            />

            <div>
              <p>Leche Pil Deslactosada 800 ml</p>
            </div>

            <span>1 unidad</span>

          </div>

          
          <div className="stock-item">

            <img
              src="/productos/Chisps Ahoy!.svg"
              alt="Chips Ahoy"
            />

            <div>
              <p>Galleta Chips Ahoy 222 gr</p>
            </div>

            <span>3 unidades</span>

          </div>

          
          <div className="stock-item">

            <img
              src="/productos/Yogurt Pil.svg"
              alt="Yogurt Pil"
            />

            <div>
              <p>Yogurt Pil Bebible Frutilla 1 L</p>
            </div>

            <span>2 unidades</span>

          </div>

        </div>

      </div>

      
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

            <tr>
              <td>#021</td>
              <td>Maria López</td>
              <td>10:45 a.m</td>
              <td>Bs/ 45.00</td>

              <td>
                <span className="estado preparando">
                  En preparación
                </span>
              </td>
            </tr>

            <tr>
              <td>#020</td>
              <td>Juan Pérez</td>
              <td>10:15 a.m</td>
              <td>Bs/ 32.50</td>

              <td>
                <span className="estado camino">
                  En camino
                </span>
              </td>
            </tr>

            <tr>
              <td>#019</td>
              <td>Ana Torres</td>
              <td>09:50 a.m</td>
              <td>Bs/ 28.00</td>

              <td>
                <span className="estado entregado">
                  Entregado
                </span>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}