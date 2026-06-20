import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

/**
 * Componente Navbar global para o Libris.
 * Exibe o logotipo e os links principais: Dashboard e Minha Estante.
 */
export default function Navbar() {
  return (
    <header className="navbar bg-base-200 border-b border-base-300 px-6 py-3 shadow-md sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      {/* Logotipo do Libris */}
      <div className="flex-1 flex items-center gap-3">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-xl text-white shadow-lg">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              Libris <span className="badge badge-accent badge-xs font-semibold py-1.5 px-2">v1.0</span>
            </h1>
            <p className="text-4xs text-gray-400 hidden sm:block">Gerenciador Pessoal de Leituras & Métricas</p>
          </div>
        </NavLink>
      </div>

      {/* Menu de Navegação Desktop */}
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => `font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl transition-all ${
                isActive ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-base-300'
              }`}
            >
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/estante" 
              className={({ isActive }) => `font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl transition-all ${
                isActive ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-base-300'
              }`}
            >
              📚 Minha Estante
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
}
