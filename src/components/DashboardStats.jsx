import React from 'react';
import { Layers, BookOpenCheck, Award } from 'lucide-react';

/**
 * Subcomponente do Dashboard contendo o painel superior de estatísticas rápidas.
 */
export default function DashboardStats({ stats, selectedYear }) {
  return (
    <div className="stats stats-vertical lg:stats-horizontal w-full bg-base-200 border border-base-300 rounded-3xl shadow-xl">
      {/* Total de Livros */}
      <div className="stat px-6 py-5">
        <div className="stat-figure text-primary">
          <Layers className="h-8 w-8 opacity-75" />
        </div>
        <div className="stat-title text-gray-400 font-semibold text-sm">Total de Livros</div>
        <div className="stat-value text-3xl font-extrabold text-base-content mt-1">{stats.totalLivros}</div>
        <div className="stat-desc text-xs text-gray-500 mt-1">
          {selectedYear === 'todos' ? 'Registrados na sua estante' : `Ativos em ${selectedYear}`}
        </div>
      </div>

      {/* Livros Lidos */}
      <div className="stat px-6 py-5 border-t lg:border-t-0 lg:border-l border-base-300">
        <div className="stat-figure text-success">
          <BookOpenCheck className="h-8 w-8 opacity-75" />
        </div>
        <div className="stat-title text-gray-400 font-semibold text-sm">Concluídos (Lidos)</div>
        <div className="stat-value text-3xl font-extrabold text-base-content mt-1">{stats.livrosLidos}</div>
        <div className="stat-desc text-xs text-gray-500 mt-1">
          {stats.totalLivros > 0 
            ? `${Math.round((stats.livrosLidos / stats.totalLivros) * 100)}% de taxa de conclusão` 
            : 'Sem leituras registradas'}
        </div>
      </div>

      {/* Páginas Lidas */}
      <div className="stat px-6 py-5 border-t lg:border-t-0 lg:border-l border-base-300">
        <div className="stat-figure text-accent">
          <Award className="h-8 w-8 opacity-75" />
        </div>
        <div className="stat-title text-gray-400 font-semibold text-sm">Páginas Lidas</div>
        <div className="stat-value text-3xl font-extrabold text-base-content mt-1">{stats.totalPaginasLidas}</div>
        <div className="stat-desc text-xs text-gray-500 mt-1">
          {selectedYear === 'todos' ? 'Soma de Lidos + Lendo atualmente' : `Lidos + Lendo em ${selectedYear}`}
        </div>
      </div>
    </div>
  );
}
