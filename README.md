# My Blog 

A retro-style blog template that brings back the classic web aesthetic of the 1990s and early 2000s, complete with nostalgic design elements.

## Stack

- Vite
- React + TSX
- TypeScript

## Project Structure

- src/main.tsx: app bootstrap
- src/App.tsx: routes and app shell wiring
- src/layout/: global layout components
- src/pages/: page content in TSX
- src/components/: reusable UI pieces
- src/hooks/: custom hooks
- src/lib/: shared libraries (i18n)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Build For GitHub Pages

```bash
npm run build:gh
```

This command generates `dist/` using `--base=/blog/` for the `SantiiRepair/blog` repository path.

## Scrollbar Credits

The custom scrollbar styling used in this project is based on the work from:
[https://gist.github.com/Dakedres/0ccda599648833a1c2f65d3967aa131b](https://gist.github.com/Dakedres/0ccda599648833a1c2f65d3967aa131b)

Special thanks to the original author for sharing this scrollbar.

---

*Best viewed in Netscape Navigator 4.0 or Internet Explorer 5.0 at 800×600 resolution*
