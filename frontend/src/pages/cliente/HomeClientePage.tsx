import "../../styles/cliente/home-cliente.css";
import { useState, useEffect } from "react";

import { PaginaActualC } from "../../components/cliente/PaginaActualC";
import { NavbarCliente } from "../../components/cliente/NavbarCliente";
import { SearchBar } from "../../components/cliente/SearchBar";
import { CategoriaTabs } from "../../components/cliente/CategoriaTabs";
import { ProductoCard } from "../../components/cliente/ProductoCard";
import { Logo } from "../../components/logo";
import type { ItemCarrito } from "../../types/carrito";
type ProductoBackend = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  disponible: boolean;
  categoria: string;
};

type Props = {
  onNavigate: (pagina: string) => void;
  carrito: Array<{ id: number; cantidad: number }>;
  onActualizarCantidad: (producto: ItemCarrito, cambio: number) => void;
};

export function HomeClientePage({ onNavigate, carrito = [], onActualizarCantidad }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [productos, setProductos] = useState<ProductoBackend[]>([]);
  const [cargando, setCargando] = useState(false);
   const banners = [
  {
    titulo: "¡Nuevas bebidas!",
    imagen: "/public/novedades.svg",
  },
  {
    titulo: "Snacks más vendidos",
    imagen: "/public/novedades.svg",
  },
  {
    titulo: "Ofertas especiales",
    imagen: "/public/novedades.svg",
  },
];

const [bannerActual, setBannerActual] = useState(0);

function siguienteBanner() {
  if (bannerActual === banners.length - 1) {
    setBannerActual(0);
  } else {
    setBannerActual(bannerActual + 1);
  }
}

function anteriorBanner() {
  if (bannerActual === 0) {
    setBannerActual(banners.length - 1);
  } else {
    setBannerActual(bannerActual - 1);
  }
}
  useEffect(() => {
    const obtenerCatalogoHome = async () => {
      try {
        setCargando(true);
        const res = await fetch("http://localhost:3000/v1/productos");
        const data = await res.json();
        const productosMapeados = data.map((p: any) => ({
          id: p.id,
          nombre: p.nombre,
          precio: p.precio,
          imagen: p.imageUrl || "/decor/producto-default.jpg",
          disponible: p.stock > 0,
          categoria: p.categoria,
        }));
        setProductos(productosMapeados);
      } catch (error) {
        console.error("Error al conectar con la API de productos:", error);
        setProductos([]);
      } finally {
        setCargando(false);
      }
    };

    obtenerCatalogoHome();
  }, []);

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const carritoSeguro = carrito || [];

  return (
    <main className="home-cliente">
      <header className="cliente-header">
        <Logo width="260px" />
      </header>
      {/*<strong style={{ color: "#3c0d02", fontWeight: "bold" }}>     BIENVENIDO DE NUEVO!! </strong>*/}
      
      <PaginaActualC titulo=" 🏠 Home" />
      
      <SearchBar busqueda={busqueda} setBusqueda={setBusqueda} />
      <CategoriaTabs categoriaActiva={categoriaActiva}
        setCategoriaActiva={setCategoriaActiva}
        />

      <section className="banner-novedades">
        <button className="banner-arrow" onClick={anteriorBanner} >
          ◀
        </button>
        <div className="banner-contenido">
          <h2>{banners[bannerActual].titulo}</h2>
          <button className="btn-banner-ver" onClick={() => onNavigate("productos")}>
            Ver
          </button>
        </div>

        <div className="banner-imagen-wrapper">
          <img src={banners[bannerActual].imagen} alt="Novedades" className="banner-img" />
        </div>
        <button className="banner-arrow" onClick={siguienteBanner}>
          ▶
        </button>
      </section>

      <section className="productos-grid">
        {cargando ? (
          <p>Cargando productos...</p>
        ) : (
          productosFiltrados.map((producto) => {
            const enCarrito = carritoSeguro.find((item) => item.id === producto.id);
            const cantidadActual = enCarrito ? enCarrito.cantidad : 0;

            return (
              <ProductoCard
                key={producto.id}
                id={producto.id}
                nombre={producto.nombre}
                precio={producto.precio}
                imagen={producto.imagen}
                disponible={producto.disponible}
                cantidad={cantidadActual}
                mostrarDisponibilidad={false} 
                variante="vertical" 
               onAumentar={() =>
                  onActualizarCantidad(
                    {
                      id: producto.id,
                      nombre: producto.nombre,
                      precio: producto.precio,
                      imagen: producto.imagen,
                      cantidad: cantidadActual,
                    },
                    1
                  )
                }
                
                onDisminuir={() =>
                  onActualizarCantidad(
                    {
                      id: producto.id,
                      nombre: producto.nombre,
                      precio: producto.precio,
                      imagen: producto.imagen,
                      cantidad: cantidadActual,
                    },
                    -1
                  )
                }
              />
            );
          })
        )}
      </section>

      <NavbarCliente paginaActiva="home" onNavigate={onNavigate} />
    </main>
  );
}