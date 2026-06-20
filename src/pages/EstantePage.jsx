import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooksContext } from '../context/BooksContext';
import BookTable from '../components/BookTable';
import BookForm from '../components/BookForm';
import { Plus, Bookmark } from 'lucide-react';

export default function EstantePage() {
  const { 
    books, 
    atualizarLivro, 
    removerLivro 
  } = useBooksContext();

  // Estado local para controle do modal de edição
  const [livroEmEdicao, setLivroEmEdicao] = useState(null);

  // Manipulador de incremento de progresso rápido de leitura
  const handleIncrementPage = (livro, quant) => {
    const novaPagina = Math.min(livro.total_paginas, (livro.pagina_atual || 0) + quant);
    const novoStatus = novaPagina === livro.total_paginas ? 'Lido' : 'Lendo';
    
    atualizarLivro(livro.id, {
      pagina_atual: novaPagina,
      status_leitura: novoStatus,
      data_termino: novoStatus === 'Lido' ? new Date().toISOString().split('T')[0] : livro.data_termino
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabeçalho da Estante */}
      <div className="flex justify-between items-center border-b border-base-300 pb-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
          <Bookmark className="h-7 w-7 text-primary" /> Minha Estante
        </h2>
        
        {/* Link para o formulário de cadastro */}
        <Link 
          to="/cadastro" 
          className="btn btn-primary btn-sm md:btn-md font-bold shadow-md flex items-center gap-1.5 text-white"
        >
          <Plus className="h-4 w-4" /> Novo Livro
        </Link>
      </div>

      {/* Tabela de Listagem */}
      <BookTable
        books={books}
        onEdit={setLivroEmEdicao}
        onDelete={removerLivro}
        onIncrementPage={handleIncrementPage}
      />

      {/* Modal de Edição In-Place */}
      {livroEmEdicao && (
        <div className="modal modal-open animate-fadeIn">
          <div className="modal-box bg-base-200 border border-base-300 max-w-2xl shadow-2xl rounded-3xl relative p-6">
            <button 
              onClick={() => setLivroEmEdicao(null)} 
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <BookForm
              livro={livroEmEdicao}
              onCancel={() => setLivroEmEdicao(null)}
              onSubmit={(novosDados) => {
                const resultado = atualizarLivro(livroEmEdicao.id, novosDados);
                if (resultado.success) {
                  setLivroEmEdicao(null);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
