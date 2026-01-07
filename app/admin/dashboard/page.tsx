'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

interface Resposta {
  id: string;
  nps_score: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  nome?: string;
  telefone?: string;
  origem?: string;
  duration?: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/admin/login');
        return;
      }
      const { data, error } = await supabase.from('respostas').select('*').order('created_at', { ascending: false });
      if (error) setErro('Erro ao buscar respostas');
      else setRespostas(data || []);
      setLoading(false);
    }
    checkAuthAndFetch();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Carregando...</div>;
  if (erro) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">{erro}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin - Respostas NPS</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse bg-gray-800 rounded">
          <thead>
            <tr>
              <th className="px-2 py-1 border-b border-gray-700">Data</th>
              <th className="px-2 py-1 border-b border-gray-700">NPS</th>
              <th className="px-2 py-1 border-b border-gray-700">Q1</th>
              <th className="px-2 py-1 border-b border-gray-700">Q2</th>
              <th className="px-2 py-1 border-b border-gray-700">Q3</th>
              <th className="px-2 py-1 border-b border-gray-700">Q4</th>
              <th className="px-2 py-1 border-b border-gray-700">Q5</th>
              <th className="px-2 py-1 border-b border-gray-700">Nome</th>
              <th className="px-2 py-1 border-b border-gray-700">Telefone</th>
              <th className="px-2 py-1 border-b border-gray-700">Origem</th>
            </tr>
          </thead>
          <tbody>
            {respostas.map(r => (
              <tr key={r.id} className="hover:bg-gray-700">
                <td className="px-2 py-1">{new Date(r.created_at).toLocaleString()}</td>
                <td className="px-2 py-1">{r.nps_score}</td>
                <td className="px-2 py-1">{r.q1}</td>
                <td className="px-2 py-1">{r.q2}</td>
                <td className="px-2 py-1">{r.q3}</td>
                <td className="px-2 py-1">{r.q4}</td>
                <td className="px-2 py-1">{r.q5}</td>
                <td className="px-2 py-1">{r.nome || '-'}</td>
                <td className="px-2 py-1">{r.telefone || '-'}</td>
                <td className="px-2 py-1">{r.origem || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
