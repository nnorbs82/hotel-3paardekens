# Hotel 3 Paardekens v2

This folder contains the next-generation website for Hotel 3 Paardekens.

It is intentionally isolated from the legacy production website while development takes place on the `redesign` branch.

## Stack

- Astro static site generation
- Pages CMS for GitHub-based content editing
- Existing Hotel 3 Paardekens photography copied into the build from the legacy asset folders
- Mews Distributor for booking
- No application database required for normal website content

## Local development

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

The build script synchronizes the real hotel images from the repository before Astro starts.

## Production build

```bash
npm run build
```

Output is written to `dist/`.
