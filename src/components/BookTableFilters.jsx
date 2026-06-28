import React from 'react';
import { Search } from 'lucide-react';

/**
 * Subcomponente de cabeçalho da estante contendo campo de busca, ordenador e os selects de filtro cumulativos.
 */
export default function BookTableFilters({
  buscaTextual,
  setBuscaTextual,
  sortKey,
  setSortKey,
  filtroMidia,
  setFiltroMidia,
  filtroStatus,
  setFiltroStatus,
  filtroPosse,
  setFiltroPosse
}) {
  return (
    <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center justify-between bg-base-200 p-4 border border-base-300 rounded-2xl shadow-sm">
      {/* Campo de Busca e Seletor de Ordenação */}
      <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar por título, autor ou coleção..."
            value={buscaTextual}
            onChange={(e) => setBuscaTextual(e.target.value)}
            className="input input-bordered input-sm w-full pl-9 bg-base-100 text-sm focus:border-primary text-base-content"
          />
        </div>
        
        <select 
          value={sortKey} 
          onChange={(e) => setSortKey(e.target.value)} 
          className="select select-bordered select-sm bg-base-100 text-xs font-semibold sm:max-w-[200px] text-base-content"
          title="Ordenar estante"
        >
          <option value="titulo-asc">🔤 Título (A-Z)</option>
          <option value="titulo-desc">🔤 Título (Z-A)</option>
          <option value="autor-asc">✍️ Autor (A-Z)</option>
          <option value="paginas-desc">📄 Páginas (Maior)</option>
          <option value="paginas-asc">📄 Páginas (Menor)</option>
          <option value="progresso-desc">📈 Progresso (Maior)</option>
        </select>
      </div>

      {/* Grupo de Filtros Selects */}
      <div className="flex flex-wrap gap-2.5 items-center self-start xl:self-auto w-full xl:w-auto justify-start xl:justify-end">
        {/* Filtro 1: Tipo de Mídia */}
        <div className="form-control">
          <select
            value={filtroMidia}
            onChange={(e) => setFiltroMidia(e.target.value)}
            className="select select-bordered select-xs md:select-sm bg-base-100 text-2xs md:text-xs font-semibold text-base-content focus:border-primary"
            title="Filtrar por Mídia"
          >
            <option value="todos">📺 Mídia: Todos</option>
            <option value="Livro">📖 Livro</option>
            <option value="HQ">🎨 HQ</option>
            <option value="Mangá">🌸 Mangá</option>
            <option value="Audiobook">🎧 Audiobook</option>
          </select>
        </div>

        {/* Filtro 2: Progresso de Leitura */}
        <div className="form-control">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="select select-bordered select-xs md:select-sm bg-base-100 text-2xs md:text-xs font-semibold text-base-content focus:border-primary"
            title="Filtrar por Leitura"
          >
            <option value="todos">📈 Leitura: Todos</option>
            <option value="Não Lido">⚪ Não Lido</option>
            <option value="Lendo">🟡 Lendo</option>
            <option value="Lido">🟢 Lido</option>
          </select>
        </div>

        {/* Filtro 3: Posse */}
        <div className="form-control">
          <select
            value={filtroPosse}
            onChange={(e) => setFiltroPosse(e.target.value)}
            className="select select-bordered select-xs md:select-sm bg-base-100 text-2xs md:text-xs font-semibold text-base-content focus:border-primary"
            title="Filtrar por Posse"
          >
            <option value="todos">📦 Posse: Todos</option>
            <option value="tenho">💙 Tenho o Livro</option>
            <option value="quero">💛 Quero (Desejos)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
