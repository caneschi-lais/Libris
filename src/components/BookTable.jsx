import React, { useState, useMemo, useEffect } from 'react';
import { Inbox } from 'lucide-react';
import BookTableFilters from './BookTableFilters';
import BookTableRow from './BookTableRow';
import Pagination from './Pagination';

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

  return (
    <div className="space-y-4">
      {/* Barra de Ações Superior (Busca e Filtros Rápidos) */}
      <BookTableFilters
        buscaTextual={buscaTextual}
        setBuscaTextual={setBuscaTextual}
        sortKey={sortKey}
        setSortKey={setSortKey}
        filtroMidia={filtroMidia}
        setFiltroMidia={setFiltroMidia}
        filtroStatus={filtroStatus}
        setFiltroStatus={setFiltroStatus}
        filtroPosse={filtroPosse}
        setFiltroPosse={setFiltroPosse}
      />

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
                  <th className="font-bold py-4">Páginas</th>
                  <th className="font-bold py-4 w-1/4">Progresso</th>
                  <th className="font-bold py-4 text-right">Ações</th>
                </tr>
              </thead>

              {/* Linhas de Dados */}
              <tbody className="divide-y divide-base-300/50">
                {paginatedBooks.map((livro) => (
                  <BookTableRow
                    key={livro.id}
                    livro={livro}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onIncrementPage={onIncrementPage}
                  />
                ))}
              </tbody>
            </table>
          )}

        </div>

        {/* Painel de Paginação */}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
