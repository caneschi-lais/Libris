import React, { useMemo, useState } from 'react';
import { Calendar, BookOpen, Trophy } from 'lucide-react';
import { useBooksContext } from '../context/BooksContext';
import BadgeItem from './BadgeItem';
import DashboardStats from './DashboardStats';
import DashboardPace from './DashboardPace';
import DashboardCharts from './DashboardCharts';

/**
 * Componente de Dashboard do Libris. Exibe cartões estatísticos rápidos e
 * três gráficos Recharts premium para controle de leitura e aquisições.
 * 
 * @param {Object} props
 * @param {Array} props.books - A lista de livros cadastrados
 */
export default function Dashboard({ books }) {
  const { metrics } = useBooksContext();
  const { ritmo, conquistas } = metrics || {};
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Extrai os anos únicos presentes nos livros para preencher o dropdown
  const uniqueYears = useMemo(() => {
    const years = new Set();
    years.add(currentYear);

    books.forEach(b => {
      if (b.data_termino && b.data_termino.length >= 4) {
        const year = b.data_termino.substring(0, 4);
        if (/^\d{4}$/.test(year)) years.add(year);
      }
      if (b.data_inicio && b.data_inicio.length >= 4) {
        const year = b.data_inicio.substring(0, 4);
        if (/^\d{4}$/.test(year)) years.add(year);
      }
    });

    return Array.from(years).sort((a, b) => b - a);
  }, [books, currentYear]);

  // 1. Cálculos de Estatísticas Rápidas baseadas no ano selecionado
  const stats = useMemo(() => {
    // Filtro de livros para contar os livros ativos no ano selecionado
    const booksActiveInYear = books.filter(b => {
      if (selectedYear === 'todos') return true;
      const termYear = b.data_termino ? b.data_termino.substring(0, 4) : null;
      const initYear = b.data_inicio ? b.data_inicio.substring(0, 4) : null;
      return termYear === selectedYear || initYear === selectedYear;
    });

    const totalLivros = booksActiveInYear.length;
    
    // Contagem de livros marcados como "Lido" no ano selecionado
    const livrosLidos = books.filter(b => {
      if (b.status_leitura !== 'Lido') return false;
      if (selectedYear === 'todos') return true;
      return b.data_termino && b.data_termino.substring(0, 4) === selectedYear;
    }).length;
    
    // Total de páginas lidas do ano selecionado
    const totalPaginasLidas = books.reduce((acc, livro) => {
      const termYear = livro.data_termino ? livro.data_termino.substring(0, 4) : null;
      const initYear = livro.data_inicio ? livro.data_inicio.substring(0, 4) : null;

      if (livro.status_leitura === 'Lido') {
        if (selectedYear === 'todos' || termYear === selectedYear) {
          return acc + (livro.total_paginas || 0);
        }
      } else if (livro.status_leitura === 'Lendo') {
        if (selectedYear === 'todos' || initYear === selectedYear) {
          return acc + (livro.pagina_atual || 0);
        }
      }
      return acc;
    }, 0);

    return {
      totalLivros,
      livrosLidos,
      totalPaginasLidas
    };
  }, [books, selectedYear]);

  // 2. Gráfico 1: Rosca de Distribuição de Posse (Físico vs Digital vs Quero) - Global
  const possessionData = useMemo(() => {
    const fisico = books.filter(b => b.possui_o_livro && b.formato !== 'Digital').length;
    const digital = books.filter(b => b.possui_o_livro && b.formato === 'Digital').length;
    const quero = books.filter(b => !b.possui_o_livro).length;

    return [
      { name: 'Tenho Físico', value: fisico, color: '#6366f1' }, // Indigo
      { name: 'Tenho Digital', value: digital, color: '#06b6d4' }, // Cyan
      { name: 'Quero (Desejo)', value: quero, color: '#f59e0b' } // Amber
    ];
  }, [books]);

  // 3. Gráfico 2: Itens por Tipo de Mídia - Global
  const mediaData = useMemo(() => {
    const counts = {
      Livro: 0,
      HQ: 0,
      Mangá: 0,
      Audiobook: 0
    };

    books.forEach(b => {
      if (counts[b.tipo_midia] !== undefined) {
        counts[b.tipo_midia]++;
      }
    });

    return [
      { name: 'Livro', quantidade: counts.Livro, fill: '#6366f1' },
      { name: 'HQ', quantidade: counts.HQ, fill: '#a855f7' },
      { name: 'Mangá', quantidade: counts.Mangá, fill: '#f59e0b' },
      { name: 'Audiobook', quantidade: counts.Audiobook, fill: '#14b8a6' }
    ];
  }, [books]);

  // 4. Gráfico 3: Leituras Concluídas por Mês (Linha)
  const monthlyData = useMemo(() => {
    // Inicialização dos 12 meses
    const meses = [
      { name: 'Jan', leituras: 0, key: '01' },
      { name: 'Fev', leituras: 0, key: '02' },
      { name: 'Mar', leituras: 0, key: '03' },
      { name: 'Abr', leituras: 0, key: '04' },
      { name: 'Mai', leituras: 0, key: '05' },
      { name: 'Jun', leituras: 0, key: '06' },
      { name: 'Jul', leituras: 0, key: '07' },
      { name: 'Ago', leituras: 0, key: '08' },
      { name: 'Set', leituras: 0, key: '09' },
      { name: 'Out', leituras: 0, key: '10' },
      { name: 'Nov', leituras: 0, key: '11' },
      { name: 'Dez', leituras: 0, key: '12' }
    ];

    // Filtra livros lidos que possuem data_termino no ano selecionado
    books.forEach(b => {
      if (b.status_leitura === 'Lido' && b.data_termino) {
        const matchesYear = selectedYear === 'todos' || b.data_termino.startsWith(selectedYear);
        if (matchesYear) {
          // Ex: data_termino no formato "YYYY-MM-DD"
          const mesIndex = b.data_termino.substring(5, 7); // extrai "MM"
          const mesAlvo = meses.find(m => m.key === mesIndex);
          if (mesAlvo) {
            mesAlvo.leituras++;
          }
        }
      }
    });

    return meses;
  }, [books, selectedYear]);

  // Checa se há livros cadastrados para exibir informações relevantes
  const hasBooks = books.length > 0;

  return (
    <div className="space-y-6">
      
      {/* Filtro de Ano */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-200 p-5 border border-base-300 rounded-3xl shadow-xl">
        <div>
          <h3 className="text-md font-bold text-base-content flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Filtro de Ano
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Selecione o período de referência para as estatísticas rápidas e conclusões mensais.
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="select select-bordered select-sm w-full sm:w-44 bg-base-100 text-sm focus:border-primary text-base-content font-medium"
          >
            <option value="todos">Todos os Anos</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                Ano de {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* 1. Painel de Estatísticas Rápidas (DaisyUI Stats) */}
      <DashboardStats stats={stats} selectedYear={selectedYear} />

      {/* Se não houver livros, exibe um painel de introdução amigável */}
      {!hasBooks ? (
        <div className="card bg-base-200 border border-base-300 text-center py-20 px-4 rounded-3xl">
          <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
            <div className="p-4 bg-base-300 rounded-full text-gray-500 mb-4">
              <BookOpen className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-base-content mb-2">Seu Dashboard está pronto!</h3>
            <p className="text-sm text-gray-400">
              Cadastre livros ou HQs na aba <strong>Estante</strong> com diferentes status e mídias para gerar os gráficos de métricas automaticamente aqui.
            </p>
          </div>
        </div>
      ) : (
        <>
          <DashboardCharts
            possessionData={possessionData}
            mediaData={mediaData}
            monthlyData={monthlyData}
            selectedYear={selectedYear}
          />

          <DashboardPace ritmo={ritmo} />

          {/* Seção Nova: Conquistas & Medalhas */}
          <div className="space-y-4 pt-6 border-t border-base-300">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-warning animate-bounce" style={{ animationDuration: '3s' }} />
              <h3 className="text-lg font-bold text-base-content">Conquistas & Medalhas</h3>
            </div>
            <div className="card bg-base-200 border border-base-300 p-6 shadow-xl rounded-3xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {conquistas?.map((conquista) => (
                  <BadgeItem key={conquista.id} conquista={conquista} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
