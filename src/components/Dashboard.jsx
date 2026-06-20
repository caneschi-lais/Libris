import React, { useMemo } from 'react';
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
  ShoppingBag
} from 'lucide-react';

/**
 * Componente de Dashboard do Libris. Exibe cartões estatísticos rápidos e
 * três gráficos Recharts premium para controle de leitura e aquisições.
 * 
 * @param {Object} props
 * @param {Array} props.books - A lista de livros cadastrados
 */
export default function Dashboard({ books }) {
  
  // 1. Cálculos de Estatísticas Rápidas
  const stats = useMemo(() => {
    const totalLivros = books.length;
    
    // Contagem de livros marcados como "Lido"
    const livrosLidos = books.filter(b => b.status_leitura === 'Lido').length;
    
    // Total de páginas lidas (página_atual dos livros lendo + total_paginas de livros lidos)
    const totalPaginasLidas = books.reduce((acc, livro) => {
      if (livro.status_leitura === 'Lido') {
        return acc + (livro.total_paginas || 0);
      } else if (livro.status_leitura === 'Lendo') {
        return acc + (livro.pagina_atual || 0);
      }
      return acc;
    }, 0);

    return {
      totalLivros,
      livrosLidos,
      totalPaginasLidas
    };
  }, [books]);

  // 2. Gráfico 1: Rosca de Distribuição de Posse (Tenho vs Quero)
  const possessionData = useMemo(() => {
    const tenho = books.filter(b => b.possui_o_livro).length;
    const quero = books.filter(b => !b.possui_o_livro).length;

    return [
      { name: 'Possuo (Tenho)', value: tenho, color: '#6366f1' }, // Indigo
      { name: 'Quero (Lista de Desejos)', value: quero, color: '#f59e0b' } // Amber
    ];
  }, [books]);

  // 3. Gráfico 2: Itens por Tipo de Mídia
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

  // 4. Gráfico 3: Leituras Concluídas por Mês em 2026 (Linha)
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

    // Filtra livros lidos que possuem data_termino no ano de 2026
    books.forEach(b => {
      if (b.status_leitura === 'Lido' && b.data_termino && b.data_termino.startsWith('2026')) {
        // Ex: data_termino no formato "2026-06-15"
        const mesIndex = b.data_termino.substring(5, 7); // extrai "06"
        const mesAlvo = meses.find(m => m.key === mesIndex);
        if (mesAlvo) {
          mesAlvo.leituras++;
        }
      }
    });

    return meses;
  }, [books]);

  // Checa se há livros cadastrados para exibir informações relevantes
  const hasBooks = books.length > 0;

  return (
    <div className="space-y-6">
      
      {/* 1. Painel de Estatísticas Rápidas (DaisyUI Stats) */}
      <div className="stats stats-vertical lg:stats-horizontal w-full bg-base-200 border border-base-300 rounded-3xl shadow-xl">
        
        {/* Total de Livros */}
        <div className="stat px-6 py-5">
          <div className="stat-figure text-primary">
            <Layers className="h-8 w-8 opacity-75" />
          </div>
          <div className="stat-title text-gray-400 font-semibold text-sm">Total de Livros</div>
          <div className="stat-value text-3xl font-extrabold text-white mt-1">{stats.totalLivros}</div>
          <div className="stat-desc text-xs text-gray-500 mt-1">Registrados na sua estante</div>
        </div>

        {/* Livros Lidos */}
        <div className="stat px-6 py-5 border-t lg:border-t-0 lg:border-l border-base-300">
          <div className="stat-figure text-success">
            <BookOpenCheck className="h-8 w-8 opacity-75" />
          </div>
          <div className="stat-title text-gray-400 font-semibold text-sm">Concluídos (Lidos)</div>
          <div className="stat-value text-3xl font-extrabold text-white mt-1">{stats.livrosLidos}</div>
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
          <div className="stat-value text-3xl font-extrabold text-white mt-1">{stats.totalPaginasLidas}</div>
          <div className="stat-desc text-xs text-gray-500 mt-1">Soma de Lidos + Lendo atualmente</div>
        </div>

      </div>

      {/* Se não houver livros, exibe um painel de introdução amigável */}
      {!hasBooks ? (
        <div className="card bg-base-200 border border-base-300 text-center py-20 px-4 rounded-3xl">
          <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
            <div className="p-4 bg-base-300 rounded-full text-gray-500 mb-4">
              <BookOpen className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Seu Dashboard está pronto!</h3>
            <p className="text-sm text-gray-400">
              Cadastre livros ou HQs na aba <strong>Estante</strong> com diferentes status e mídias para gerar os gráficos de métricas automaticamente aqui.
            </p>
          </div>
        </div>
      ) : (
        /* 2. Grid de Gráficos (3 Colunas / Responsive) */
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Gráfico 1: Pizza/Rosca - Posse */}
          <div className="card bg-base-200 border border-base-300 shadow-xl rounded-3xl p-5 hover:border-primary/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-md font-bold text-white">Distribuição de Posse</h3>
                <p className="text-2xs text-gray-400">Compara livros que possui vs desejados</p>
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
                <h3 className="text-md font-bold text-white">Mídias na Estante</h3>
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

          {/* Gráfico 3: Linha - Concluídos por Mês em 2026 */}
          <div className="card bg-base-200 border border-base-300 shadow-xl rounded-3xl p-5 hover:border-accent/20 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-md font-bold text-white">Conclusões por Mês (2026)</h3>
                <p className="text-2xs text-gray-400">Total de leituras finalizadas no ano</p>
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
      )}

    </div>
  );
}
