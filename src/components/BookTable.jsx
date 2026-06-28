import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Trash2,
  Edit3,
  Plus,
  Volume2,
  Layers,
  Compass,
  Book,
  Inbox,
  Sparkles,
  Tag,
  Star,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

/**
 * Componente de Tabela de Listagem de Livros do Libris.
 * 
 * @param {Object} props
 * @param {Array} props.books - Lista de livros do estado
 * @param {Function} props.onEdit - Callback ao clicar em Editar
 * @param {Function} props.onDelete - Callback ao clicar em Excluir
 * @param {Function} props.onIncrementPage - Callback para incrementar progresso de leitura
 */
export default function BookTable({ books, onEdit, onDelete, onIncrementPage }) {
  // Estados de busca e filtros avançados
  const [buscaTextual, setBuscaTextual] = useState('');
  const [filtroMidia, setFiltroMidia] = useState('todos'); // 'todos' | 'Livro' | 'HQ' | 'Mangá' | 'Audiobook'
  const [filtroStatus, setFiltroStatus] = useState('todos'); // 'todos' | 'Lido' | 'Lendo' | 'Não Lido'
  const [filtroPosse, setFiltroPosse] = useState('todos'); // 'todos' | 'tenho' | 'quero'
  const [sortKey, setSortKey] = useState('titulo-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 8 itens por página para desktop

  // 1. Filtragem combinada em tempo real (Busca + Filtros Avançados)
  const filteredBooks = useMemo(() => {
    return books.filter((livro) => {
      // Filtro de Busca Textual (Título, Autor ou Coleção)
      const query = buscaTextual.toLowerCase().trim();
      const bateBusca = !query ||
        livro.titulo.toLowerCase().includes(query) ||
        livro.autor.toLowerCase().includes(query) ||
        (livro.e_colecao && livro.nome_colecao && livro.nome_colecao.toLowerCase().includes(query));

      if (!bateBusca) return false;

      // Filtro de Mídia
      if (filtroMidia !== 'todos' && livro.tipo_midia !== filtroMidia) {
        return false;
      }

      // Filtro de Status de Leitura
      if (filtroStatus !== 'todos' && livro.status_leitura !== filtroStatus) {
        return false;
      }

      // Filtro de Posse
      if (filtroPosse !== 'todos') {
        if (filtroPosse === 'tenho' && !livro.possui_o_livro) return false;
        if (filtroPosse === 'quero' && livro.possui_o_livro) return false;
      }

      return true;
    });
  }, [books, buscaTextual, filtroMidia, filtroStatus, filtroPosse]);

  // 2. Ordenação reativa
  const sortedBooks = useMemo(() => {
    const booksToSort = [...filteredBooks];
    return booksToSort.sort((a, b) => {
      switch (sortKey) {
        case 'titulo-asc':
          return a.titulo.localeCompare(b.titulo);
        case 'titulo-desc':
          return b.titulo.localeCompare(a.titulo);
        case 'autor-asc':
          return a.autor.localeCompare(b.autor);
        case 'paginas-desc':
          return (b.total_paginas || 0) - (a.total_paginas || 0);
        case 'paginas-asc':
          return (a.total_paginas || 0) - (b.total_paginas || 0);
        case 'progresso-desc': {
          const percA = a.total_paginas ? ((a.pagina_atual || 0) / a.total_paginas) : 0;
          const percB = b.total_paginas ? ((b.pagina_atual || 0) / b.total_paginas) : 0;
          return percB - percA;
        }
        default:
          return 0;
      }
    });
  }, [filteredBooks, sortKey]);

  // 3. Total de páginas para paginação
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);

  // 4. Reset de paginação ao filtrar, buscar ou reordenar
  useEffect(() => {
    setCurrentPage(1);
  }, [buscaTextual, filtroMidia, filtroStatus, filtroPosse, sortKey]);

  // 5. Garante que a página atual esteja sempre dentro dos limites válidos
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // 6. Dados paginados finais a serem renderizados
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedBooks, currentPage, itemsPerPage]);

  // 7. Função para gerar os números de páginas visíveis (design premium)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre inclui a primeira página
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 3;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 2;
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Sempre inclui a última página
      pages.push(totalPages);
    }

    return pages;
  };

  // 8. Manipulador de mudança de filtro rápido
  const handleFiltroClick = (filtro) => {
    setFiltroRapido(filtro);
  };

  // Função para retornar o ícone da mídia
  const getMediaIcon = (tipo) => {
    switch (tipo) {
      case 'Audiobook':
        return <Volume2 className="h-4 w-4 text-accent" />;
      case 'HQ':
        return <Layers className="h-4 w-4 text-secondary" />;
      case 'Mangá':
        return <Compass className="h-4 w-4 text-warning" />;
      default:
        return <Book className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de Ações Superior (Busca e Filtros Rápidos) */}
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
              className="input input-bordered input-sm w-full pl-9 bg-base-100 text-sm focus:border-primary"
            />
          </div>
          
          <select 
            value={sortKey} 
            onChange={(e) => setSortKey(e.target.value)} 
            className="select select-bordered select-sm bg-base-100 text-xs font-semibold sm:max-w-[200px]"
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

      {/* Tabela de Listagem */}
      <div className="card bg-base-200 border border-base-300 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto w-full max-h-[600px]">

          {filteredBooks.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center max-w-md mx-auto">
              <div className="p-4 bg-base-300 rounded-full text-gray-500 mb-4">
                <Inbox className="h-10 w-10" />
              </div>
              <h4 className="text-md font-bold text-base-content mb-1">Nenhum registro encontrado</h4>
              <p className="text-xs text-gray-400">
                Nenhum livro corresponde à sua busca ou filtro atual na estante do Libris.
              </p>
            </div>
          ) : (
            <table className="table table-md w-full text-left">
              {/* Cabeçalho */}
              <thead className="bg-base-300/40 text-base-content/70 sticky top-0 z-10 border-b border-base-300">
                <tr>
                  <th className="font-bold py-4">Título</th>
                  <th className="font-bold py-4">Autor</th>
                  <th className="font-bold py-4">Mídia</th>
                  <th className="font-bold py-4">Coleção</th>
                  <th className="font-bold py-4">Volume</th>
                  <th className="font-bold py-4">Formato</th>
                  <th className="font-bold py-4 w-1/4">Progresso</th>
                  <th className="font-bold py-4 text-right">Ações</th>
                </tr>
              </thead>

              {/* Linhas de Dados */}
              <tbody className="divide-y divide-base-300/50">
                {paginatedBooks.map((livro) => {
                  // Calcular percentual e definir cor da barra de progresso
                  const percentual = libroProgressoPercent(livro);
                  const isAudio = livro.tipo_midia === 'Audiobook';
                  const unidade = isAudio ? 'min' : 'pág';

                  let progressoTexto = '';
                  let progressClass = 'progress-primary';

                  if (livro.status_leitura === 'Lido') {
                    progressoTexto = 'Lido (100%)';
                    progressClass = 'progress-success';
                  } else if (livro.status_leitura === 'Lendo') {
                    progressoTexto = `${isAudio ? 'Min.' : 'Pág.'} ${livro.pagina_atual}/${livro.total_paginas} (${percentual}%)`;
                    progressClass = 'progress-primary';
                  } else {
                    progressoTexto = 'Não Iniciado (0%)';
                    progressClass = 'progress-warning';
                  }

                  return (
                    <tr key={livro.id} className="hover:bg-base-300/20 transition-colors">
                      {/* Título */}
                      <td className="font-semibold text-base-content max-w-[200px] truncate py-4">
                        {livro.titulo}
                      </td>

                      {/* Autor */}
                      <td className="text-base-content/80 max-w-[150px] truncate py-4">
                        {livro.autor}
                      </td>

                      {/* Tipo de Mídia */}
                      <td className="py-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-base-content/80">
                          {getMediaIcon(livro.tipo_midia)}
                          {livro.tipo_midia}
                        </span>
                      </td>

                      {/* Coleção */}
                      <td className="py-4">
                        {livro.e_colecao && livro.nome_colecao ? (
                          <div
                            className="badge badge-secondary badge-outline text-2xs font-semibold py-2.5 px-2.5 max-w-[150px]"
                            title={livro.nome_colecao}
                          >
                            <span className="truncate w-full text-left">{livro.nome_colecao}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 font-light text-sm">-</span>
                        )}
                      </td>

                      {/* Volume */}
                      <td className="py-4 text-xs font-semibold text-base-content/80">
                        {livro.e_colecao && livro.volume_colecao ? (
                          <span>{livro.volume_colecao}</span>
                        ) : (
                          <span className="text-gray-500 font-light">-</span>
                        )}
                      </td>

                      {/* Formato / Posse */}
                      <td className="py-4">
                        {livro.possui_o_livro ? (
                          <span className={`badge text-2xs font-semibold py-2 px-2.5 border-none ${livro.formato === 'Físico' ? 'bg-primary/15 text-primary' : 'bg-accent/15 text-accent'
                            }`}>
                            {livro.formato}
                          </span>
                        ) : (
                          <span className="badge bg-base-300 text-gray-400 text-2xs font-medium py-2 px-2 border-none">
                            Desejado
                          </span>
                        )}
                      </td>

                      {/* Progresso */}
                      <td className="py-4">
                        <div className="flex flex-col gap-1 w-full max-w-[220px]">
                          <span className="text-2xs font-bold text-base-content/80">{progressoTexto}</span>
                          <progress
                            className={`progress w-full h-2.5 ${progressClass}`}
                            value={livro.status_leitura === 'Lido' ? 100 : percentual}
                            max="100"
                          ></progress>
                        </div>
                      </td>

                      {/* Ações */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Progresso Rápido (Apenas se não lido ou lendo) */}
                          {livro.status_leitura !== 'Lido' && (
                            <div className="join mr-2 shadow-sm">
                              <button
                                onClick={() => onIncrementPage(livro, 10)}
                                className="btn btn-xs btn-outline btn-info font-bold join-item"
                                title={`Incrementar +10 ${unidade}`}
                              >
                                +10
                              </button>
                              <button
                                onClick={() => onIncrementPage(livro, 50)}
                                className="btn btn-xs btn-outline btn-info font-bold join-item"
                                title={`Incrementar +50 ${unidade}`}
                              >
                                +50
                              </button>
                              <button
                                onClick={() => onIncrementPage(livro, livro.total_paginas - livro.pagina_atual)}
                                className="btn btn-xs btn-outline btn-success font-bold join-item"
                                title="Marcar como Lido"
                              >
                                ✓
                              </button>
                            </div>
                          )}

                          {/* Editar */}
                          <button
                            onClick={() => onEdit(livro)}
                            className="btn btn-ghost btn-circle btn-xs md:btn-sm text-info hover:bg-info/15"
                            title="Editar livro"
                          >
                            <Edit3 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          </button>

                          {/* Excluir */}
                          <button
                            onClick={() => onDelete(livro.id)}
                            className="btn btn-ghost btn-circle btn-xs md:btn-sm text-error hover:bg-error/15"
                            title="Remover livro"
                          >
                            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

        </div>

        {/* Painel de Paginação do DaisyUI */}
        {totalPages > 1 && (
          <div className="flex justify-center p-4 bg-base-300/10 border-t border-base-300">
            <div className="join border border-base-300 rounded-xl overflow-hidden shadow-sm">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="join-item btn btn-xs md:btn-sm bg-base-100 text-gray-400 border-none hover:text-white disabled:bg-transparent"
                title="Página Anterior"
              >
                «
              </button>
              
              {getPageNumbers().map((page, idx) => {
                if (page === '...') {
                  return (
                    <span 
                      key={idx} 
                      className="join-item btn btn-xs md:btn-sm btn-disabled bg-base-100 text-gray-500 border-none cursor-default"
                    >
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(page)}
                    className={`join-item btn btn-xs md:btn-sm border-none font-semibold ${
                      currentPage === page 
                        ? 'btn-primary text-white' 
                        : 'bg-base-100 text-gray-400 hover:text-white hover:bg-base-300/50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="join-item btn btn-xs md:btn-sm bg-base-100 text-gray-400 border-none hover:text-white disabled:bg-transparent"
                title="Próxima Página"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Função auxiliar interna
function libroProgressoPercent(livro) {
  if (!livro.total_paginas) return 0;
  return Math.round(((livro.pagina_atual || 0) / livro.total_paginas) * 100);
}
