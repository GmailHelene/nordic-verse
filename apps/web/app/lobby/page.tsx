'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL, authHeaders, getToken } from '../../lib/auth';

type Profile = {
  userId: number;
  displayName: string;
  bio?: string;
};

export default function LobbyPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);
  const token = getToken();
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    fetch(`${API_URL}/profiles`)
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json();
          throw new Error(payload.error || 'Kunne ikke hente spillerliste.');
        }
        return res.json();
      })
      .then((data) => {
        setProfiles(data.profiles || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const activePlayers = profiles.length + (joined ? 1 : 0);
  const availablePlayers = profiles.slice(0, 8);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-nordic-100">Nordic Lobby</h1>
              <p className="mt-3 text-slate-300">En enkel sosial lobby for å se spillere, velge spillmodus og starte en session.</p>
            </div>
            <Link href="/dashboard" className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-900">
              Tilbake til dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Lobby-status</p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-4xl font-semibold text-white">{activePlayers}</p>
                    <p className="text-slate-400">aktive spillere i lobbyen</p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setJoined(!joined)}
                      className="rounded-full bg-nordic-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-nordic-400"
                    >
                      {isLoggedIn ? (joined ? 'Forlat lobby' : 'Bli med i lobby') : 'Logg inn for å bli med'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <h2 className="text-xl font-semibold text-white">Kommende session</h2>
                <p className="mt-3 text-slate-300">
                  Neste kamp starter om 2 minutter. Velg spillmodus og gjør deg klar. Når du er med i lobbyen, kan du gå rett inn i baner.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Spillere i lobby</p>
              <div className="mt-5 space-y-3">
                {loading ? (
                  <p className="text-slate-400">Laster spillere...</p>
                ) : error ? (
                  <p className="text-red-300">{error}</p>
                ) : availablePlayers.length === 0 ? (
                  <p className="text-slate-400">Ingen spillere er i lobbyen ennå.</p>
                ) : (
                  availablePlayers.map((profile) => (
                    <div key={profile.userId} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="font-semibold text-white">{profile.displayName}</p>
                      <p className="text-sm text-slate-400">{profile.bio || 'Klar for match'}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/40">
          <h2 className="text-2xl font-semibold text-white">Klar for neste runde?</h2>
          <p className="mt-3 text-slate-300">Velg en modus og trykk deg videre til parkour- eller konkurranseområdet.</p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Link href="/parkour" className="rounded-full bg-nordic-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-nordic-400">
              Gå til parkour
            </Link>
            <Link href="/dashboard" className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/90">
              Tilbake til dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
