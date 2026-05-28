import { useEffect, useMemo, useRef, useState } from "react";
import "../../styles/buscar-producto.css";
import "../../styles/dashboard-cajero.css";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Search,
  PackageCheck,
  Users,
  WalletCards,
  BarChart3,
  Settings,
  Package,
  ChevronRight,
  LogOut,
  Filter,
  RefreshCw,
  X,
} from "lucide-react";

import type { UsuarioLogueado } from "../../App";
import type { VistaCajero } from "../../types/navigation";
import { obtenerProductos, type ProductoApi } from "../../services/api";

type Props = {
  usuario: UsuarioLogueado;
  onNavigate: (vista: VistaCajero) => void;
};

function formatearBolivianos(valor: number) {
  return `Bs. ${Number(valor).toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function obtenerStockInfo(stock: number): { clase: string; etiqueta: string } {
  if (stock === 0) return { clase: "stock-out", etiqueta: "Sin stock" };
  if (stock <= 5) return { clase: "stock-low", etiqueta: `Stock bajo (${stock})` };
  return { clase: "stock-ok", etiqueta: `${stock} en stock` };
}

export function BuscarProductoPage({ usuario, onNavigate }: Props) {
  const [productos, setProductos] = useState<ProductoApi[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [soloConStock, setSoloConStock] = useState(false);
  const [orden, setOrden] = useState<"nombre" | "precio_asc" | "precio_desc" | "stock">("nombre");
  const [productoSeleccionado, setProductoSeleccionado] = useState<ProductoApi | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function cargarProductos() {
      try {
        setCargando(true);
        setError("");

        const datos = await obtenerProductos();
        setProductos(datos);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Error inesperado al cargar productos");
        }
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  const categorias = useMemo(() => {
    const categoriasUnicas = Array.from(
      new Set(productos.map((producto) => producto.categoria).filter(Boolean))
    );

    return ["Todos", ...categoriasUnicas];
  }, [productos]);

  const productosFiltrados = productos
    .filter((producto) => {
      const q = busqueda.toLowerCase().trim();

      const matchBusqueda =
        !q ||
        producto.nombre.toLowerCase().includes(q) ||
        producto.id.toString().includes(q) ||
        producto.categoria.toLowerCase().includes(q);

      const matchCategoria =
        categoriaActiva === "Todos" || producto.categoria === categoriaActiva;

      const matchStock = !soloConStock || producto.stock > 0;

      return matchBusqueda && matchCategoria && matchStock;
    })
    .sort((a, b) => {
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (orden === "precio_asc") return a.precio - b.precio;
      if (orden === "precio_desc") return b.precio - a.precio;
      if (orden === "stock") return b.stock - a.stock;
      return 0;
    });

  function limpiarFiltros() {
    setBusqueda("");
    setCategoriaActiva("Todos");
    setSoloConStock(false);
    setOrden("nombre");
    inputRef.current?.focus();
  }

  function recargarProductos() {
    setProductoSeleccionado(null);
    setBusqueda("");
    setCategoriaActiva("Todos");

    obtenerProductos()
      .then(setProductos)
      .catch((error) => {
        if (error instanceof Error) {
          setError(error.message);
        }
      });
  }

  return (
    <main className="cajero-dashboard">
      <aside className="cajero-sidebar">
        <div className="cajero-logo">
          <span className="logo-text-small">tienda</span>
          <span className="logo-text-main">Ya!</span>
        </div>

        <nav className="cajero-menu">
          <button className="menu-item" onClick={() => onNavigate("dashboard")}>
            <LayoutDashboard size={22} />
            <span>Dashboard</span>
          </button>

          <button className="menu-item" onClick={() => onNavigate("nueva-venta")}>
            <ShoppingCart size={22} />
            <span>Nueva Venta</span>
          </button>

          <button className="menu-item" onClick={() => onNavigate("registrar-pedido")}>
            <ClipboardList size={22} />
            <span>Registrar Pedido</span>
          </button>

          <button className="menu-item active" onClick={() => onNavigate("buscar-producto")}>
            <Search size={22} />
            <span>Buscar Producto</span>
          </button>

          <button className="menu-item" onClick={() => onNavigate("pedidos-pendientes")}>
            <PackageCheck size={22} />
            <span>Pedidos Pendientes</span>
          </button>

          <button className="menu-item" onClick={() => onNavigate("clientes")}>
            <Users size={22} />
            <span>Clientes</span>
          </button>

          <button className="menu-item" onClick={() => onNavigate("cierre-caja")}>
            <WalletCards size={22} />
            <span>Cierre de Caja</span>
          </button>

          <button className="menu-item" onClick={() => onNavigate("reportes")}>
            <BarChart3 size={22} />
            <span>Reportes</span>
          </button>

          <button className="menu-item" onClick={() => onNavigate("configuracion")}>
            <Settings size={22} />
            <span>Configuración</span>
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-icon">
            <Users size={22} />
          </div>
          <div>
            <strong>{usuario.nombre}</strong>
            <p>Turno: Mañana</p>
          </div>
          <LogOut size={18} />
        </div>
      </aside>

      <section className="cajero-content">
        <header className="bp-header">
          <div>
            <h1>Buscar producto</h1>
            <p>Consulta precios, stock y detalles de cualquier producto.</p>
          </div>
        </header>

        <div className="bp-search-bar">
          <div className="bp-input-wrap">
            <Search size={20} className="bp-input-icon" />
            <input
              ref={inputRef}
              className="bp-input"
              type="text"
              placeholder="Buscar por nombre, código o categoría..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />

            {busqueda && (
              <button className="bp-input-clear" onClick={() => setBusqueda("")}>
                <X size={16} />
              </button>
            )}
          </div>

          <button
            className={`bp-filter-btn ${soloConStock ? "active" : ""}`}
            onClick={() => setSoloConStock((valor) => !valor)}
          >
            <Filter size={16} /> Solo con stock
          </button>

          <button className="bp-filter-btn" onClick={limpiarFiltros}>
            <RefreshCw size={16} /> Limpiar
          </button>

          <button className="bp-filter-btn" onClick={recargarProductos}>
            <RefreshCw size={16} /> Recargar
          </button>
        </div>

        <div className="bp-categorias">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              className={`bp-cat-btn ${categoriaActiva === categoria ? "active" : ""}`}
              onClick={() => setCategoriaActiva(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="bp-empty">
            <Package size={48} />
            <p>Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="bp-empty">
            <Package size={48} />
            <p>{error}</p>
            <button className="bp-filter-btn" onClick={recargarProductos}>
              Intentar de nuevo
            </button>
          </div>
        ) : (
          <div className="bp-main-layout">
            <div>
              <div className="bp-results-header">
                <span className="bp-results-count">
                  Mostrando {productosFiltrados.length} producto
                  {productosFiltrados.length !== 1 ? "s" : ""}
                </span>

                <select
                  className="bp-sort-select"
                  value={orden}
                  onChange={(evento) => setOrden(evento.target.value as typeof orden)}
                >
                  <option value="nombre">Ordenar: A-Z</option>
                  <option value="precio_asc">Precio: menor a mayor</option>
                  <option value="precio_desc">Precio: mayor a menor</option>
                  <option value="stock">Mayor stock</option>
                </select>
              </div>

              {productosFiltrados.length === 0 ? (
                <div className="bp-empty">
                  <Package size={48} />
                  <p>No se encontraron productos.</p>
                  <button className="bp-filter-btn" onClick={limpiarFiltros}>
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="bp-grid">
                  {productosFiltrados.map((producto) => (
                    <ProductoCard
                      key={producto.id}
                      producto={producto}
                      seleccionado={productoSeleccionado?.id === producto.id}
                      onSeleccionar={() =>
                        setProductoSeleccionado((previo) =>
                          previo?.id === producto.id ? null : producto
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {productoSeleccionado && (
              <DetalleProducto
                producto={productoSeleccionado}
                onCerrar={() => setProductoSeleccionado(null)}
              />
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function ProductoCard({
  producto,
  seleccionado,
  onSeleccionar,
}: {
  producto: ProductoApi;
  seleccionado: boolean;
  onSeleccionar: () => void;
}) {
  const { clase, etiqueta } = obtenerStockInfo(producto.stock);

  return (
    <article
      className={`bp-producto-card ${seleccionado ? "seleccionado" : ""}`}
      onClick={onSeleccionar}
    >
      <div className="bp-prod-img">
        {producto.imageUrl ? (
          <img src={producto.imageUrl} alt={producto.nombre} />
        ) : (
          <Package size={28} />
        )}
      </div>

      <div className="bp-prod-categoria">{producto.categoria}</div>
      <div className="bp-prod-nombre">{producto.nombre}</div>
      <div className="bp-prod-precio">{formatearBolivianos(producto.precio)}</div>

      <div className="bp-prod-footer">
        <span className={`bp-stock-badge ${clase}`}>{etiqueta}</span>

        <button
          className="bp-btn-agregar"
          disabled={producto.stock === 0}
          onClick={(evento) => {
            evento.stopPropagation();
            alert(`"${producto.nombre}" se agregará desde la pantalla Nueva Venta.`);
          }}
        >
          + Venta
        </button>
      </div>
    </article>
  );
}

function DetalleProducto({
  producto,
  onCerrar,
}: {
  producto: ProductoApi;
  onCerrar: () => void;
}) {
  const { clase, etiqueta } = obtenerStockInfo(producto.stock);

  return (
    <aside className="bp-detalle-panel">
      <button className="bp-detalle-cerrar" onClick={onCerrar}>
        <X size={18} />
      </button>

      <div className="bp-detalle-img">
        {producto.imageUrl ? (
          <img src={producto.imageUrl} alt={producto.nombre} />
        ) : (
          <Package size={48} />
        )}
      </div>

      <div className="bp-detalle-cat">{producto.categoria}</div>
      <div className="bp-detalle-nombre">{producto.nombre}</div>
      <div className="bp-detalle-precio">{formatearBolivianos(producto.precio)}</div>

      <div className="bp-detalle-filas">
        <div className="bp-detalle-fila">
          <span>Código</span>
          <span>{producto.id}</span>
        </div>

        <div className="bp-detalle-fila">
          <span>Stock</span>
          <span className={`bp-stock-badge ${clase}`}>{etiqueta}</span>
        </div>

        <div className="bp-detalle-fila">
          <span>Unidad</span>
          <span>{producto.unidad}</span>
        </div>

        <div className="bp-detalle-fila">
          <span>Proveedor</span>
          <span>{producto.proveedor}</span>
        </div>

        <div className="bp-detalle-fila" style={{ border: "none" }}>
          <span>Última actualización</span>
          <span>{producto.fechaActualizacion}</span>
        </div>
      </div>

      <button
        className="bp-btn-venta"
        disabled={producto.stock === 0}
        onClick={() =>
          alert(`"${producto.nombre}" se agregará desde la pantalla Nueva Venta.`)
        }
      >
        + Agregar a venta
      </button>

      <button className="bp-btn-ver-pedidos ver-todo">
        Ver pedidos con este producto <ChevronRight size={16} />
      </button>
    </aside>
  );
}