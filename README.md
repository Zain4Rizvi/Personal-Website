# Zain Rizvi, portfolio

Next.js (App Router) + TypeScript + Tailwind v4, deployed to Cloudflare Workers with OpenNext.

```bash
npm install
npm run dev                         # http://localhost:3000
npm run preview                     # test in the Workers runtime
npm run deploy                      # deploy to Cloudflare Workers
docker compose up --build -d        # optional Node.js container on :3000
```

- Content: `content/*.json` and `content/projects/*.mdx`. JSON is imported statically, and project MDX is compiled into a TypeScript module before dev/build. Same data at `/api/profile` and `/llms.txt`.
- Configure the political-donations API credentials as Worker secrets/vars (or in `.dev.vars` for local preview): `SUPABASE_DB_URL`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY`. The app does not load a sibling project's `.env` file at runtime.
- Ray-tracer hero mount point: `components/HeroMount.tsx`.
- Analytics: set `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` (build time) to enable Cloudflare Web Analytics. Unset = no beacon.
- Replace placeholders: `public/zain.jpg`, `public/resume.pdf`. Search for `TODO` in `content/` for unknown project details.
- Playable assembly demo: `public/demos/assembly/` (copy of `Assembly Game/`; re-copy if the game changes).
- Sibling project folders at the repo root are source only and are excluded from the site and Docker build.
