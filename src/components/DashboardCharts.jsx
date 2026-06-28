import React from 'react';
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
import { ShoppingBag, Layers, Calendar } from 'lucide-react';

/**
 * Subcomponente do Dashboard contendo os três gráficos analíticos premium Recharts.
 */
export default function DashboardCharts({ possessionData, mediaData, monthlyData, selectedYear }) {
  return (
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

      {/* Gráfico 3: Linha - Conclusões por Mês */}
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
  );
}
