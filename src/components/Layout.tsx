import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  FileCheck, 
  BarChart3, 
  Landmark, 
  TrendingUp, 
  LogOut 
} from 'lucide-react';
import { logout, getCurrentUser } from '../services/authService';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard Resumo', path: '/', icon: LayoutDashboard },
    { name: 'Setup Center', path: '/setup', icon: Settings },
    { name: 'Curation Control (HITL)', path: '/curation', icon: FileCheck },
    { name: 'DRE Granular', path: '/dre', icon: BarChart3 },
    { name: 'Balanço Patrimonial', path: '/balanco', icon: Landmark },
    { name: 'Fluxo de Caixa', path: '/fluxo', icon: TrendingUp },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-amanava-black selection:bg-amanava-green selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Amanava" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="w-8 h-8 rounded-md bg-amanava-green flex items-center justify-center">
                    <span class="text-white font-bold text-xl leading-none">a</span>
                  </div>
                  <span class="font-bold text-xl tracking-tight text-amanava-black ml-2">Amanava</span>
                `;
              }}
            />
            <span className="font-bold text-xl tracking-tight text-amanava-black">Amanava</span>
          </div>
        </div>
        
        <div className="px-4 py-6 space-y-1 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
            CFO as a Service
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-amanava-green/10 text-amanava-green font-medium' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-amanava-black'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amanava-green' : 'text-gray-400'}`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-md bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-amanava-gold/20 flex items-center justify-center text-amanava-gold font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-amanava-black truncate">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'email@exemplo.com'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          >
             <LogOut className="w-5 h-5 text-gray-400" />
             <span className="text-sm">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (optional) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:hidden">
          <img 
            src="/logo.png" 
            alt="Amanava" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `
                <div class="w-8 h-8 rounded-md bg-amanava-green flex items-center justify-center">
                  <span class="text-white font-bold text-xl leading-none">a</span>
                </div>
                <span class="font-bold text-xl tracking-tight text-amanava-black ml-2">Amanava</span>
              `;
            }}
          />
          <span className="font-bold text-xl tracking-tight text-amanava-black ml-2">Amanava</span>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
