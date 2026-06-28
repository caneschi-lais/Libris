import React from 'react';
import { useBooksContext } from '../context/BooksContext';
import Dashboard from '../components/Dashboard';
import { BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const { books, isLoading } = useBooksContext();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabeçalho do Dashboard */}
      <div>
        <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" /> Painel de Estatísticas
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Acompanhe seu progresso de páginas lidas, metas de leitura por período e a distribuição da sua estante.
        </p>
      </div>

      {/* Estatísticas e Gráficos */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-base-200 border border-base-300 rounded-3xl shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-gray-400 font-semibold animate-pulse">Carregando painel de estatísticas...</p>
        </div>
      ) : (
        <Dashboard books={books} />
      )}
    </div>
  );
}
