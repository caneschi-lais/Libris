import React from 'react';
import { useBooksContext } from '../context/BooksContext';
import Dashboard from '../components/Dashboard';
import { BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const { books } = useBooksContext();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabeçalho do Dashboard */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" /> Painel de Estatísticas
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Acompanhe seu progresso de páginas lidas, metas de leitura por período e a distribuição da sua estante.
        </p>
      </div>

      {/* Estatísticas e Gráficos */}
      <Dashboard books={books} />
    </div>
  );
}
