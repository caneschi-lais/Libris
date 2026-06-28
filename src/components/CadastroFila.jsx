import React from 'react';
import { ListPlus, Trash2, BookOpen, Save } from 'lucide-react';

/**
 * Subcomponente de fila de cadastro em lote para exibir itens temporários salvos localmente.
 */
export default function CadastroFila({ fila, onRemove, onClear, onSave }) {
  return (
    <div className="lg:col-span-7 flex flex-col animate-fadeIn">
      <div className="card bg-base-200 border border-base-300 rounded-3xl p-6 shadow-xl flex flex-col h-[585px] justify-between">
        
        <div className="flex flex-col overflow-hidden">
          {/* Cabeçalho da Fila */}
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-base-300">
            <div className="flex items-center gap-2">
              <ListPlus className="h-5 w-5 text-secondary" />
              <h3 className="text-lg font-bold text-base-content">Fila de Leituras</h3>
              <span className="badge badge-secondary font-bold text-xs">{fila.length}</span>
            </div>
            {fila.length > 0 && (
              <button 
                onClick={onClear}
                className="btn btn-ghost btn-xs text-error font-semibold hover:bg-error/10 rounded-lg px-2"
              >
                Limpar Fila
              </button>
            )}
          </div>

          {/* Lista de Itens na Fila */}
          {fila.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 border-2 border-dashed border-base-300 rounded-2xl bg-base-300/10">
              <BookOpen className="h-12 w-12 mb-3 opacity-40 text-primary animate-pulse" />
              <p className="text-sm font-semibold text-base-content/85">A fila está vazia</p>
              <p className="text-xs max-w-xs px-4 mt-1">Preencha os dados do formulário ao lado e clique no botão para incluir na fila.</p>
            </div>
          ) : (
            <div className="overflow-y-auto pr-1 flex-1">
              <table className="table w-full text-xs table-pin-rows">
                <thead>
                  <tr className="border-b border-base-300 text-gray-400 bg-base-200">
                    <th className="pl-0 bg-base-200">Obra / Autor</th>
                    <th className="bg-base-200">Mídia</th>
                    <th className="bg-base-200">Progresso</th>
                    <th className="pr-0 text-right bg-base-200">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {fila.map((livro, idx) => (
                    <tr key={livro.tempId || idx} className="hover:bg-base-300/20 border-b border-base-300/40">
                      <td className="pl-0 max-w-[200px] py-3">
                        <span className="font-semibold text-base-content block truncate" title={livro.titulo}>{livro.titulo}</span>
                        <span className="text-[10px] text-gray-400 block truncate" title={livro.autor}>{livro.autor}</span>
                      </td>
                      <td className="py-3">
                        <span className={`badge badge-outline text-[9px] px-1.5 py-0.5 h-fit font-bold rounded-lg ${
                          livro.tipo_midia === 'Livro' ? 'text-primary border-primary/40' :
                          livro.tipo_midia === 'HQ' ? 'text-secondary border-secondary/40' :
                          livro.tipo_midia === 'Mangá' ? 'text-purple-400 border-purple-400/40' :
                          'text-cyan-400 border-cyan-400/40'
                        }`}>
                          {livro.tipo_midia}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col">
                          <span className={`font-semibold ${
                            livro.status_leitura === 'Lido' ? 'text-success' :
                            livro.status_leitura === 'Lendo' ? 'text-primary' :
                            'text-gray-400'
                          }`}>{livro.status_leitura}</span>
                          <span className="text-[10px] text-gray-400">
                            {livro.pagina_atual}/{livro.total_paginas} {livro.tipo_midia === 'Audiobook' ? 'min' : 'pág.'}
                          </span>
                        </div>
                      </td>
                      <td className="pr-0 text-right py-3">
                        <button 
                          onClick={() => onRemove(idx)}
                          className="btn btn-ghost btn-xs btn-square text-error hover:bg-error/15 rounded-lg"
                          title="Remover da Fila"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Ações de salvamento (se existirem itens) */}
        {fila.length > 0 && (
          <div className="pt-4 border-t border-base-300 flex justify-between items-center bg-base-200">
            <span className="text-xs text-gray-400">
              Total na fila: <strong>{fila.length}</strong> {fila.length === 1 ? 'leitura' : 'leituras'}.
            </span>
            <button 
              onClick={onSave}
              className="btn btn-primary btn-sm font-bold text-white shadow-md flex items-center gap-1.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform"
            >
              <Save className="h-4 w-4" /> Salvar Fila ({fila.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
