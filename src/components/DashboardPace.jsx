import React from 'react';
import { Clock, Zap, BookOpen } from 'lucide-react';

/**
 * Subcomponente do Dashboard contendo a seção de ritmo e velocidade de leitura.
 */
export default function DashboardPace({ ritmo }) {
  return (
    <div className="space-y-4 pt-6 border-t border-base-300">
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-bold text-base-content">Ritmo de Leitura</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Tempo Médio */}
        <div className="card bg-base-200 border border-base-300 p-5 shadow-xl rounded-3xl flex flex-row items-center gap-4 hover:border-primary/20 transition-all duration-300">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xs text-gray-400 font-semibold uppercase tracking-wider">Tempo Médio</div>
            <div className="text-xl font-black text-base-content mt-0.5">
              {ritmo?.tempoMedio ? `${ritmo.tempoMedio} ${ritmo.tempoMedio === 1 ? 'dia' : 'dias'}` : 'N/A'}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5">Média de dias para concluir um livro</div>
          </div>
        </div>

        {/* Livro Mais Rápido */}
        <div className="card bg-base-200 border border-base-300 p-5 shadow-xl rounded-3xl flex flex-row items-center gap-4 hover:border-success/20 transition-all duration-300">
          <div className="p-3 bg-success/10 rounded-2xl text-success shrink-0">
            <Zap className="h-6 w-6" />
          </div>
          <div className="overflow-hidden w-full">
            <div className="text-2xs text-gray-400 font-semibold uppercase tracking-wider">Leitura Mais Rápida</div>
            <div className="text-xl font-black text-base-content mt-0.5 truncate" title={ritmo?.fastestBookTitle || 'Sem registro'}>
              {ritmo?.fastestDays !== null ? `${ritmo.fastestDays} ${ritmo.fastestDays === 1 ? 'dia' : 'dias'}` : 'N/A'}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 truncate" title={ritmo?.fastestBookTitle || ''}>
              {ritmo?.fastestBookTitle ? `Obra: "${ritmo.fastestBookTitle}"` : 'Sem registros com datas'}
            </div>
          </div>
        </div>

        {/* Maior Livro */}
        <div className="card bg-base-200 border border-base-300 p-5 shadow-xl rounded-3xl flex flex-row items-center gap-4 hover:border-accent/20 transition-all duration-300">
          <div className="p-3 bg-accent/10 rounded-2xl text-accent shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="overflow-hidden w-full">
            <div className="text-2xs text-gray-400 font-semibold uppercase tracking-wider">Maior Livro Lido</div>
            <div className="text-xl font-black text-base-content mt-0.5 truncate" title={ritmo?.biggestBookTitle || 'Sem registro'}>
              {ritmo?.biggestPages ? `${ritmo.biggestPages} págs` : 'N/A'}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 truncate" title={ritmo?.biggestBookTitle || ''}>
              {ritmo?.biggestBookTitle ? `Obra: "${ritmo.biggestBookTitle}"` : 'Sem registros'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
