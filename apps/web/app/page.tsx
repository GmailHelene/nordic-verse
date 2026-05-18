import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/40">
          <h1 className="text-4xl font-semibold text-nordic-200 sm:text-5xl">Nordic Verse</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            En sosial 3D-lobby, konkurransemodus og UGC-editor i én webopplevelse. Start her for å utvikle MVP-en sammen.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Card title="Hub" description="3D-lobby i Three.js med spillere, venner og miniobjekter." />
            <Card title="Parkour" description="Tidtakingsbane med leaderboard og enkel konkurranse." />
            <Card title="Editor" description="Bygg baner med blokker og lagre dem som JSON." />
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/login" className="rounded-full bg-nordic-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-nordic-400">
              Logg inn
            </Link>
            <Link href="/register" className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-800/90">
              Registrer
            </Link>
          </div>
        </div>

        <section id="tech" className="mt-16 space-y-6">
          <Section title="Teknisk stack">
            <p>Next.js + React + Tailwind for UI. Three.js for 3D. Node.js for API og realtime. Lokal SQLite + JWT for auth og data.</p>
          </Section>
          <Section title="MVP-kjernefunksjoner">
            <ul className="list-disc space-y-2 pl-5 text-slate-300">
              <li>Brukerprofil og autentisering</li>
              <li>3D-hub og parkourbane</li>
              <li>Leaderboard og poeng</li>
              <li>UGC-editor med blokkplassering</li>
              <li>Foreldre-modus og moderering</li>
            </ul>
          </Section>
        </section>

        <section id="roadmap" className="mt-16 rounded-3xl border border-white/10 bg-slate-900/80 p-10">
          <h2 className="text-3xl font-semibold text-nordic-100">Roadmap</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <RoadmapItem title="1–2" subtitle="Fundament" description="Monorepo, Next.js, lokal database og API skeleton." />
            <RoadmapItem title="3–4" subtitle="Hub + konkurranse" description="3D lobby, hardkodet parkour og leaderboard." />
            <RoadmapItem title="5–6" subtitle="UGC-editor" description="Grid-builder, lagring av baner og testmodus." />
          </div>
        </section>
      </section>
    </main>
  );
}

function Card({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-xl shadow-slate-950/20">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-slate-300">{description}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      <div className="mt-3 text-slate-300">{children}</div>
    </div>
  );
}

function RoadmapItem({ title, subtitle, description }: { title: string; subtitle: string; description: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
      <div className="text-sm uppercase tracking-[0.2em] text-nordic-300">Måned {title}</div>
      <h4 className="mt-3 text-xl font-semibold text-white">{subtitle}</h4>
      <p className="mt-2 text-slate-300">{description}</p>
    </div>
  );
}
