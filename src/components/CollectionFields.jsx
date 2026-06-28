import React from 'react';
import { FORMATOS } from '../models/book';

/**
 * Subcomponente de formulário para controlar toggles de Posse e Coleção.
 */
export default function CollectionFields({
  possuiLivro,
  setPossuiLivro,
  formato,
  setFormato,
  eColecao,
  setEColecao,
  nomeColecao,
  setNomeColecao,
  volumeColecao,
  setVolumeColecao
}) {
  return (
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
  );
}
