import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { BooksProvider } from './context/BooksContext';
import Sobre from './pages/Sobre';
import EstantePage from './pages/EstantePage';
import CadastroPage from './pages/CadastroPage';
import DashboardPage from './pages/DashboardPage';
import { BookOpen } from 'lucide-react';

/**
 * Componente de Layout comum que renderiza o Navbar de navegação superior,
 * o container principal com as rotas ativas e o rodapé.
 */
function AppLayout() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Navbar Premium */}
      <header className="navbar bg-base-200 border-b border-base-300 px-6 py-3 shadow-md sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="flex-1 flex items-center gap-3">
          <NavLink to="/" className="flex items-center gap-3">
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

        {/* Menu de Navegação Superior */}
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li>
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => `font-semibold text-xs md:text-sm px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-base-300'
                }`}
              >
                Sobre
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/estante" 
                className={({ isActive }) => `font-semibold text-xs md:text-sm px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-base-300'
                }`}
              >
                Estante
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/cadastro" 
                className={({ isActive }) => `font-semibold text-xs md:text-sm px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-base-300'
                }`}
              >
                Cadastrar
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `font-semibold text-xs md:text-sm px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-base-300'
                }`}
              >
                Dashboard
              </NavLink>
            </li>
          </ul>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Sobre />} />
          <Route path="/estante" element={<EstantePage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>

      {/* Footer Premium */}
      <footer className="footer footer-center p-4 bg-base-200 text-base-content border-t border-base-300 mt-12">
        <aside>
          <p className="text-xs text-gray-500">
            Libris © {new Date().getFullYear()} — Desenvolvido como Gerenciador Pessoal de Leituras & Métricas
          </p>
        </aside>
      </footer>
    </div>
  );
}

/**
 * Componente Raiz da Aplicação encapsulada no BooksProvider para dados globais
 * e Router para navegação multi-páginas.
 */
export default function App() {
  return (
    <BooksProvider>
      <Router>
        <AppLayout />
      </Router>
    </BooksProvider>
  );
}
