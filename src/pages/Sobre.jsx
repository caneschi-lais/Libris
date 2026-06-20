import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Shield, Layers, ArrowRight, Heart } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="max-w-5xl mx-auto w-full py-12 px-6 flex flex-col items-center text-center space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <section className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Heart className="h-3.5 w-3.5 fill-primary" /> Versão 1.0 — Nova Experiência Multi-páginas
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Sua biblioteca pessoal sob o olhar das <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Métricas</span>
        </h1>
        <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          O <strong>Libris</strong> é um gerenciador de leituras inteligente focado em dados. Controle seu progresso, organize sua coleção física e digital e visualize estatísticas detalhadas do seu hábito literário.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            to="/estante" 
            className="btn btn-primary shadow-lg text-white font-bold px-8 flex items-center gap-2"
          >
            Acessar Estante <ArrowRight className="h-4 w-4" />
          </Link>
          <Link 
            to="/dashboard" 
            className="btn btn-outline border-base-300 hover:bg-base-200 text-gray-300 font-bold px-8"
          >
            Ver Estatísticas
          </Link>
        </div>
      </section>

      {/* Grid de Recursos */}
      <section className="w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Por que gerenciar com o Libris?</h2>
          <p className="text-xs text-gray-500 mt-1">Recursos construídos para leitores dedicados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Recurso 1: Estante */}
          <div className="card bg-base-200 border border-base-300 p-6 rounded-3xl hover:border-primary/30 transition-all duration-300 text-left space-y-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary w-fit">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-md font-bold text-white">Estante Organizada</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Gerencie livros, HQs, mangás e audiobooks em um único local, registrando autor, volumes e formatos.
            </p>
          </div>

          {/* Recurso 2: Métricas */}
          <div className="card bg-base-200 border border-base-300 p-6 rounded-3xl hover:border-secondary/30 transition-all duration-300 text-left space-y-4">
            <div className="p-3 bg-secondary/10 rounded-2xl text-secondary w-fit">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-md font-bold text-white">Gráficos Analíticos</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Analise fatias de posse, quantidade por mídias e metas de leitura mensal com gráficos interativos Recharts.
            </p>
          </div>

          {/* Recurso 3: Formatos */}
          <div className="card bg-base-200 border border-base-300 p-6 rounded-3xl hover:border-accent/30 transition-all duration-300 text-left space-y-4">
            <div className="p-3 bg-accent/10 rounded-2xl text-accent w-fit">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-md font-bold text-white">Controle de Formato</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Diferencie livros físicos de e-books e organize uma lista de desejos inteligente de itens que quer adquirir.
            </p>
          </div>

          {/* Recurso 4: LocalStorage */}
          <div className="card bg-base-200 border border-base-300 p-6 rounded-3xl hover:border-success/30 transition-all duration-300 text-left space-y-4">
            <div className="p-3 bg-success/10 rounded-2xl text-success w-fit">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-md font-bold text-white">Privacidade e Sincronia</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Seus dados nunca saem do seu computador. Tudo é salvo localmente e sincronizado entre abas.
            </p>
          </div>
        </div>
      </section>

      {/* Estatística demonstrativa rápida no rodapé */}
      <section className="w-full bg-gradient-to-r from-primary/5 to-secondary/5 border border-base-300 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div>
          <h4 className="text-lg font-bold text-white">Pronto para dar o primeiro passo?</h4>
          <p className="text-xs text-gray-400 mt-1">Crie sua conta local de leituras agora mesmo, sem burocracia.</p>
        </div>
        <Link to="/cadastro" className="btn btn-secondary font-bold">
          Adicionar Primeiro Item
        </Link>
      </section>
    </div>
  );
}
