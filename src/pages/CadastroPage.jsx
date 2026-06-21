import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooksContext } from '../context/BooksContext';
import BookForm from '../components/BookForm';
import { PlusCircle, ListPlus, Trash2, BookOpen, Save, Check, AlertCircle } from 'lucide-react';

export default function CadastroPage() {
  const { adicionarLivro, adicionarLivros } = useBooksContext();
  const navigate = useNavigate();

  // Estados para gerenciar o modo de cadastro e a fila
  const [modo, setModo] = useState('individual'); // 'individual' ou 'lote'
  const [fila, setFila] = useState([]);
  const [formKey, setFormKey] = useState(0); // Usado para forçar o reset do BookForm
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errosLote, setErrosLote] = useState([]);

  const handleSubmit = (dadosForm) => {
    if (modo === 'individual') {
      const resultado = adicionarLivro(dadosForm);
      if (resultado.success) {
        navigate('/estante');
      }
    } else {
      // Modo em Lote: Adiciona à fila local e reseta o formulário
      const novoLivroFila = {
        ...dadosForm,
        tempId: Math.random().toString(36).substring(2, 9)
      };
      
      setFila((prev) => [...prev, novoLivroFila]);
      setFormKey((prev) => prev + 1); // Força reinstanciação do form resetando todos os estados internos
      setErrosLote([]);

      // Notificação de sucesso temporária
      setFeedbackMessage(`"${dadosForm.titulo}" adicionado à fila!`);
      setTimeout(() => {
        setFeedbackMessage('');
      }, 3000);
    }
  };

  const removerDaFila = (idxRemover) => {
    setFila((prev) => prev.filter((_, idx) => idx !== idxRemover));
  };

  const handleSalvarTodos = () => {
    if (fila.length === 0) return;

    // eslint-disable-next-line no-unused-vars
    const livrosParaSalvar = fila.map(({ tempId, ...rest }) => rest);
    const resultado = adicionarLivros(livrosParaSalvar);

    if (!resultado.success) {
      setErrosLote(resultado.errors);
    } else {
      navigate('/estante');
    }
  };

  return (
    <div className={`w-full py-6 space-y-6 animate-fadeIn mx-auto transition-all duration-300 ${modo === 'lote' ? 'max-w-6xl' : 'max-w-2xl'}`}>
      {/* Barra superior de controle */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-base-300 pb-4">
        <Link 
          to="/estante" 
          className="btn btn-ghost btn-sm text-gray-400 hover:text-white font-medium px-2 normal-case w-fit"
        >
          ← Voltar para a Estante
        </Link>

        {/* Abas Premium para Troca de Modo */}
        <div className="tabs tabs-boxed bg-base-300 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => {
              setModo('individual');
              setErrosLote([]);
            }} 
            className={`tab tab-md rounded-xl font-bold transition-all ${modo === 'individual' ? 'tab-active bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Cadastro Individual
          </button>
          <button 
            onClick={() => setModo('lote')} 
            className={`tab tab-md rounded-xl font-bold transition-all ${modo === 'lote' ? 'tab-active bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Cadastro em Lote
            {fila.length > 0 && (
              <span className="badge badge-secondary badge-sm ml-1.5 font-extrabold">{fila.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Alerta de erro de lote */}
      {errosLote.length > 0 && (
        <div className="alert alert-error shadow-md text-xs py-3 rounded-2xl flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold block mb-1">Ocorreram erros ao salvar a fila:</span>
            <ul className="list-disc list-inside space-y-0.5">
              {errosLote.map((erro, idx) => <li key={idx}>{erro}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Layout de Conteúdo (Grid de 2 colunas para lote, coluna simples para individual) */}
      <div className={modo === 'lote' ? 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start' : ''}>
        
        {/* Formulário de Livro */}
        <div className={modo === 'lote' ? 'lg:col-span-5' : ''}>
          <div className="card bg-base-200 border border-base-300 rounded-3xl p-6 md:p-8 shadow-xl relative">
            
            {/* Notificação discreta de inclusão na fila */}
            {feedbackMessage && (
              <div className="absolute top-4 right-4 bg-success/20 border border-success/40 text-success text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md animate-fadeIn z-10">
                <Check className="h-3 w-3" /> {feedbackMessage}
              </div>
            )}

            <div className="flex items-center gap-2 mb-6 text-primary">
              <PlusCircle className="h-6 w-6" />
              <h2 className="text-xl font-bold text-white">
                {modo === 'lote' ? 'Adicionar à Fila' : 'Adicionar Livro / Mídia'}
              </h2>
            </div>

            <BookForm 
              key={formKey}
              onSubmit={handleSubmit}
              submitLabel={modo === 'lote' ? 'Adicionar à Fila' : 'Cadastrar Leituras'}
              onCancel={() => navigate('/estante')}
            />
          </div>
        </div>

        {/* Fila de Cadastro à Direita (apenas no modo lote) */}
        {modo === 'lote' && (
          <div className="lg:col-span-7 flex flex-col animate-fadeIn">
            <div className="card bg-base-200 border border-base-300 rounded-3xl p-6 shadow-xl flex flex-col h-[585px] justify-between">
              
              <div className="flex flex-col overflow-hidden">
                {/* Cabeçalho da Fila */}
                <div className="flex justify-between items-center mb-6 pb-3 border-b border-base-300">
                  <div className="flex items-center gap-2">
                    <ListPlus className="h-5 w-5 text-secondary" />
                    <h3 className="text-lg font-bold text-white">Fila de Leituras</h3>
                    <span className="badge badge-secondary font-bold text-xs">{fila.length}</span>
                  </div>
                  {fila.length > 0 && (
                    <button 
                      onClick={() => setFila([])}
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
                    <p className="text-sm font-semibold text-gray-300">A fila está vazia</p>
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
                              <span className="font-semibold text-white block truncate" title={livro.titulo}>{livro.titulo}</span>
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
                                onClick={() => removerDaFila(idx)}
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
                    onClick={handleSalvarTodos}
                    className="btn btn-primary btn-sm font-bold text-white shadow-md flex items-center gap-1.5 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    <Save className="h-4 w-4" /> Salvar Fila ({fila.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

