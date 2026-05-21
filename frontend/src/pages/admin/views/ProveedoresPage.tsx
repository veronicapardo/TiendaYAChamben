import "../../../styles/estilos_admin/proveedoresadmin.css";

export function ProveedoresPage() {
  return (
    <div className="proveedores-container">

      <h1>Proveedores</h1>

      <div className="proveedores-grid">

        <div className="proveedor-card">
          <h3>Abarrotes del Sur</h3>
          <p>Activo</p>
        </div>

        <div className="proveedor-card">
          <h3>Pil Andina</h3>
          <p>Activo</p>
        </div>

      </div>

    </div>
  );
}