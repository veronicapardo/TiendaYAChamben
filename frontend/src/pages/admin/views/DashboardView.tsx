export const DashboardView = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Resumen General</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjetas de estadísticas de ejemplo */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Ventas de Hoy</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">$1,250.00</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Pedidos Pendientes</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">14</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Alertas de Stock</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">5 productos</p>
        </div>
      </div>
    </div>
  );
};