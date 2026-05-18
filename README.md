# Nordic Verse

Monorepo-skisse for et sosialt 3D-spill og UGC-editor med Next.js, Three.js, Supabase og real-time Node-tjenester.

## Struktur

- `apps/web` - Next.js + React frontend
- `apps/api` - Node.js REST API skeleton
- `apps/realtime` - WebSocket server skeleton for posisjon og timer
- `apps/ai` - Python-mikrotjeneste for moderering og editorforslag
- `packages/ui` - delt UI-komponentpakke

## Kjøre prosjektet

1. Installer avhengigheter fra rotmappen:

```bash
npm install
```

2. Start dev-server for alle pakker:

```bash
npm run dev
```

3. Åpne `apps/web` i nettleser etter oppstart.

## Neste steg

- Legge til Supabase-skjema og autentisering
- Implementere Three.js-lobby og parkour-scene
- Bygge UGC-editor med grid-basert blokkplassering
- Lage foreldre/admin-panel og rollebasert tilgang
