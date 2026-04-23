# enure.net

Personal website served via GitHub Pages at www.enure.net.

## Stack

- **Framework**: Astro (static output)
- **Runtime**: Bun
- **Image processing**: Sharp
- **Hosting**: GitHub Pages (served from `docs/`)
- **Linting/formatting**: oxlint + oxfmt
- **Analytics**: Umami

## Build pipeline

```
bun run build          # build:images then astro build
bun run build:images   # src/images/ → docs/images/{660,990}/
bun run dev            # astro dev (requires build:images to have run first)
```

`build:images` wipes and recreates the entire `docs/` directory, then Astro writes HTML/assets into it. `astro.config.mjs` sets `emptyOutDir: false` so Astro doesn't clobber the pre-built images.

For dev, run `build:images` once first, then `astro dev`. The dev server has a custom Vite middleware that serves files directly from `docs/images/`.

## Project structure

```
src/
  images/              # source JPEGs (input only)
  pages/index.astro    # page shell: meta, global styles, Umami script
  components/
    Grid.astro         # layout + keyboard nav
    Cell.astro         # focusable wrapper cell
    ContentCell.astro  # the text/intro cell
    PhotoCell.astro    # <picture> with AVIF/WebP/JPEG srcset
scripts/
  build-images.ts      # Sharp image processing script
public/                # CNAME, favicon.ico, robots.txt
docs/                  # fully generated — never edit directly
```

## Image pipeline

Source images live in `src/images/` (JPEG). `build:images` produces two widths per image in three formats:

- **660px** — AVIF, WebP, JPEG
- **990px** — AVIF, WebP, JPEG

Quality: JPEG 75, WebP 75, AVIF 50. Sharp's `.rotate()` is applied to auto-correct EXIF orientation.

The `sizes` attribute on all `<picture>` elements is `min(60vw, 330px)`.

## Grid layout

`Grid.astro` enumerates images by globbing `docs/images/660/*.jpg` at build time. Dimensions are auto-calculated:

```
cols = ceil(sqrt(total))   // total = image count + 1 (for ContentCell)
rows = ceil(total / cols)
```

The first cell is always `ContentCell`; the rest are `PhotoCell`s sorted by filename. The first 4 images (plus the first row's trailing images) load eagerly; image 0 gets `fetchpriority="high"`. Touch devices get CSS scroll-snap.

## Key constraints

- `docs/` is fully generated — never edit files there directly
- `build:images` must run before `astro dev` or `astro build`
- `build:images` wipes all of `docs/` — always run it before Astro, not after
- oxlint and oxfmt are configured to ignore `docs/`

## Deployment

Commit the `docs/` directory to `main`. GitHub Pages serves it automatically. No CI — the build runs locally.
