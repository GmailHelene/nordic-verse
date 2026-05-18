'use client';

import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:4000';

export default function ProfilePage() {
  const [profile, setProfile] = useState<{ email: string; displayName: string; avatarUrl?: string; bio?: string } | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = window.localStorage.getItem('nordic_token');
    if (!token) {
      setMessage('Ingen bruker er logget inn.');
      return;
    }

    fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Kunne ikke hente profil.');
        }
        return res.json();
      })
      .then((data) => {
        setProfile(data.profile);
      })
      .catch((error) => {
        setMessage(error.message);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/80 p-10 shadow-xl shadow-slate-950/40">
        <h1 className="text-3xl font-semibold text-nordic-100">Min profil</h1>
        {message && <p className="mt-4 text-slate-300">{message}</p>}
        {profile ? (
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">E-post</p>
              <p className="mt-2 text-lg text-white">{profile.email}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">Navn</p>
              <p className="mt-2 text-lg text-white">{profile.displayName}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">Bio</p>
              <p className="mt-2 text-lg text-white">{profile.bio || 'Ingen bio satt ennå.'}</p>
            </div>
          </div>
        ) : (
          !message && <p className="mt-6 text-slate-300">Laster profil...</p>
        )}
      </div>
    </main>
  );
}
