'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, authHeaders, clearToken, getToken } from '../../lib/auth';

type ProfileResponse = {
  user: { id: number; email: string; role: string };
  profile: { displayName: string; avatarUrl?: string; bio?: string } | null;
};

type ScoreItem = {
  mapId: number;
  score: number;
  createdAt: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [scores, setScores] = useState<ScoreItem[]>([]);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/me`, {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
          }
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Kunne ikke hente profil.');
        }

        const data: ProfileResponse = await response.json();
        setProfile(data);
        setDisplayName(data.profile?.displayName || '');
        setBio(data.profile?.bio || '');
        setAvatarUrl(data.profile?.avatarUrl || '');
      } catch (error) {
        clearToken();
        router.push('/login');
      }
    };

    const fetchScores = async () => {
      try {
        const response = await fetch(`${API_URL}/scores/me`, {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
          }
        });
        if (!response.ok) {
          return;
        }
        const data = await response.json();
        setScores(data.scores || []);
      } catch {
        // ignore score load failures for nå
      }
    };

    Promise.all([fetchProfile(), fetchScores()]).finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    clearToken();
    router.push('/login');
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify({ displayName, bio, avatarUrl })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Kunne ikke oppdatere profilen.');
      }

      setProfile((current) => current && { ...current, profile: data.profile });
      setSuccess('Profil oppdatert!');
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Uventet feil.';
      setMessage(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/85 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Brukerområde</p>
              <h1 className="mt-2 text-4xl font-semibold text-white">Min profil</h1>
              <p className="mt-2 text-slate-400">Oppdater visningsnavn, bio og avatar, og se scorehistorikken din.</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-950/90 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-900"
            >
              Logg ut
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20">
            <h2 className="text-2xl font-semibold text-white">Rediger profil</h2>
            <p className="mt-2 text-slate-400">Endre hvordan du vises i lobby og leaderboard.</p>

            <form className="mt-8 space-y-6" onSubmit={handleSave}>
              <label className="block">
                <span className="text-sm text-slate-300">Visningsnavn</span>
                <input
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Avatar URL</span>
                <input
                  value={avatarUrl}
                  onChange={(event) => setAvatarUrl(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  placeholder="https://..."
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Bio</span>
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  rows={4}
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Lagrer...' : 'Lagre profil'}
              </button>

              {message && <p className="text-sm text-rose-300">{message}</p>}
              {success && <p className="text-sm text-emerald-300">{success}</p>}
            </form>
          </section>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800 text-3xl font-bold text-white">
                  {profile?.profile?.displayName?.charAt(0).toUpperCase() || 'N'}
                </div>
                <div>
                  <p className="text-sm text-slate-400">Brukernavn</p>
                  <p className="text-lg font-semibold text-white">{profile?.profile?.displayName || 'Gjest'}</p>
                </div>
              </div>
              <div className="mt-6 space-y-3 text-slate-300">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">E-post</p>
                  <p className="mt-1 text-sm text-white">{profile?.user.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bio</p>
                  <p className="mt-1 text-sm text-slate-300">{profile?.profile?.bio || 'Ingen bio satt ennå.'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
              <h3 className="text-xl font-semibold text-white">Scorehistorikk</h3>
              {loading ? (
                <p className="mt-4 text-slate-400">Laster scorehistorikk...</p>
              ) : scores.length === 0 ? (
                <p className="mt-4 text-slate-400">Ingen scoreregistreringer enda.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {scores.map((item, index) => (
                    <div key={`${item.mapId}-${item.createdAt}-${index}`} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm text-slate-400">Kart</p>
                          <p className="text-sm font-semibold text-white">{item.mapId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Tid</p>
                          <p className="text-sm font-semibold text-cyan-200">{item.score}s</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString('no-NO')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
