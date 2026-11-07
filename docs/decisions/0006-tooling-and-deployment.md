# 0006: Tooling and deployment

Use Node 24.x locally and on Vercel. Keep development, validation, and deployment commands in `package.json` so local checks and deployment use the same steps.

## Checks

`npm run check` runs lint without edits, unit tests, TypeScript checks, and the production build. Output goes to `dist/`; `npm run preview` serves that build locally.

Individual commands are `npm run build`, `npm run test:unit -- --run`, and `npm run lint` (applies fixes). Run `npm run format` after changes; meaningful generator changes also require build, unit tests, and lint, as specified in [working instructions](../../AGENTS.md).

Unit tests run in Node by default; UI test files opt into jsdom with `@vitest-environment jsdom`. Unexpected console warnings and errors fail the responsible test; tests for intentional diagnostics must install a spy and assert its calls. Mocks and stubbed globals are restored before each test. Test files remain isolated and use at most two workers when `CI` or `VERCEL` is set, limiting CPU and memory pressure during deployment checks.

Linting uses Oxlint with its built-in Vue and Vitest plugins; `vue-tsc` handles type checking. Oxlint checks Vue script sections but does not replace all ESLint Vue template rules. The Oxc editor extension is recommended.

## Hosting

Serve `dist/` over HTTP. Configure `index.html` as the fallback for app routes, including direct generator, sheet, and About links and reloads. Opening files through `file://` is unsupported.

For Vercel, import `main` with the Vite preset, repository root, `dist` output, and Node 24. No environment variables are required by default. `vercel.json` sets `npm run check` as the build command and supplies the route fallback; leave dashboard build overrides disabled. Never Midnight is an optional [build-time setting](0001-local-app-and-data.md#never-midnight-availability). Verify direct generator and About links after deployment.
