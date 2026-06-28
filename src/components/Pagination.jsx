import React from 'react';

/**
 * Subcomponente para gerenciar a paginação da listagem de livros na estante.
 */
export default function Pagination({ currentPage, setCurrentPage, totalPages }) {
  // Lógica para determinar os números das páginas a serem exibidos (com reticências)
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

  if (totalPages <= 1) return null;

  return (
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
  );
}
