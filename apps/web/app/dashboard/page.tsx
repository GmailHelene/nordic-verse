'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL } from '../../lib/auth';

type Profile = {
  userId: number;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
};

type ProfilesResponse = {
  profiles: Profile[];
};

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/profiles`)
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json();
          throw new Error(payload.error || 'Kunne ikke hente profiler.');
        }
        return res.json();
      })
      .then((data: ProfilesResponse) => {
        setProfiles(data.profiles || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-nordic-100">Dashboard</h1>
              <p className="mt-3 text-slate-300">Her er spillerprofiler og en start på lobby-visningen.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/lobby" className="inline-flex items-center rounded-full bg-nordic-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-nordic-400">
                Gå til lobby
              </Link>
              <Link href="/parkour" className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/90">
                Gå til parkour
              </Link>
              <Link href="/profile" className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/90">
                Min profil
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-slate-300">Laster profiler...</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500 bg-red-950/30 p-8 text-red-200">Feil: {error}</div>
        ) : profiles.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-slate-300">Ingen profiler funnet ennå.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {profiles.map((profile) => (
              <article key={profile.userId} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 shadow-xl shadow-slate-950/20">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-3xl bg-slate-800 text-center leading-16 text-2xl font-bold text-white">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{profile.displayName}</h2>
                    <p className="text-sm text-slate-400">{profile.bio ? profile.bio : 'Ingen bio satt'}</p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">E-post</p>
                  <p className="mt-2 text-sm text-slate-200 break-words">{profile.userId}@nordic.local</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
