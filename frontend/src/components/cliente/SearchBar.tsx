import "../../styles/cliente/searchbar.css";

type Props = {
  busqueda: string;
  setBusqueda: React.Dispatch<React.SetStateAction<string>>;
};

export function SearchBar({
  busqueda,
  setBusqueda,
}: Props) {

  return (
    <section className="searchbar">

      <div className="search-input">

        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

      </div>

      <button className="btn-buscar">
        Buscar
      </button>

    </section>
  );
}