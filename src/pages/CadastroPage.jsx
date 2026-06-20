import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooksContext } from '../context/BooksContext';
import BookForm from '../components/BookForm';
import { PlusCircle } from 'lucide-react';

export default function CadastroPage() {
  const { adicionarLivro } = useBooksContext();
  const navigate = useNavigate();

  const handleSubmit = (dadosForm) => {
    const resultado = adicionarLivro(dadosForm);
    if (resultado.success) {
      // Dispara o redirecionamento automático imediato de volta para a estante
      navigate('/estante');
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-6 space-y-4 animate-fadeIn">
      {/* Botão discreto no topo para voltar */}
      <div className="flex justify-start">
        <Link 
          to="/estante" 
          className="btn btn-ghost btn-sm text-gray-400 hover:text-white font-medium px-2 normal-case"
        >
          ← Voltar para a Estante
        </Link>
      </div>

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
