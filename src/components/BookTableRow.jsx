import React from 'react';
import {
  BookOpen,
  Layers,
  Headphones,
  Compass,
  Book,
  Edit3,
  Trash2
} from 'lucide-react';

/**
 * Subcomponente representando uma única linha de dados do livro na tabela da estante.
 */
export default function BookTableRow({ livro, onEdit, onDelete, onIncrementPage }) {
  // Helper para ícones de mídia
  const getMediaIcon = (media) => {
    switch (media) {
      case 'Livro':
        return <BookOpen className="h-4 w-4 text-primary" />;
      case 'HQ':
        return <Layers className="h-4 w-4 text-secondary" />;
      case 'Audiobook':
        return <Headphones className="h-4 w-4 text-accent" />;
      case 'Mangá':
        return <Compass className="h-4 w-4 text-warning" />;
      default:
        return <Book className="h-4 w-4 text-primary" />;
    }
  };

  // Helper para percentual de progresso
  const getProgressoPercent = (l) => {
    if (!l.total_paginas || l.total_paginas <= 0) return 0;
    const pag = l.pagina_atual || 0;
    return Math.round((pag / l.total_paginas) * 100);
  };

  const percentual = getProgressoPercent(livro);
  const isAudio = livro.tipo_midia === 'Audiobook';
  const unidade = isAudio ? 'min' : 'pág';

  let progressoTexto = '';
  let progressClass = 'progress-primary';

  if (livro.status_leitura === 'Lido') {
    progressoTexto = 'Lido (100%)';
    progressClass = 'progress-success';
  } else if (livro.status_leitura === 'Lendo') {
    progressoTexto = `${isAudio ? 'Min.' : 'Pág.'} ${livro.pagina_atual}/${livro.total_paginas} (${percentual}%)`;
    progressClass = 'progress-primary';
  } else {
    progressoTexto = 'Não Iniciado (0%)';
    progressClass = 'progress-warning';
  }

  return (
    <tr className="hover:bg-base-300/20 transition-colors">
      {/* Título */}
      <td className="font-semibold text-base-content max-w-[200px] truncate py-4">
        {livro.titulo}
      </td>

      {/* Autor */}
      <td className="text-base-content/80 max-w-[150px] truncate py-4">
        {livro.autor}
      </td>

      {/* Tipo de Mídia */}
      <td className="py-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-base-content/80">
          {getMediaIcon(livro.tipo_midia)}
          {livro.tipo_midia}
        </span>
      </td>

      {/* Coleção */}
      <td className="py-4">
        {livro.e_colecao && livro.nome_colecao ? (
          <div
            className="badge badge-secondary badge-outline text-2xs font-semibold py-2.5 px-2.5 max-w-[150px]"
            title={livro.nome_colecao}
          >
            <span className="truncate w-full text-left">{livro.nome_colecao}</span>
          </div>
        ) : (
          <span className="text-gray-500 font-light text-sm">-</span>
        )}
      </td>

      {/* Volume */}
      <td className="py-4 text-xs font-semibold text-base-content/80">
        {livro.e_colecao && livro.volume_colecao ? (
          <span>{livro.volume_colecao}</span>
        ) : (
          <span className="text-gray-500 font-light">-</span>
        )}
      </td>

      {/* Formato / Posse */}
      <td className="py-4">
        {livro.possui_o_livro ? (
          <span className={`badge text-2xs font-semibold py-2 px-2.5 border-none ${livro.formato === 'Físico' ? 'bg-primary/15 text-primary' : 'bg-accent/15 text-accent'
            }`}>
            {livro.formato}
          </span>
        ) : (
          <span className="badge bg-base-300 text-gray-400 text-2xs font-medium py-2 px-2 border-none">
            Desejado
          </span>
        )}
      </td>

      {/* Páginas */}
      <td className="py-4 text-xs font-semibold text-base-content/85">
        {livro.total_paginas}
      </td>

      {/* Progresso */}
      <td className="py-4">
        <div className="flex flex-col gap-1 w-full max-w-[220px]">
          <span className="text-2xs font-bold text-base-content/80">{progressoTexto}</span>
          <progress
            className={`progress w-full h-2.5 ${progressClass}`}
            value={livro.status_leitura === 'Lido' ? 100 : percentual}
            max="100"
          ></progress>
        </div>
      </td>

      {/* Ações */}
      <td className="py-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          {/* Progresso Rápido (Apenas se não lido ou lendo) */}
          {livro.status_leitura !== 'Lido' && (
            <div className="join mr-2 shadow-sm">
              <button
                onClick={() => onIncrementPage(livro, 10)}
                className="btn btn-xs btn-outline btn-info font-bold join-item"
                title={`Incrementar +10 ${unidade}`}
              >
                +10
              </button>
              <button
                onClick={() => onIncrementPage(livro, 50)}
                className="btn btn-xs btn-outline btn-info font-bold join-item"
                title={`Incrementar +50 ${unidade}`}
              >
                +50
              </button>
              <button
                onClick={() => onIncrementPage(livro, livro.total_paginas - livro.pagina_atual)}
                className="btn btn-xs btn-outline btn-success font-bold join-item"
                title="Marcar como Lido"
              >
                ✓
              </button>
            </div>
          )}

          {/* Editar */}
          <button
            onClick={() => onEdit(livro)}
            className="btn btn-ghost btn-circle btn-xs md:btn-sm text-info hover:bg-info/15"
            title="Editar livro"
          >
            <Edit3 className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>

          {/* Excluir */}
          <button
            onClick={() => onDelete(livro.id)}
            className="btn btn-ghost btn-circle btn-xs md:btn-sm text-error hover:bg-error/15"
            title="Remover livro"
          >
            <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
