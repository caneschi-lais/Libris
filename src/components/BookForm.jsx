import React, { useState, useEffect } from 'react';
import { TIPOS_MIDIA, STATUS_LEITURA, FORMATOS } from '../models/book';
import { Plus, Check, X, BookOpen, AlertCircle } from 'lucide-react';

/**
 * Componente de Formulário para Cadastrar ou Editar um livro no Libris.
 * 
 * @param {Object} props
 * @param {Object} [props.livro] - Objeto livro se estiver em modo de edição
 * @param {Function} props.onSubmit - Callback disparado ao submeter dados válidos
 * @param {Function} [props.onCancel] - Callback opcional para cancelar/fechar formulário
 */
export default function BookForm({ livro, onSubmit, onCancel }) {
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
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
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

        {/* Mídia e Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-gray-300">Tipo de Mídia</span>
            </label>
            <select
              value={tipoMidia}
              onChange={(e) => setTipoMidia(e.target.value)}
              className="select select-bordered w-full bg-base-100/50 text-sm"
            >
              {TIPOS_MIDIA.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-gray-300">Status de Leitura</span>
            </label>
            <select
              value={statusLeitura}
              onChange={(e) => setStatusLeitura(e.target.value)}
              className="select select-bordered w-full bg-base-100/50 text-sm"
            >
              {STATUS_LEITURA.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Páginas / Minutos (Baseado em tipo de mídia) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text font-semibold text-gray-300">
                {tipoMidia === 'Audiobook' ? 'Total de Minutos *' : 'Total de Páginas *'}
              </span>
            </label>
            <input
              type="number"
              placeholder="Ex: 310"
              value={totalPaginas}
              onChange={(e) => setTotalPaginas(e.target.value)}
              className="input input-bordered w-full bg-base-100/50 text-sm"
              min="1"
              required
            />
          </div>

          {/* Exibição Condicional: Página Atual (Apenas se status for 'Lendo') */}
          {statusLeitura === 'Lendo' && (
            <div className="form-control w-full animate-fadeIn">
              <label className="label py-1">
                <span className="label-text font-semibold text-gray-300">
                  {tipoMidia === 'Audiobook' ? 'Minuto Atual' : 'Página Atual'}
                </span>
              </label>
              <input
                type="number"
                placeholder="Ex: 45"
                value={paginaAtual}
                onChange={(e) => setPaginaAtual(Number(e.target.value))}
                className="input input-bordered w-full bg-base-100/50 text-sm"
                min="0"
              />
            </div>
          )}
        </div>

        {/* Exibição Condicional: Datas de Início e Término */}
        {(statusLeitura === 'Lendo' || statusLeitura === 'Lido') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            <div className="form-control w-full">
              <label className="label py-1">
                <span className="label-text font-semibold text-gray-300 text-xs">Data de Início</span>
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="input input-bordered w-full bg-base-100/50 text-sm"
              />
            </div>

            {/* Apenas se status for 'Lido' */}
            {statusLeitura === 'Lido' && (
              <div className="form-control w-full animate-fadeIn">
                <label className="label py-1">
                  <span className="label-text font-semibold text-gray-300 text-xs">Data de Término</span>
                </label>
                <input
                  type="date"
                  value={dataTermino}
                  onChange={(e) => setDataTermino(e.target.value)}
                  className="input input-bordered w-full bg-base-100/50 text-sm"
                />
              </div>
            )}
          </div>
        )}

        {/* Grid dos Toggles de Posse e Coleção */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Toggle: Possui o Livro */}
          <div className="card bg-base-300/40 p-4 border border-base-300 rounded-2xl flex flex-col justify-between">
            <div className="form-control">
              <label className="label cursor-pointer justify-between p-0">
                <span className="label-text font-semibold text-gray-300">Possui o livro?</span>
                <input
                  type="checkbox"
                  checked={possuiLivro}
                  onChange={(e) => setPossuiLivro(e.target.checked)}
                  className="toggle toggle-primary toggle-sm"
                />
              </label>
            </div>

            {/* Exibição Condicional: Formato */}
            {possuiLivro && (
              <div className="form-control w-full mt-3 animate-fadeIn">
                <label className="label py-0 pb-1">
                  <span className="label-text text-gray-400 text-xs">Selecione o Formato</span>
                </label>
                <select
                  value={formato}
                  onChange={(e) => setFormato(e.target.value)}
                  className="select select-bordered select-sm w-full bg-base-100"
                >
                  {FORMATOS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Toggle: É Coleção? */}
          <div className="card bg-base-300/40 p-4 border border-base-300 rounded-2xl flex flex-col justify-between">
            <div className="form-control">
              <label className="label cursor-pointer justify-between p-0">
                <span className="label-text font-semibold text-gray-300">É uma coleção?</span>
                <input
                  type="checkbox"
                  checked={eColecao}
                  onChange={(e) => setEColecao(e.target.checked)}
                  className="toggle toggle-secondary toggle-sm"
                />
              </label>
            </div>

            {/* Exibição Condicional: Detalhes de Coleção */}
            {eColecao && (
              <div className="grid grid-cols-2 gap-2 mt-3 animate-fadeIn">
                <div className="form-control w-full">
                  <label className="label py-0 pb-1">
                    <span className="label-text text-gray-400 text-xs">Coleção *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nome"
                    value={nomeColecao}
                    onChange={(e) => setNomeColecao(e.target.value)}
                    className="input input-bordered input-sm w-full bg-base-100 text-xs"
                    required={eColecao}
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label py-0 pb-1">
                    <span className="label-text text-gray-400 text-xs">Volume / N°</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Vol. 1"
                    value={volumeColecao}
                    onChange={(e) => setVolumeColecao(e.target.value)}
                    className="input input-bordered input-sm w-full bg-base-100 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

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
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Leituras'}
          </button>
        </div>
      </form>
    </div>
  );
}
