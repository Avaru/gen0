# gen0

Local Vue/TypeScript cyberpunk name generator. See the [app guide](docs/app.md) for usage, code layout, and data sources.

I do not allow any of the data in this project to be used for training or developing AI models without my explicit permission.

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

Individual commands: `npm run build`, `npm run test:unit -- --run`, and `npm run lint` (applies fixes).

## Deploy

Serve `dist/` over HTTP. Configure `index.html` as the fallback for generator and About paths, including direct links and reloads. Opening files through `file://` is unsupported.

For Vercel, import `main` with the Vite preset, repository root, `dist` output, and Node 24 or a newer supported version. No environment variables are required. `vercel.json` sets `npm run check` as the build command and supplies the route fallback; leave dashboard build overrides disabled. Verify direct generator and About links after deployment.
