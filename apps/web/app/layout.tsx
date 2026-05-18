import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Nordic Verse',
  description: 'Sosial 3D hub, parkour og UGC-editor for Nordic Verse'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="no">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_30%),radial-gradient(circle_at_20%_20%,_rgba(59,130,246,0.08),_transparent_18%),#020617]">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight text-white">
                Nordic Verse
              </Link>
              <nav className="hidden items-center gap-3 md:flex">
                <Link href="/dashboard" className="rounded-full border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-900">
                  Dashboard
                </Link>
                <Link href="/lobby" className="rounded-full border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-900">
                  Lobby
                </Link>
                <Link href="/parkour" className="rounded-full border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-900">
                  Parkour
                </Link>
                <Link href="/profile" className="rounded-full border border-slate-700 bg-slate-950/90 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-900">
                  Profil
                </Link>
              </nav>
            </div>
          </header>
          <main className="min-h-[calc(100vh-80px)]">{children}</main>
        </div>
      </body>
    </html>
  );
}
