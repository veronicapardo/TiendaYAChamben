import "../../styles/cliente/categoria.css";

type Props = {
  categoriaActiva: string;
  setCategoriaActiva: (categoria: string) => void;
};

export function CategoriaTabs({
  categoriaActiva,
  setCategoriaActiva,
}: Props) {

  const categorias = [
    "Todas",
    "Bebidas",
    "Comida rapida",
    "Snacks",
    "Abarrotes",
  ];

  return (
    <section className="categorias">
      {categorias.map((categoria) => (
        <button
          key={categoria}
          className={
            categoriaActiva === categoria
              ? "categoria-btn activo"
              : "categoria-btn"
          }
          onClick={() => setCategoriaActiva(categoria)}
        >
          {categoria}
        </button>
      ))}
    </section>
  );
}