import React, { useState, useEffect } from 'react';
import { Plus, Check, X, BookOpen, AlertCircle } from 'lucide-react';
import MediaProgressFields from './MediaProgressFields';
import CollectionFields from './CollectionFields';

/**
 * Componente de Formulário para Cadastrar ou Editar um livro no Libris.
 * 
 * @param {Object} props
 * @param {Object} [props.livro] - Objeto livro se estiver em modo de edição
 * @param {Function} props.onSubmit - Callback disparado ao submeter dados válidos
 * @param {Function} [props.onCancel] - Callback opcional para cancelar/fechar formulário
 */
export default function BookForm({ livro, onSubmit, onCancel, submitLabel }) {
  const isEditing = !!livro;

  // Estados dos campos do formulário
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [tipoMidia, setTipoMidia] = useState('Livro');
  const [totalPaginas, setTotalPaginas] = useState('');
  const [statusLeitura, setStatusLeitura] = useState('Não Lido');
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [dataInicio, setDataInicio] = useState('');
  const [dataTermino, setDataTermino] = useState('');
  const [possuiLivro, setPossuiLivro] = useState(false);
  const [formato, setFormato] = useState('Físico');
  const [eColecao, setEColecao] = useState(false);
  const [nomeColecao, setNomeColecao] = useState('');
  const [volumeColecao, setVolumeColecao] = useState('');

  // Estados de erro
  const [erros, setErros] = useState([]);

  // Efeito para preencher os dados ao entrar em modo edição ou resetar ao cadastrar
  useEffect(() => {
    if (livro) {
      setTitulo(livro.titulo || '');
      setAutor(livro.autor || '');
      setTipoMidia(livro.tipo_midia || 'Livro');
      setTotalPaginas(livro.total_paginas || '');
      setStatusLeitura(livro.status_leitura || 'Não Lido');
      setPaginaAtual(livro.pagina_atual || 0);
      setDataInicio(livro.data_inicio || '');
      setDataTermino(livro.data_termino || '');
      setPossuiLivro(livro.possui_o_livro || false);
      setFormato(livro.formato || 'Físico');
      setEColecao(livro.e_colecao || false);
      setNomeColecao(livro.nome_colecao || '');
      setVolumeColecao(livro.volume_colecao || '');
      setErros([]);
    } else {
      // Valores padrão para novo livro
      setTitulo('');
      setAutor('');
      setTipoMidia('Livro');
      setTotalPaginas('');
      setStatusLeitura('Não Lido');
      setPaginaAtual(0);
      setDataInicio('');
      setDataTermino('');
      setPossuiLivro(false);
      setFormato('Físico');
      setEColecao(false);
      setNomeColecao('');
      setVolumeColecao('');
      setErros([]);
    }
  }, [livro]);

  // Efeito para ajustar campos automáticos quando o status muda
  useEffect(() => {
    if (statusLeitura === 'Não Lido') {
      setPaginaAtual(0);
      setDataInicio('');
      setDataTermino('');
    } else if (statusLeitura === 'Lido') {
      if (totalPaginas) {
        setPaginaAtual(Number(totalPaginas));
      }
    }
  }, [statusLeitura, totalPaginas]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errosValidacao = [];

    const total = Number(totalPaginas);
    const atual = statusLeitura === 'Lido' ? total : Number(paginaAtual);

    // Validações
    if (statusLeitura === 'Lendo' && atual > total) {
      errosValidacao.push(`A página atual (${atual}) não pode ser maior que o total de páginas (${total}).`);
    }

    if (statusLeitura === 'Lido' && dataInicio && dataTermino) {
      const inicio = new Date(dataInicio);
      const termino = new Date(dataTermino);
      if (termino < inicio) {
        errosValidacao.push('A data de término não pode ser anterior à data de início.');
      }
    }

    if (errosValidacao.length > 0) {
      setErros(errosValidacao);
      return;
    }

    // Estruturação dos dados finais
    const dadosLivro = {
      titulo: titulo.trim(),
      autor: autor.trim(),
      tipo_midia: tipoMidia,
      total_paginas: total,
      status_leitura: statusLeitura,
      pagina_atual: statusLeitura === 'Não Lido' ? 0 : atual,
      data_inicio: statusLeitura !== 'Não Lido' && dataInicio ? dataInicio : undefined,
      data_termino: statusLeitura === 'Lido' && dataTermino ? dataTermino : undefined,
      possui_o_livro: possuiLivro,
      formato: possuiLivro ? formato : undefined,
      e_colecao: eColecao,
      nome_colecao: eColecao ? nomeColecao.trim() : undefined,
      volume_colecao: eColecao ? volumeColecao.trim() : undefined,
    };

    // Caso seja edição, preservamos o ID original
    if (isEditing) {
      dadosLivro.id = livro.id;
    }

    setErros([]);
    onSubmit(dadosLivro);
  };

  return (
    <div className="w-full">
      {/* Cabeçalho de status do form */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          {isEditing ? `Editar: ${livro.titulo}` : 'Cadastrar Novo Livro / Mídia'}
        </h3>
        <p className="text-xs text-gray-400">Preencha os dados abaixo de acordo com a sua leitura</p>
      </div>

      {/* Alertas de Erro */}
      {erros.length > 0 && (
        <div className="alert alert-error shadow-md text-xs py-3 mb-4 rounded-xl flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold block mb-1">Por favor, corrija os erros:</span>
            <ul className="list-disc list-inside space-y-0.5">
              {erros.map((erro, idx) => <li key={idx}>{erro}</li>)}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Título */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-semibold text-gray-300">Título *</span>
          </label>
          <input
            type="text"
            placeholder="Ex: O Hobbit"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="input input-bordered w-full bg-base-100/50 text-sm focus:border-primary"
            required
          />
        </div>

        {/* Autor */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text font-semibold text-gray-300">Autor *</span>
          </label>
          <input
            type="text"
            placeholder="Ex: J.R.R. Tolkien"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className="input input-bordered w-full bg-base-100/50 text-sm focus:border-primary"
            required
          />
        </div>

        {/* Mídia, Status e Progresso de Leitura */}
        <MediaProgressFields
          tipoMidia={tipoMidia}
          setTipoMidia={setTipoMidia}
          statusLeitura={statusLeitura}
          setStatusLeitura={setStatusLeitura}
          totalPaginas={totalPaginas}
          setTotalPaginas={setTotalPaginas}
          paginaAtual={paginaAtual}
          setPaginaAtual={setPaginaAtual}
          dataInicio={dataInicio}
          setDataInicio={setDataInicio}
          dataTermino={dataTermino}
          setDataTermino={setDataTermino}
        />

        {/* Toggles de Posse e Coleção */}
        <CollectionFields
          possuiLivro={possuiLivro}
          setPossuiLivro={setPossuiLivro}
          formato={formato}
          setFormato={setFormato}
          eColecao={eColecao}
          setEColecao={setEColecao}
          nomeColecao={nomeColecao}
          setNomeColecao={setNomeColecao}
          volumeColecao={volumeColecao}
          setVolumeColecao={setVolumeColecao}
        />

        {/* Ações do Formulário */}
        <div className="flex gap-2 justify-end pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-ghost text-xs gap-1"
            >
              <X className="h-4 w-4" /> Cancelar
            </button>
          )}
          <button
            type="submit"
            className={`btn ${isEditing ? 'btn-success text-white' : 'btn-primary'} text-xs gap-1`}
          >
            {isEditing ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {submitLabel || (isEditing ? 'Salvar Alterações' : 'Cadastrar Leituras')}
          </button>
        </div>
      </form>
    </div>
  );
}
