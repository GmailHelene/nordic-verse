'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL, authHeaders, clearToken, getToken } from '../../lib/auth';

type ProfileResponse = {
  user: { id: number; email: string; role: string };
  profile: { displayName: string; avatarUrl?: string; bio?: string } | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    fetch(`${API_URL}/me`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      }
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Kunne ikke hente profil.');
        }
        return res.json();
      })
      .then((data: ProfileResponse) => {
        setProfile(data);
      })
      .catch((error) => {
        clearToken();
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    clearToken();
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/80 p-10 shadow-xl shadow-slate-950/40">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold text-nordic-100">Min profil</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-900"
          >
            Logg ut
          </button>
        </div>

        {message && <p className="mt-4 text-slate-300">{message}</p>}
        {loading ? (
          <p className="mt-6 text-slate-300">Laster profil...</p>
        ) : profile ? (
          <div className="mt-8 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">E-post</p>
              <p className="mt-2 text-lg text-white">{profile.user.email}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">Navn</p>
              <p className="mt-2 text-lg text-white">{profile.profile?.displayName || 'Ingen navn satt'}</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
              <p className="text-sm text-slate-400">Bio</p>
              <p className="mt-2 text-lg text-white">{profile.profile?.bio || 'Ingen bio satt ennå.'}</p>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-slate-300">Kunne ikke laste profil.</p>
        )}
      </div>
    </main>
  );
}
