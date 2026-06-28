import React, { useMemo, useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { 
  BookOpen, 
  CheckSquare, 
  BookOpenCheck,
  Award,
  Calendar,
  Layers,
  ShoppingBag,
  Zap,
  Clock,
  Trophy
} from 'lucide-react';
import { useBooksContext } from '../context/BooksContext';

/**
 * Componente interno de cada conquista (Badge) para renderizar dinamicamente.
 */
function BadgeItem({ conquista }) {
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
      <div className="stats stats-vertical lg:stats-horizontal w-full bg-base-200 border border-base-300 rounded-3xl shadow-xl">
        
        {/* Total de Livros */}
        <div className="stat px-6 py-5">
          <div className="stat-figure text-primary">
            <Layers className="h-8 w-8 opacity-75" />
          </div>
          <div className="stat-title text-gray-400 font-semibold text-sm">Total de Livros</div>
          <div className="stat-value text-3xl font-extrabold text-base-content mt-1">{stats.totalLivros}</div>
          <div className="stat-desc text-xs text-gray-500 mt-1">
            {selectedYear === 'todos' ? 'Registrados na sua estante' : `Ativos em ${selectedYear}`}
          </div>
        </div>

        {/* Livros Lidos */}
        <div className="stat px-6 py-5 border-t lg:border-t-0 lg:border-l border-base-300">
          <div className="stat-figure text-success">
            <BookOpenCheck className="h-8 w-8 opacity-75" />
          </div>
          <div className="stat-title text-gray-400 font-semibold text-sm">Concluídos (Lidos)</div>
          <div className="stat-value text-3xl font-extrabold text-base-content mt-1">{stats.livrosLidos}</div>
          <div className="stat-desc text-xs text-gray-500 mt-1">
            {stats.totalLivros > 0 
              ? `${Math.round((stats.livrosLidos / stats.totalLivros) * 100)}% de taxa de conclusão` 
              : 'Sem leituras registradas'}
          </div>
        </div>

        {/* Páginas Lidas */}
        <div className="stat px-6 py-5 border-t lg:border-t-0 lg:border-l border-base-300">
          <div className="stat-figure text-accent">
            <Award className="h-8 w-8 opacity-75" />
          </div>
          <div className="stat-title text-gray-400 font-semibold text-sm">Páginas Lidas</div>
          <div className="stat-value text-3xl font-extrabold text-base-content mt-1">{stats.totalPaginasLidas}</div>
          <div className="stat-desc text-xs text-gray-500 mt-1">
            {selectedYear === 'todos' ? 'Soma de Lidos + Lendo atualmente' : `Lidos + Lendo em ${selectedYear}`}
          </div>
        </div>

      </div>

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
          {/* 2. Grid de Gráficos (3 Colunas / Responsive) */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Gráfico 1: Pizza/Rosca - Posse */}
          <div className="card bg-base-200 border border-base-300 shadow-xl rounded-3xl p-5 hover:border-primary/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-md font-bold text-base-content">Distribuição de Posse</h3>
                <p className="text-2xs text-gray-400">Físicos, Digitais e Desejados na Estante</p>
              </div>
              <ShoppingBag className="h-5 w-5 text-gray-400" />
            </div>

            <div className="h-[260px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={possessionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {possessionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconSize={10} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Barras - Tipo de Mídia */}
          <div className="card bg-base-200 border border-base-300 shadow-xl rounded-3xl p-5 hover:border-secondary/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-md font-bold text-base-content">Mídias na Estante</h3>
                <p className="text-2xs text-gray-400">Total de mídias por tipo cadastrado</p>
              </div>
              <Layers className="h-5 w-5 text-gray-400" />
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={mediaData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    fontSize={11} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={11} 
                    tickLine={false} 
                    allowDecimals={false} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Bar 
                    dataKey="quantidade" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  >
                    {mediaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 3: Linha - Concluídos por Mês */}
          <div className="card bg-base-200 border border-base-300 shadow-xl rounded-3xl p-5 hover:border-accent/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-md font-bold text-base-content">
                  Conclusões por Mês ({selectedYear === 'todos' ? 'Todos os Anos' : selectedYear})
                </h3>
                <p className="text-2xs text-gray-400">Total de leituras finalizadas no período selecionado</p>
              </div>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 10, right: 15, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorLeituras" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af" 
                    fontSize={11} 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#9ca3af" 
                    fontSize={11} 
                    tickLine={false} 
                    allowDecimals={false} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leituras" 
                    stroke="#14b8a6" 
                    strokeWidth={3}
                    dot={{ fill: '#14b8a6', r: 4 }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Seção Nova: Ritmo de Leitura */}
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
