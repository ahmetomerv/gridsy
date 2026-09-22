# Development

Gridsy keeps the framework-agnostic library, React demo, and documentation in separate layers inside one repository.

## Install dependencies

```sh
npm ci
npm --prefix demo ci
```

## Work on the library

```sh
npm run typecheck
npm test
npm run lint
npm run build
npm run verify
```

## Run the documentation

```sh
npm run docs:dev
```

## Run the demo

```sh
npm run demo:dev
```

The demo imports the library source through a Vite alias, so local library changes are reflected without publishing the package.

## Build the complete website

```sh
npm run site:build
```

This builds VitePress at the site root and places the production demo under `docs/.vitepress/dist/demo/`, matching the GitHub Pages URL structure.
