import "../../styles/cliente/pagina-actual.css";

interface HeaderPaginaProps {
  titulo: string;
}

export function PaginaActualC({ titulo }: HeaderPaginaProps) {
  return (
    <section className="pagina-actual">
      <h1>{titulo}</h1>
    </section>
  );
}