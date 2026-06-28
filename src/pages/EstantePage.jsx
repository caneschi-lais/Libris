import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBooksContext } from '../context/BooksContext';
import BookTable from '../components/BookTable';
import BookForm from '../components/BookForm';
import { Plus, Bookmark, Download, Upload } from 'lucide-react';
import { criarLivro, validarLivro } from '../models/book';

export default function EstantePage() {
  const { 
    books, 
    atualizarLivro, 
    removerLivro,
    importarLivros,
    isLoading
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

  // Exportar backup completo dos livros em formato JSON
  const handleExportarBackup = () => {
    try {
      const jsonString = JSON.stringify(books, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const dataHoje = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `libris_backup_${dataHoje}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao exportar backup:", err);
      alert("Erro ao exportar backup: " + err.message);
    }
  };

  // Importar backup de arquivo JSON selecionado
  const handleImportarBackup = (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = (event) => {
      try {
        const importados = JSON.parse(event.target.result);
        
        if (!Array.isArray(importados)) {
          alert("Erro: O arquivo de backup deve conter uma lista de livros (array).");
          return;
        }

        const confirmou = window.confirm(
          `Deseja importar ${importados.length} livros? Isso substituirá todas as leituras atuais da sua estante.`
        );
        
        if (!confirmou) {
          e.target.value = '';
          return;
        }

        const livrosValidados = [];
        const erros = [];

        importados.forEach((item, index) => {
          const livro = criarLivro(item);
          const { valido, erros: errosLivro } = validarLivro(livro);
          
          if (valido) {
            livrosValidados.push(livro);
          } else {
            erros.push(`Linha ${index + 1} ("${item.titulo || 'Sem Título'}"): ${errosLivro.join(', ')}`);
          }
        });

        if (erros.length > 0) {
          const continuar = window.confirm(
            `Ocorreram erros de validação em alguns livros do backup:\n\n${erros.slice(0, 5).join('\n')}${erros.length > 5 ? `\n...e mais ${erros.length - 5} erros.` : ''}\n\nDeseja ignorar esses erros e importar apenas as ${livrosValidados.length} leituras válidas?`
          );
          if (!continuar) {
            e.target.value = '';
            return;
          }
        }

        if (livrosValidados.length === 0) {
          alert("Nenhuma leitura válida encontrada no arquivo JSON.");
          e.target.value = '';
          return;
        }

        importarLivros(livrosValidados);
        alert(`${livrosValidados.length} leituras importadas com sucesso!`);
      } catch (err) {
        alert("Erro ao ler/processar arquivo JSON: " + err.message);
      }
      e.target.value = ''; // Reseta input para permitir importar o mesmo arquivo consecutivamente se necessário
    };
    leitor.readAsText(arquivo);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Cabeçalho da Estante */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-base-300 pb-4 gap-4">
        <h2 className="text-2xl md:text-3xl font-extrabold text-base-content flex items-center gap-2">
          <Bookmark className="h-7 w-7 text-primary" /> Minha Estante
        </h2>
        
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Dropdown de Backup */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline btn-sm md:btn-md font-semibold text-base-content/80 border-base-300">
              Backup
            </div>
            <ul tabIndex={0} className="dropdown-content z-[20] menu p-2 shadow-2xl bg-base-200 border border-base-300 rounded-2xl w-52 mt-1 space-y-1">
              <li>
                <button 
                  onClick={handleExportarBackup} 
                  className="text-xs font-semibold py-2.5 flex items-center gap-2 text-base-content hover:bg-base-300"
                >
                  <Download className="h-4 w-4 text-primary" /> Exportar JSON
                </button>
              </li>
              <li>
                <label className="text-xs font-semibold py-2.5 flex items-center gap-2 text-base-content hover:bg-base-300 cursor-pointer">
                  <Upload className="h-4 w-4 text-secondary" /> Importar JSON
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImportarBackup} 
                    className="hidden" 
                  />
                </label>
              </li>
            </ul>
          </div>

          {/* Link para o formulário de cadastro */}
          <Link 
            to="/cadastro" 
            className="btn btn-primary btn-sm md:btn-md font-bold shadow-md flex items-center gap-1.5 text-white"
          >
            <Plus className="h-4 w-4" /> Novo Livro
          </Link>
        </div>
      </div>

      {/* Tabela de Listagem / Estado de Carregamento */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4 bg-base-200 border border-base-300 rounded-3xl shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm text-gray-400 font-semibold animate-pulse">Carregando estante de livros...</p>
        </div>
      ) : (
        <BookTable
          books={books}
          onEdit={setLivroEmEdicao}
          onDelete={removerLivro}
          onIncrementPage={handleIncrementPage}
        />
      )}

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
              onSubmit={async (novosDados) => {
                const resultado = await atualizarLivro(livroEmEdicao.id, novosDados);
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
