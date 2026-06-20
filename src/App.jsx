import React, { useState } from 'react';
import { useBooks } from './hooks/useBooks';
import BookForm from './components/BookForm';
import BookTable from './components/BookTable';
import Dashboard from './components/Dashboard';
import { 
  BookOpen, 
  TrendingUp, 
  Sparkles, 
  Inbox,
  Volume2,
  Layers,
  Compass,
  Book,
  CheckCircle
} from 'lucide-react';

export default function App() {
  const { 
    books, 
    adicionarLivro, 
    atualizarLivro, 
    removerLivro, 
    metrics 
  } = useBooks();

  // Estado para controle do modal de edição
  const [livroEmEdicao, setLivroEmEdicao] = useState(null);
  
  // Estado para feedback de sucesso
  const [sucessoMsg, setSucessoMsg] = useState('');

  // Estado para controle de aba ativa
  const [abaAtiva, setAbaAtiva] = useState('estante'); // 'estante' | 'dashboard'

  const handleIncrementPage = (livro, quant) => {
    const novaPagina = Math.min(livro.total_paginas, (livro.pagina_atual || 0) + quant);
    const novoStatus = novaPagina === livro.total_paginas ? 'Lido' : 'Lendo';
    
    atualizarLivro(livro.id, {
      pagina_atual: novaPagina,
      status_leitura: novoStatus,
      data_termino: novoStatus === 'Lido' ? new Date().toISOString().split('T')[0] : livro.data_termino
    });
  };

  const getMediaIcon = (tipo) => {
    switch (tipo) {
      case 'Audiobook':
        return <Volume2 className="h-5 w-5 text-accent" />;
      case 'HQ':
        return <Layers className="h-5 w-5 text-secondary" />;
      case 'Mangá':
        return <Compass className="h-5 w-5 text-warning" />;
      default:
        return <Book className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Navbar Premium */}
      <header className="navbar bg-base-200 border-b border-base-300 px-6 py-4 shadow-md">
        <div className="flex-1 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-primary to-secondary rounded-xl text-white shadow-lg">
            <BookOpen className="h-8 w-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Libris <span className="badge badge-accent badge-sm font-semibold py-2">Métricas e Leituras</span>
            </h1>
            <p className="text-xs text-gray-400">Seu gerenciador pessoal de leitura focado em dados</p>
          </div>
        </div>
        <div className="flex-none gap-2">
          <span className="text-sm font-medium text-gray-300">Olá, Leitor! 👋</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Painel de Métricas */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-base-200 shadow-xl border border-base-300 hover:border-primary/30 transition-all duration-300">
            <div className="card-body py-4 flex flex-row items-center justify-between">
              <div>
                <span className="text-gray-400 text-sm font-semibold">Total de Leituras</span>
                <h3 className="text-3xl font-extrabold text-white mt-1">{metrics.totalLivros}</h3>
                <span className="text-xs text-gray-500 mt-2 block">Cadastrados na estante</span>
              </div>
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <Inbox className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl border border-base-300 hover:border-success/30 transition-all duration-300">
            <div className="card-body py-4 flex flex-row items-center justify-between">
              <div>
                <span className="text-gray-400 text-sm font-semibold">Lidos / Lendo / Não Lido</span>
                <h3 className="text-2xl font-extrabold text-white mt-1">
                  <span className="text-success">{metrics.livrosLidos}</span>
                  <span className="text-gray-500 mx-1">/</span>
                  <span className="text-info">{metrics.livrosLendo}</span>
                  <span className="text-gray-500 mx-1">/</span>
                  <span className="text-warning">{metrics.livrosNaoLidos}</span>
                </h3>
                <span className="text-xs text-gray-500 mt-2 block">Distribuição por status</span>
              </div>
              <div className="p-4 bg-success/10 rounded-full text-success">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl border border-base-300 hover:border-accent/30 transition-all duration-300">
            <div className="card-body py-4 flex flex-row items-center justify-between">
              <div>
                <span className="text-gray-400 text-sm font-semibold">Páginas Lidas</span>
                <h3 className="text-3xl font-extrabold text-white mt-1">
                  {metrics.totalPaginasLidas} <span className="text-xs text-gray-400 font-normal">/ {metrics.totalPaginasEstimadas}</span>
                </h3>
                <div className="mt-2 w-36">
                  <div className="flex justify-between text-2xs mb-1">
                    <span>Progresso total</span>
                    <span className="font-bold text-accent">{metrics.percentualLido}%</span>
                  </div>
                  <progress className="progress progress-accent w-full" value={metrics.percentualLido} max="100"></progress>
                </div>
              </div>
              <div className="p-4 bg-accent/10 rounded-full text-accent self-start">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl border border-base-300 hover:border-secondary/30 transition-all duration-300">
            <div className="card-body py-4 flex flex-row items-center justify-between">
              <div>
                <span className="text-gray-400 text-sm font-semibold">Tipos de Mídia</span>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1 text-xs">
                  <span className="text-primary font-semibold">📚 Livros: {metrics.porMidia.Livro}</span>
                  <span className="text-secondary font-semibold">🎨 HQs: {metrics.porMidia.HQ}</span>
                  <span className="text-warning font-semibold">⛩️ Mangás: {metrics.porMidia.Mangá}</span>
                  <span className="text-accent font-semibold">🎧 Audios: {metrics.porMidia.Audiobook}</span>
                </div>
              </div>
              <div className="p-3 bg-secondary/10 rounded-full text-secondary self-start">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>
        </section>

        {/* Abas de Navegação */}
        <div className="flex justify-center mb-6">
          <div className="tabs tabs-boxed bg-base-200 p-1 border border-base-300 rounded-2xl shadow-inner">
            <button
              onClick={() => setAbaAtiva('estante')}
              className={`tab tab-md rounded-xl font-bold transition-all px-6 ${
                abaAtiva === 'estante' ? 'tab-active bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              📚 Minha Estante
            </button>
            <button
              onClick={() => setAbaAtiva('dashboard')}
              className={`tab tab-md rounded-xl font-bold transition-all px-6 ${
                abaAtiva === 'dashboard' ? 'tab-active bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              📊 Dashboard & Estatísticas
            </button>
          </div>
        </div>

        {/* Exibição Condicional de Abas */}
        {abaAtiva === 'estante' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            {/* Coluna do Formulário de Cadastro (4 colunas) */}
            <section className="lg:col-span-4 bg-base-200 border border-base-300 rounded-3xl p-6 shadow-xl">
              {/* Avisos de Sucesso */}
              {sucessoMsg && (
                <div className="alert alert-success shadow-lg mb-4 text-sm font-medium py-3">
                  <span>{sucessoMsg}</span>
                </div>
              )}

              <BookForm 
                onSubmit={(dadosForm) => {
                  const resultado = adicionarLivro(dadosForm);
                  if (resultado.success) {
                    setSucessoMsg(`"${resultado.book.titulo}" adicionado com sucesso!`);
                    setTimeout(() => setSucessoMsg(''), 3000);
                  }
                }}
              />
            </section>

            {/* Coluna da Listagem de Livros em Tabela (8 colunas) */}
            <section className="lg:col-span-8 space-y-4">
              <BookTable
                books={books}
                onEdit={setLivroEmEdicao}
                onDelete={removerLivro}
                onIncrementPage={handleIncrementPage}
              />
            </section>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <Dashboard books={books} />
          </div>
        )}
      </main>

      {/* Modal de Edição */}
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
                  setSucessoMsg(`"${resultado.book.titulo}" atualizado com sucesso!`);
                  setTimeout(() => setSucessoMsg(''), 3000);
                  setLivroEmEdicao(null);
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Footer Premium */}
      <footer className="footer footer-center p-4 bg-base-200 text-base-content border-t border-base-300 mt-12">
        <aside>
          <p className="text-xs text-gray-500">Libris © {new Date().getFullYear()} — Desenvolvido como Gerenciador Pessoal de Leituras & Métricas</p>
        </aside>
      </footer>
    </div>
  );
}

// Os ajudantes auxiliares foram movidos para dentro do BookTable.jsx
