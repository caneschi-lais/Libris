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
  // Estados de busca e filtros rápidos
  const [buscaTextual, setBuscaTextual] = useState('');
  const [filtroRapido, setFiltroRapido] = useState('todos'); // 'todos' | 'hqs' | 'fisicos_nao_lidos' | 'desejos'
  
  // Estados de ordenação
  const [sortKey, setSortKey] = useState('titulo-asc');
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 8 itens por página para desktop

  // Reset de paginação ao filtrar ou buscar
  useEffect(() => {
    setCurrentPage(1);
  }, [buscaTextual, filtroRapido]);

  // Manipulador de mudança de filtro rápido
  const handleFiltroClick = (filtro) => {
    setFiltroRapido(filtro);
  };

  // Filtragem combinada em tempo real (Busca + Filtro Rápido)
  const filteredBooks = useMemo(() => {
    return books.filter((livro) => {
      // 1. Filtro de Busca Textual (Título, Autor ou Coleção)
      const query = buscaTextual.toLowerCase().trim();
      const bateBusca = !query ||
        livro.titulo.toLowerCase().includes(query) ||
        livro.autor.toLowerCase().includes(query) ||
        (livro.e_colecao && livro.nome_colecao && livro.nome_colecao.toLowerCase().includes(query));

      if (!bateBusca) return false;

      // 2. Filtro Rápido
      switch (filtroRapido) {
        case 'hqs':
          // Apenas HQs (tipo_midia for HQ ou Mangá)
          return livro.tipo_midia === 'HQ' || livro.tipo_midia === 'Mangá';
        case 'fisicos_nao_lidos':
          // Livros Físicos Não Lidos (formato for Físico e status_leitura for Não Lido)
          return livro.possui_o_livro && livro.formato === 'Físico' && livro.status_leitura === 'Não Lido';
        case 'desejos':
          // Lista de Desejos (possui_o_livro for false)
          return !livro.possui_o_livro;
        case 'todos':
        default:
          return true;
      }
    });
  }, [books, buscaTextual, filtroRapido]);

  // Ordenação reativa
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

  // Total de páginas para paginação
  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);

  // Dados paginados finais a serem renderizados
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedBooks, currentPage, itemsPerPage]);

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

        {/* Grupo de Filtros Rápidos (btn-group / join do DaisyUI) */}
        <div className="join self-start xl:self-auto shadow-sm">
          <button
            onClick={() => handleFiltroClick('todos')}
            className={`join-item btn btn-xs md:btn-sm font-semibold border-base-300 ${filtroRapido === 'todos' ? 'btn-primary text-white' : 'bg-base-100 text-gray-400 hover:text-white'
              }`}
          >
            Todos
          </button>
          <button
            onClick={() => handleFiltroClick('hqs')}
            className={`join-item btn btn-xs md:btn-sm font-semibold border-base-300 ${filtroRapido === 'hqs' ? 'btn-secondary text-white' : 'bg-base-100 text-gray-400 hover:text-white'
              }`}
          >
            Apenas HQs
          </button>
          <button
            onClick={() => handleFiltroClick('fisicos_nao_lidos')}
            className={`join-item btn btn-xs md:btn-sm font-semibold border-base-300 ${filtroRapido === 'fisicos_nao_lidos' ? 'btn-accent text-white' : 'bg-base-100 text-gray-400 hover:text-white'
              }`}
          >
            Físicos Não Lidos
          </button>
          <button
            onClick={() => handleFiltroClick('desejos')}
            className={`join-item btn btn-xs md:btn-sm font-semibold border-base-300 ${filtroRapido === 'desejos' ? 'btn-warning text-white' : 'bg-base-100 text-gray-400 hover:text-white'
              }`}
          >
            Lista de Desejos
          </button>
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
              <h4 className="text-md font-bold text-white mb-1">Nenhum registro encontrado</h4>
              <p className="text-xs text-gray-400">
                Nenhum livro corresponde à sua busca ou filtro atual na estante do Libris.
              </p>
            </div>
          ) : (
            <table className="table table-md w-full text-left">
              {/* Cabeçalho */}
              <thead className="bg-base-300/40 text-gray-300 sticky top-0 z-10 border-b border-base-300">
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
                      <td className="font-semibold text-white max-w-[200px] truncate py-4">
                        {livro.titulo}
                      </td>

                      {/* Autor */}
                      <td className="text-gray-300 max-w-[150px] truncate py-4">
                        {livro.autor}
                      </td>

                      {/* Tipo de Mídia */}
                      <td className="py-4">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-gray-300">
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
                      <td className="py-4 text-xs font-semibold text-gray-300">
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
                          <span className="text-2xs font-bold text-gray-300">{progressoTexto}</span>
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
            <div className="join">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="join-item btn btn-xs md:btn-sm btn-outline text-gray-400 disabled:bg-transparent"
              >
                «
              </button>
              <button className="join-item btn btn-xs md:btn-sm bg-base-100 text-xs md:text-sm font-semibold pointer-events-none cursor-default">
                Página {currentPage} de {totalPages}
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="join-item btn btn-xs md:btn-sm btn-outline text-gray-400 disabled:bg-transparent"
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
