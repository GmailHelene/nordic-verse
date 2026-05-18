'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_URL, authHeaders, getToken } from '../../lib/auth';

type ProfileResponse = {
  user: { id: number; email: string; role: string };
  profile: { displayName: string; bio?: string; avatarUrl?: string } | null;
};

type LeaderboardEntry = {
  displayName: string;
  score: number;
  createdAt: string;
};

const checkpoints = ['Start port', 'Tunnel', 'Sky bridge', 'Mål'];

export default function ParkourPage() {
  const [playerName, setPlayerName] = useState('Gjest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [runTime, setRunTime] = useState(0);
  const [runState, setRunState] = useState<'ready' | 'running' | 'finished'>('ready');
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [passedCheckpoints, setPassedCheckpoints] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const token = getToken();
  const nextCheckpoint = checkpoints[passedCheckpoints] || 'Ingen flere sjekkpunkt';
  const canFinish = runState === 'running' && passedCheckpoints >= checkpoints.length;

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/me`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      })
        .then(async (res) => {
          if (!res.ok) {
            const payload = await res.json();
            throw new Error(payload.error || 'Kunne ikke hente profil.');
          }
          return res.json();
        })
        .then((data: ProfileResponse) => {
          setPlayerName(data.profile?.displayName || data.user.email);
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    window.fetch(`${API_URL}/leaderboard?mapId=1`)
      .then(async (res) => {
        if (!res.ok) {
          const payload = await res.json();
          throw new Error(payload.error || 'Kunne ikke hente leaderboard.');
        }
        return res.json();
      })
      .then((data: { leaderboard: LeaderboardEntry[] }) => {
        setLeaderboard(data.leaderboard || []);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  useEffect(() => {
    let interval: number | null = null;
    if (runState === 'running') {
      interval = window.setInterval(() => {
        setRunTime((current) => current + 1);
      }, 1000);
    }
    return () => {
      if (interval !== null) window.clearInterval(interval);
    };
  }, [runState]);

  const handleStart = () => {
    setRunTime(0);
    setRunState('running');
    setPassedCheckpoints(0);
    setError('');
  };

  const handleCheckpoint = () => {
    if (runState !== 'running' || passedCheckpoints >= checkpoints.length) return;
    setPassedCheckpoints((current) => current + 1);
  };

  const handleFinish = async () => {
    if (!canFinish) return;
    setRunState('finished');
    const finalTime = runTime;
    setBestTime((current) => (current ? Math.min(current, finalTime) : finalTime));

    if (!token) {
      setError('Logg inn for å registrere tiden i leaderboard.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify({ score: finalTime, mapId: 1 })
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error || 'Kunne ikke sende score.');
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setError('Tiden ble sendt til leaderboard!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'En uventet feil oppstod.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-nordic-100">Parkour Challenge</h1>
              <p className="mt-3 text-slate-300">Kjør en tidsbasert parkourløype med checkpoints og leaderboard.</p>
            </div>
            <Link href="/lobby" className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-900">
              Tilbake til lobby
            </Link>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Spiller</p>
                <p className="mt-2 text-2xl font-semibold text-white">{playerName}</p>
                {loading ? <p className="mt-2 text-slate-400">Laster spillerdata...</p> : null}
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Status</p>
                <p className="mt-2 text-lg text-white">
                  {runState === 'ready' ? 'Klar til start' : runState === 'running' ? 'Løype i gang' : 'Løype fullført'}
                </p>
                <p className="mt-2 text-slate-400">Tid: {runTime}s</p>
                <p className="mt-2 text-slate-400">Sjekkpunkter passert: {passedCheckpoints}/{checkpoints.length}</p>
                <p className="mt-2 text-slate-400">Neste: {runState === 'running' ? nextCheckpoint : 'Trykk start'}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <h2 className="text-xl font-semibold text-white">Kontroller løypa</h2>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleStart}
                  disabled={runState === 'running'}
                  className="rounded-full bg-nordic-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-nordic-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Start løypa
                </button>
                <button
                  type="button"
                  onClick={handleCheckpoint}
                  disabled={runState !== 'running' || passedCheckpoints >= checkpoints.length}
                  className="rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {passedCheckpoints < checkpoints.length ? `Passer checkpoint: ${nextCheckpoint}` : 'Ingen flere checkpoints'}
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={!canFinish}
                  className="rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Fullfør runden
                </button>
              </div>
            </div>
          </div>

          {error ? <div className="mt-8 rounded-3xl border border-red-500 bg-red-950/30 p-6 text-red-200">{error}</div> : null}

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Bestetid</h2>
            <p className="mt-3 text-slate-300">{bestTime ? `${bestTime}s` : 'Ingen tid registrert enda.'}</p>
            <p className="mt-4 text-sm text-slate-500">Logg inn for å sende tiden din til leaderboardet og se deg på topplisten.</p>
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <h2 className="text-xl font-semibold text-white">Leaderboard</h2>
            <p className="mt-3 text-slate-400">Beste tider på parkour-kart 1.</p>
            <div className="mt-4 space-y-3">
              {leaderboard.length === 0 ? (
                <p className="text-slate-400">Ingen tider er registrert enda.</p>
              ) : (
                leaderboard.map((entry, index) => (
                  <div key={`${entry.displayName}-${entry.createdAt}`} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-white">{index + 1}. {entry.displayName}</p>
                        <p className="text-sm text-slate-400">{new Date(entry.createdAt).toLocaleString('no-NO')}</p>
                      </div>
                      <p className="text-lg font-semibold text-nordic-200">{entry.score}s</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
