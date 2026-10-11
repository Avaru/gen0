# gen0

Local Vue/TypeScript cyberpunk name generator. See the [app guide](docs/app.md) for usage, code layout, and data sources.

I do not allow any of the data in this project to be used for training or developing AI models without my explicit permission.

The [character data model](docs/character-data-model.md) and CBR+PNK seed catalogue are available in `src/data/characters/`. The “char” link opens a blank editable sheet backed by Pinia; no character generation is implemented.

## Run

Node 24 is the minimum; prefer a newer version.

```sh
npm ci
npm run dev
```

## Check and build

```sh
npm run check
npm run preview
```

`check` runs lint without edits, unit tests, TypeScript checks, and the production build. Output goes to `dist/`; `preview` serves that build locally.

Unit tests run in Node by default; UI test files opt into jsdom with `@vitest-environment jsdom`. Test files remain isolated and use at most two workers when `CI` or `VERCEL` is set, limiting CPU and memory pressure during deployment checks.

Individual commands: `npm run build`, `npm run test:unit -- --run`, and `npm run lint` (applies fixes).

## Deploy

Serve `dist/` over HTTP. Configure `index.html` as the fallback for generator and About paths, including direct links and reloads. Opening files through `file://` is unsupported.

For Vercel, import `main` with the Vite preset, repository root, `dist` output, and Node 24 or a newer supported version. No environment variables are required. `vercel.json` sets `npm run check` as the build command and supplies the route fallback; leave dashboard build overrides disabled. Verify direct generator and About links after deployment.
