import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ToggleLeft, ShieldCheck, Heart } from 'lucide-react';
import logo from '../assets/logo3.png';

export default function Sobre() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col justify-center max-w-5xl mx-auto py-12 px-6 space-y-16 animate-fadeIn">
      
      {/* Layout com a Logo (Grid de duas colunas no Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
        
        {/* Lado Esquerdo: Título, Subtítulo, Copy e Botão */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Heart className="h-3.5 w-3.5 fill-primary" /> Foco na Leitura, Sem Distrações
          </div>
          
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-base-content">
              Libris
            </h1>
            <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Onde suas leituras encontram seus dados.
            </p>
          </div>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            O Libris foi projetado como um refúgio analítico para os amantes da leitura. Longe do ruído das redes sociais, dos algoritmos de recomendação e da pressão por avaliações, este é o seu espaço privado para quantificar páginas, organizar volumes e visualizar o seu ritmo literário com total clareza e minimalismo. De livros físicos a mangás, gerencie sua jornada no seu próprio tempo.
          </p>

          <div className="pt-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary btn-md md:btn-lg shadow-xl text-white font-extrabold px-10 rounded-2xl hover:scale-105 transition-transform duration-200"
            >
              Entrar no Site
            </button>
          </div>
        </div>

        {/* Lado Direito: Logo Oficial do Libris com sombra profunda */}
        <div className="flex justify-center md:justify-end">
          <div className="relative group max-w-sm md:max-w-md w-full">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-25 group-hover:opacity-35 transition duration-1000"></div>
            <img 
              src={logo} 
              alt="Libris Logo Oficial" 
              className="relative rounded-3xl shadow-2xl border border-base-300 w-full object-cover transition-all duration-500 hover:scale-[1.03] select-none"
            />
          </div>
        </div>

      </div>

      {/* Grid de Filosofia (no rodapé, alinhado à proposta fluida) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-10 border-t border-base-300">
        <div className="flex flex-col items-start text-left space-y-2 p-5 bg-base-200/40 rounded-2xl border border-base-300/40 hover:border-primary/20 transition-all duration-300">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <ToggleLeft className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-base-content">Zero Redes Sociais</h3>
          <p className="text-xs text-gray-400 leading-relaxed">Sem curtidas, feeds ou notificações barulhentas. Apenas você e seus livros.</p>
        </div>

        <div className="flex flex-col items-start text-left space-y-2 p-5 bg-base-200/40 rounded-2xl border border-base-300/40 hover:border-secondary/20 transition-all duration-300">
          <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary">
            <BarChart3 className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-base-content">Métricas Precisas</h3>
          <p className="text-xs text-gray-400 leading-relaxed">Totalizadores de páginas lidas, tipos de mídias e metas de conclusão mensais.</p>
        </div>

        <div className="flex flex-col items-start text-left space-y-2 p-5 bg-base-200/40 rounded-2xl border border-base-300/40 hover:border-accent/20 transition-all duration-300">
          <div className="p-2.5 bg-accent/10 rounded-xl text-accent">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-base-content">Privacidade Absoluta</h3>
          <p className="text-xs text-gray-400 leading-relaxed">Seus dados são salvos inteiramente no seu banco de dados MongoDB local.</p>
        </div>
      </div>

    </div>
  );
}
