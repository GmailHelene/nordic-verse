'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName })
    });

    const data = await response.json();
    if (response.ok) {
      setMessage('Registrering vellykket. Sender deg til login...');
      setTimeout(() => router.push('/login'), 1400);
    } else {
      setMessage(data.error || 'Registrering feilet.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/80 p-10 shadow-xl shadow-slate-950/40">
        <h1 className="text-3xl font-semibold text-nordic-100">Registrer</h1>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-slate-300">E-post</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-nordic-400"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Visningsnavn</span>
            <input
              type="text"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-nordic-400"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Passord</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-nordic-400"
              required
            />
          </label>
          <button className="w-full rounded-full bg-nordic-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-nordic-400">
            Opprett konto
          </button>
        </form>
        {message && <p className="mt-6 text-sm text-slate-300">{message}</p>}
      </div>
    </main>
  );
}
