import React from 'react';
import { TIPOS_MIDIA, STATUS_LEITURA } from '../models/book';

/**
 * Subcomponente de formulário contendo a escolha da mídia, status de leitura e progresso de páginas/datas.
 */
export default function MediaProgressFields({
  tipoMidia,
  setTipoMidia,
  statusLeitura,
  setStatusLeitura,
  totalPaginas,
  setTotalPaginas,
  paginaAtual,
  setPaginaAtual,
  dataInicio,
  setDataInicio,
  dataTermino,
  setDataTermino
}) {
  return (
    <>
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
    </>
  );
}
