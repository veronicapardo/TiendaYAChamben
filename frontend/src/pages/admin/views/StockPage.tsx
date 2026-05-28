import { useEffect, useState } from "react";
import "../../../styles/estilos_admin/stockadmin.css";
import {
  CalendarDays, Bell, Package, CheckCircle,
  AlertTriangle, XCircle, Search, Plus,
} from "lucide-react";
import {
  obtenerTodosLosProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  type ProductoResponseDto,
} from "../../../services/api";

const STOCK_BAJO = 10;

export function StockPage() {
  const [productos, setProductos] = useState<ProductoResponseDto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal para agregar/editar
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editando, setEditando] = useState<ProductoResponseDto | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
    imageUrl: "",
  });

  const cargar = async () => {
    try {
      const data = await obtenerTodosLosProductos();
      setProductos(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const categorias = ["Todas", ...Array.from(new Set(productos.map((p) => p.categoria)))];

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaFiltro === "Todas" || p.categoria === categoriaFiltro;
    return coincideBusqueda && coincideCategoria;
  });

  const totalProductos = productos.length;
  const enStock = productos.filter((p) => p.stock > STOCK_BAJO).length;
  const stockBajo = productos.filter((p) => p.stock > 0 && p.stock <= STOCK_BAJO).length;
  const sinStock = productos.filter((p) => p.stock === 0).length;

  const getEstadoBadge = (stock: number) => {
    if (stock === 0) return <span className="badge red">Agotado</span>;
    if (stock <= STOCK_BAJO) return <span className="badge orange">Bajo Stock</span>;
    return <span className="badge green">En stock</span>;
  };

  const abrirAgregar = () => {
    setEditando(null);
    setForm({ nombre: "", categoria: "", precio: "", stock: "", imageUrl: "" });
    setMostrarModal(true);
  };

  const abrirEditar = (p: ProductoResponseDto) => {
    setEditando(p);
    setForm({
      nombre: p.nombre,
      categoria: p.categoria,
      precio: String(p.precio),
      stock: String(p.stock),
      imageUrl: p.imageUrl || "",
    });
    setMostrarModal(true);
  };

  const guardar = async () => {
    try {
      if (editando) {
        await actualizarProducto(editando.id, {
          nombre: form.nombre,
          categoria: form.categoria,
          precio: Number(form.precio),
          stock: Number(form.stock),
          imageUrl: form.imageUrl || undefined,
        });
      } else {
        await crearProducto({
          nombre: form.nombre,
          categoria: form.categoria,
          precio: Number(form.precio),
          stock: Number(form.stock),
          imageUrl: form.imageUrl || undefined,
        });
      }
      setMostrarModal(false);
      cargar();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  const desactivar = async (id: number) => {
    if (!confirm("¿Desactivar este producto?")) return;
    try {
      await eliminarProducto(id);
      cargar();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  if (cargando) return <div className="stock-page"><p>Cargando productos...</p></div>;
  if (error) return <div className="stock-page"><p style={{ color: "red" }}>Error: {error}</p></div>;

  return (
    <div className="stock-page">
      {/* TOPBAR */}
      <div className="topbar-admin">
        <div className="topbar-title">
          <Package size={28} />
          <h1>Stock</h1>
        </div>
        <div className="topbar-right">
          <div className="topbar-box"><CalendarDays size={18} /></div>
          <div className="topbar-box">
            <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
          <div className="topbar-box"><Bell size={18} /></div>
        </div>
      </div>

      {/* CARDS */}
      <div className="cards-grid">
        <div className="admin-card">
          <div><h3>Total de Productos</h3><h2>{totalProductos}</h2><p>Productos</p></div>
          <Package size={40} className="card-icon black" />
        </div>
        <div className="admin-card">
          <div><h3>En Stock</h3><h2 className="green">{enStock}</h2><p>Productos</p></div>
          <CheckCircle size={40} className="card-icon green" />
        </div>
        <div className="admin-card">
          <div><h3>Stock Bajo</h3><h2 className="orange">{stockBajo}</h2><p>Productos</p></div>
          <AlertTriangle size={40} className="card-icon orange" />
        </div>
        <div className="admin-card">
          <div><h3>Sin Stock</h3><h2 className="red">{sinStock}</h2><p>Productos</p></div>
          <XCircle size={40} className="card-icon red" />
        </div>
      </div>

      {/* FILTROS */}
      <div className="filters-row">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Search size={18} className="search-icon" />
        </div>

        <select
          className="filter-select"
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
        >
          {categorias.map((c) => <option key={c}>{c}</option>)}
        </select>

        <button className="add-btn" onClick={abrirAgregar}>
          <Plus size={18} /> Agregar producto
        </button>
      </div>

      {/* TABLA */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock Disponible</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Última actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.id}>
                <td>{p.nombre}</td>
                <td>{p.stock} uds</td>
                <td>{p.categoria}</td>
                <td>Bs/ {Number(p.precio).toFixed(2)}</td>
                <td>{getEstadoBadge(p.stock)}</td>
               <td>
  {p.updatedAt
    ? new Date(p.updatedAt).toLocaleDateString("es-BO")
    : p.fechaActualizacion || "-"}
</td>
                <td className="acciones">
                  <button
                    onClick={() => abrirEditar(p)}
                    style={{ color: "#f59e0b", background: "none", border: "none", cursor: "pointer", marginRight: 8 }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => desactivar(p.id)}
                    style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}
                  >
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL AGREGAR / EDITAR */}
      {mostrarModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div style={{ background: "white", padding: 24, borderRadius: 12, width: 400 }}>
            <h2>{editando ? "Editar Producto" : "Agregar Producto"}</h2>

            {(["nombre", "categoria", "precio", "stock", "imageUrl"] as const).map((campo) => (
              <div key={campo} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 4, fontWeight: 600 }}>
                  {campo === "imageUrl" ? "URL de imagen (opcional)" : campo.charAt(0).toUpperCase() + campo.slice(1)}
                </label>
                <input
                  type={campo === "precio" || campo === "stock" ? "number" : "text"}
                  value={form[campo]}
                  onChange={(e) => setForm({ ...form, [campo]: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #ddd" }}
                />
              </div>
            ))}

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <button
                onClick={() => setMostrarModal(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #ddd", cursor: "pointer" }}
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                style={{ padding: "8px 16px", borderRadius: 6, background: "#f59e0b", color: "white", border: "none", cursor: "pointer" }}
              >
                {editando ? "Guardar cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}