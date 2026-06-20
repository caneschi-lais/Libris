import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooksContext } from '../context/BooksContext';
import BookForm from '../components/BookForm';
import { PlusCircle } from 'lucide-react';

export default function CadastroPage() {
  const { adicionarLivro } = useBooksContext();
  const navigate = useNavigate();
  
  // Estado local para mensagem de feedback/sucesso antes de redirecionar
  const [sucessoMsg, setSucessoMsg] = useState('');

  const handleSubmit = (dadosForm) => {
    const resultado = adicionarLivro(dadosForm);
    if (resultado.success) {
      setSucessoMsg(`"${resultado.book.titulo}" adicionado com sucesso! Redirecionando...`);
      // Redireciona de volta para a estante após 1.5s
      setTimeout(() => {
        setSucessoMsg('');
        navigate('/estante');
      }, 1500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-6 space-y-6 animate-fadeIn">
      {/* Alerta de Sucesso */}
      {sucessoMsg && (
        <div className="alert alert-success shadow-lg text-sm font-semibold py-3">
          <span>{sucessoMsg}</span>
        </div>
      )}

      {/* Card do Formulário */}
      <div className="card bg-base-200 border border-base-300 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-6 text-primary">
          <PlusCircle className="h-6 w-6" />
          <h2 className="text-xl font-bold text-white">Adicionar Livro / Mídia</h2>
        </div>

        <BookForm 
          onSubmit={handleSubmit}
          onCancel={() => navigate('/estante')}
        />
      </div>
    </div>
  );
}
