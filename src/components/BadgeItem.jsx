import React, { useState } from 'react';

/**
 * Componente interno de cada conquista (Badge) para renderizar dinamicamente.
 */
export default function BadgeItem({ conquista }) {
  const [imgError, setImgError] = useState(false);
  const { name, description, unlocked, emoji, badgeName, current, target } = conquista;

  // Resolve o caminho dinâmico da imagem na pasta de assets pelo compilador do Vite
  const imageUrl = new URL(`../assets/badges/${badgeName}`, import.meta.url).href;

  return (
    <div className="flex flex-col items-center text-center p-4 bg-base-300/20 border border-base-300/40 rounded-3xl transition-all duration-300 hover:border-primary/20 shadow-sm h-full justify-between">
      <div className="relative mb-3 flex items-center justify-center">
        {!imgError ? (
          <div className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-500 bg-base-300/30 flex items-center justify-center ${
            unlocked 
              ? 'border-warning/40 shadow-lg shadow-warning/5 hover:scale-110 hover:border-warning' 
              : 'border-base-300 filter grayscale opacity-35'
          }`}>
            <img
              src={imageUrl}
              alt={name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div 
            className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-500 ${
              unlocked ? 'bg-primary/20 text-primary scale-110 shadow-lg' : 'bg-base-300/40 text-gray-500 opacity-40'
            }`}
          >
            {emoji}
          </div>
        )}
        {unlocked && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-success"></span>
          </span>
        )}
      </div>
      <div>
        <h4 className={`text-xs font-bold ${unlocked ? 'text-base-content' : 'text-base-content/50'}`}>{name}</h4>
        <p className="text-[10px] text-gray-400 mt-1 leading-tight min-h-[32px]">{description}</p>
      </div>
      
      <div className="w-full mt-3">
        {/* Barra de Progresso sutil */}
        <div className="w-full bg-base-300 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full ${unlocked ? 'bg-success' : 'bg-primary'}`} 
            style={{ width: `${Math.min(100, (current / target) * 100)}%` }}
          ></div>
        </div>
        <span className="text-[9px] text-gray-500 mt-1 block">{Math.min(target, Math.round(current))}/{target}</span>
      </div>
    </div>
  );
}
