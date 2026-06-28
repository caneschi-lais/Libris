import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo3.png';

const THEMES = [
  { id: 'librisDark', name: 'Libris Dark', icon: '🌌' },
  { id: 'librisLight', name: 'Libris Light', icon: '🌤️' },
  { id: 'light', name: 'Claro', icon: '☀️' },
  { id: 'dark', name: 'Escuro', icon: '🌑' },
  { id: 'dracula', name: 'Dracula', icon: '🧛' },
  { id: 'luxury', name: 'Luxo', icon: '🕶️' },
  { id: 'synthwave', name: 'Synthwave', icon: '👾' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🤖' },
  { id: 'cupcake', name: 'Cupcake', icon: '🍰' },
  { id: 'coffee', name: 'Café', icon: '☕' },
  { id: 'forest', name: 'Floresta', icon: '🌲' },
  { id: 'sunset', name: 'Pôr do Sol', icon: '🌅' },
  { id: 'nord', name: 'Nord', icon: '❄️' }
];

/**
 * Componente Navbar global para o Libris.
 * Exibe o logotipo, links principais de navegação e seletor de temas.
 */
export default function Navbar() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('libris-theme') || 'librisDark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('libris-theme', theme);
  }, [theme]);

  // Encontra o tema atual para exibir o nome formatado no botão do dropdown
  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <header className="navbar bg-base-200 border-b border-base-300 px-6 py-3 shadow-md sticky top-0 z-50 backdrop-blur-md bg-opacity-95 flex-col md:flex-row gap-4 md:gap-0">
      {/* Logotipo do Libris */}
      <div className="flex-1 flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <img src={logo} alt="Libris Logo" width={60} height={60} className="rounded-lg object-contain" />
          <div>
            <h1 className="text-xl font-black tracking-tight text-base-content flex items-center gap-2">
              Libris <span className="badge badge-accent badge-xs font-semibold py-1.5 px-2">v1.0</span>
            </h1>
            <p className="text-4xs text-gray-400 hidden sm:block">Gerenciador Pessoal de Leituras & Métricas</p>
          </div>
        </NavLink>
      </div>

      {/* Menu de Navegação e Seletor de Tema */}
      <div className="flex-none flex items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-end">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'text-base-content/60 hover:text-base-content hover:bg-base-300'
                }`}
            >
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/estante"
              className={({ isActive }) => `font-semibold text-xs md:text-sm px-4 py-2.5 rounded-xl transition-all ${isActive ? 'bg-primary text-white shadow-md' : 'text-base-content/60 hover:text-base-content hover:bg-base-300'
                }`}
            >
              📚 Minha Estante
            </NavLink>
          </li>
        </ul>

        {/* Dropdown de Temas do DaisyUI */}
        <div className="dropdown dropdown-end">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost btn-xs sm:btn-sm rounded-xl gap-2 font-semibold border border-base-300 bg-base-100 hover:bg-base-300 text-base-content text-xs animate-none"
          >
            <span>{currentTheme.icon}</span>
            <span className="hidden sm:inline">Tema:</span>
            <span className="text-accent">{currentTheme.name}</span>
          </div>
          <ul 
            tabIndex={0} 
            className="dropdown-content z-[100] menu flex-col flex-nowrap p-2 shadow-2xl bg-base-200 border border-base-300 rounded-2xl w-48 max-h-80 overflow-y-auto mt-2"
          >
            {THEMES.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all ${theme === t.id ? 'bg-primary text-white shadow-sm' : 'text-base-content/60 hover:text-base-content hover:bg-base-300'}`}
                >
                  <span className="text-sm">{t.icon}</span>
                  <span>{t.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
