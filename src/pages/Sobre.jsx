import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart3, ToggleLeft, ShieldCheck, Heart } from 'lucide-react';

export default function Sobre() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center max-w-4xl mx-auto py-12 px-6 space-y-12 animate-fadeIn text-center">
      
      {/* Badge e Título Principal */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <BookOpen className="h-3.5 w-3.5" /> Foco na Leitura, Sem Distrações
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
          Libris
        </h1>
        <p className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Seu espaço minimalista de leituras & métricas
        </p>
      </div>

      {/* Conteúdo de Propósito */}
      <div className="max-w-2xl text-gray-400 space-y-6 text-sm md:text-base leading-relaxed">
        <p>
          O <strong>Libris</strong> nasceu da necessidade de um ambiente limpo e focado no seu progresso de leitura. Aqui não há feeds, algoritmos de recomendação, contadores de curtidas ou a pressão social de outras redes. 
        </p>
        <p>
          Nosso objetivo é fornecer ferramentas analíticas para você compreender seu ritmo de leitura, estimar conclusões e manter sua estante organizada, com total privacidade e minimalismo.
        </p>
      </div>

      {/* Botão de Ação Centralizado */}
      <div className="pt-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary btn-md md:btn-lg shadow-xl text-white font-extrabold px-12 rounded-2xl hover:scale-105 transition-transform duration-200"
        >
          Entrar no Site
        </button>
      </div>

      {/* Grid de Filosofia de Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8 border-t border-base-300">
        <div className="flex flex-col items-center space-y-2 p-4">
          <div className="p-3 bg-primary/15 rounded-2xl text-primary">
            <ToggleLeft className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Zero Redes Sociais</h3>
          <p className="text-2xs text-gray-400">Sem curtidas, feeds ou notificações barulhentas. Apenas você e seus livros.</p>
        </div>

        <div className="flex flex-col items-center space-y-2 p-4">
          <div className="p-3 bg-secondary/15 rounded-2xl text-secondary">
            <BarChart3 className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Métricas Precisas</h3>
          <p className="text-2xs text-gray-400">Totalizadores de páginas lidas, tipos de mídias e metas de conclusão mensais.</p>
        </div>

        <div className="flex flex-col items-center space-y-2 p-4">
          <div className="p-3 bg-accent/15 rounded-2xl text-accent">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Privacidade Absoluta</h3>
          <p className="text-2xs text-gray-400">Seus dados são salvos inteiramente no navegador local, sem servidores externos.</p>
        </div>
      </div>
    </div>
  );
}
