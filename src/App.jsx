import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { BooksProvider } from './context/BooksContext';
import Sobre from './pages/Sobre';
import EstantePage from './pages/EstantePage';
import CadastroPage from './pages/CadastroPage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';

/**
 * Componente de Layout comum que renderiza o Navbar de navegação superior,
 * o container principal com as rotas ativas e o rodapé.
 */
function AppLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Exibe a Navbar apenas nas rotas internas (não exibe na landing page '/') */}
      {!isLandingPage && <Navbar />}

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
