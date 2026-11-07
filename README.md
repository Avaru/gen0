# gen0

Local Vue/TypeScript generator with bundled data, setting-specific categories, and character sheets. Generation runs in the browser without a backend or account.

## Run

Use Node 24.x locally.

```sh
npm ci
npm run dev
```

## Check and build

```sh
npm run check
npm run preview
```

`check` runs lint, unit tests, TypeScript checks, and the production build. Output goes to `dist/`; `preview` serves that build locally.

## Documentation

- [App guide](docs/app.md): usage, code layout, and data sources.
- [Working instructions](AGENTS.md): contribution rules and required checks.
- [Local app and bundled data](docs/decisions/0001-local-app-and-data.md): project scope, data ownership, and enabling Never Midnight.
- [Interface and navigation](docs/decisions/0002-interface-and-navigation.md): routes, themes, accessibility, and portrait prompts.
- [Personal names and regional mixes](docs/decisions/0003-personal-names-and-regional-mixes.md): naming traditions and composition.
- [Content generation](docs/decisions/0004-content-generation.md): setting-specific generator behavior.
- [Character sheets and sharing](docs/decisions/0005-character-sheets-and-sharing.md): generation, saving, URL sharing, and printing.
- [Tooling and deployment](docs/decisions/0006-tooling-and-deployment.md): test/lint choices and Vercel setup.
- [Character data model](docs/character-data-model.md): sheet fields, profiles, and source mappings.

I do not allow any of the data in this project to be used for training or developing AI models without my explicit permission.
I build this to fun, not to show off. Don't judge my dev skills by this.
