'use client';

import { supabase } from '../../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useEffect, useState } from 'react';

interface Media {
  question: string;
  avg: number;
}

interface ChartDataDia {
  date: string;
  count: number;
}

interface ChartDataNota {
  nota: string;
  count: number;
  fill: string;
  percentage: number;
}

interface Resposta {
  created_at: string;
  nps_score: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  nome?: string;
  telefone?: string;
  duration: number;
  origem?: string;
}

interface DashboardData {
  totalAcessos: number;
  totalRespostas: number;
  npsGeral: number;
  medias: Media[];
  chartDataDia: ChartDataDia[];
  chartDataNotas: ChartDataNota[];
  respostas: Resposta[];
}

async function getData(): Promise<DashboardData> {
  const { data: acessos } = await supabase.from('acessos').select('*');
  const { data: respostas } = await supabase.from('respostas').select('*');

  const totalAcessos = acessos?.length || 0;
  const totalRespostas = respostas?.length || 0;
  const npsGeral = respostas ? respostas.reduce((sum, r) => sum + r.nps_score, 0) / totalRespostas : 0;

  const medias = [1,2,3,4,5].map(i => ({
    question: `Q${i}`,
    avg: respostas ? respostas.reduce((sum, r) => sum + r[`q${i}`], 0) / totalRespostas : 0
  }));

  // Respostas por dia
  const respostasPorDia = respostas?.reduce((acc, r) => {
    const date = new Date(r.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const chartDataDia = Object.entries(respostasPorDia).map(([date, count]) => ({ date, count: count as number }));

  // Distribuição de notas agrupada
  const distribuicaoNotas = respostas?.reduce((acc, r) => {
    if (r.nps_score <= 3) acc['0-3'] = (acc['0-3'] || 0) + 1;
    else if (r.nps_score <= 7) acc['4-7'] = (acc['4-7'] || 0) + 1;
    else acc['8-10'] = (acc['8-10'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const chartDataNotas = Object.entries(distribuicaoNotas).map(([range, count]) => {
    let fill = '#EF4444'; // red for 0-3
    if (range === '4-7') fill = '#F59E0B'; // yellow
    else if (range === '8-10') fill = '#10B981'; // green
    const percentage = totalRespostas > 0 ? ((count as number) / totalRespostas) * 100 : 0;
    return { nota: range, count: count as number, fill, percentage };
  });

  return {
    totalAcessos,
    totalRespostas,
    npsGeral,
    medias,
    chartDataDia,
    chartDataNotas,
    respostas: respostas || []
  };
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    getData().then(setData);
  }, []);

  if (!data) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-lg text-white">Carregando...</div></div>;

  const renderCustomizedLabel = (props: any) => {
    const { index } = props;
    const entry = data.chartDataNotas[index];
    return `${entry.nota}: ${entry.percentage.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-bold text-white mb-4 flex items-center">Dashboard Admin - Respostas NPS</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-sm font-semibold text-gray-300">Total Acessos Únicos</h2>
            <p className="text-xl font-bold text-blue-400 mt-1">{data.totalAcessos}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-sm font-semibold text-gray-300">Total Respostas</h2>
            <p className="text-xl font-bold text-green-400 mt-1">{data.totalRespostas}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-sm font-semibold text-gray-300">NPS Geral</h2>
            <p className="text-xl font-bold text-purple-400 mt-1">{data.npsGeral.toFixed(1)}</p>
            <p className="text-xs text-gray-400 mt-1">0-3: Ruim | 4-7: Bom | 8-10: Excelente</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700 md:col-span-1">
            <h2 className="text-sm font-semibold text-gray-300">Médias das Perguntas</h2>
            <ul className="mt-1 space-y-1">
              {data.medias.map((m: Media) => {
                const emoji = m.avg < 2 ? '😞' : m.avg < 3 ? '😐' : m.avg < 4 ? '🙂' : m.avg < 5 ? '😀' : '😍';
                return (
                  <li key={m.question} className="text-xs text-gray-400">{emoji} {m.question}: <span className="font-semibold text-white">{m.avg.toFixed(1)}</span></li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-sm font-semibold text-gray-300 mb-2">Respostas por Dia</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.chartDataDia}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', color: '#F9FAFB' }} />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-sm font-semibold text-gray-300 mb-2">Distribuição de Notas NPS</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.chartDataNotas}
                  dataKey="count"
                  nameKey="nota"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {data.chartDataNotas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} respostas`, `Nota ${name}`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-sm font-semibold text-gray-300 mb-2">Tabela de Respostas</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Data</th>
                  <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">NPS</th>
                  <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Q1</th>
                  <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Q2</th>
                  <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Q3</th>
                  <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Q4</th>
                  <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Q5</th>
                  <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Nome</th>
                  <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Telefone</th>
                  <th className="border border-gray-600 px-2 py-1 text-left text-xs font-medium text-gray-300">Origem</th>
                </tr>
              </thead>
              <tbody>
                {data.respostas.map((r: Resposta, i: number) => (
                  <tr key={i} className="hover:bg-gray-700">
                    <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.nps_score}</td>
                    <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.q1}</td>
                    <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.q2}</td>
                    <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.q3}</td>
                    <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.q4}</td>
                    <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.q5}</td>
                    <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.nome || '-'}</td>
                    <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.telefone || '-'}</td>
                    <td className="border border-gray-600 px-2 py-1 text-xs text-gray-300">{r.origem || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
