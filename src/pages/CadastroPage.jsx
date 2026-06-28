import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooksContext } from '../context/BooksContext';
import BookForm from '../components/BookForm';
import CadastroFila from '../components/CadastroFila';
import { PlusCircle, Check, AlertCircle } from 'lucide-react';

export default function CadastroPage() {
  const { adicionarLivro, adicionarLivros } = useBooksContext();
  const navigate = useNavigate();

  // Estados para gerenciar o modo de cadastro e a fila
  const [modo, setModo] = useState('individual'); // 'individual' ou 'lote'
  const [fila, setFila] = useState([]);
  const [formKey, setFormKey] = useState(0); // Usado para forçar o reset do BookForm
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errosLote, setErrosLote] = useState([]);

  const handleSubmit = async (dadosForm) => {
    if (modo === 'individual') {
      const resultado = await adicionarLivro(dadosForm);
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

  const handleSalvarTodos = async () => {
    if (fila.length === 0) return;

    // eslint-disable-next-line no-unused-vars
    const livrosParaSalvar = fila.map(({ tempId, ...rest }) => rest);
    const resultado = await adicionarLivros(livrosParaSalvar);

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
          className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content font-medium px-2 normal-case w-fit"
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
              <h2 className="text-xl font-bold text-base-content">
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
          <CadastroFila
            fila={fila}
            onRemove={removerDaFila}
            onClear={() => setFila([])}
            onSave={handleSalvarTodos}
          />
        )}
      </div>
    </div>
  );
}

