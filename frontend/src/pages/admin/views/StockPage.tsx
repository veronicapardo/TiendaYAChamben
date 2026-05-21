export const StockPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventario y Stock</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          + Nuevo Producto
        </button>
      </div>

      {/* Tabla básica de ejemplo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4">Producto</th>
              <th className="px-6 py-4">Categoría</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-gray-800">
            <tr>
              <td className="px-6 py-4 font-medium">Coca Cola 2L</td>
              <td className="px-6 py-4">Bebidas</td>
              <td className="px-6 py-4 text-green-600 font-bold">45 unds</td>
              <td className="px-6 py-4 text-blue-600 cursor-pointer">Editar</td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium">Galletas Oreo</td>
              <td className="px-6 py-4">Snacks</td>
              <td className="px-6 py-4 text-red-600 font-bold">2 unds</td>
              <td className="px-6 py-4 text-blue-600 cursor-pointer">Editar</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};