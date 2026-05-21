import { Link, useLocation } from 'react-router-dom';

export const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold">TiendaYa Admin</h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link 
          to="/admin" 
          className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/admin') ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/admin/stock" 
          className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/admin/stock') ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
        >
          Gestión de Stock
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};