'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) {
      setErro('E-mail ou senha inválidos');
    } else {
      router.push('/admin/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login Admin</h2>
        <input
          type="email"
          placeholder="E-mail"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
        />
        {erro && <div className="text-red-400 mb-2 text-sm">{erro}</div>}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}
