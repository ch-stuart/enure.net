## enure.net

- [www.enure.net](https://www.enure.net)

Built with Astro and Bun. Images are pre-processed by Sharp into AVIF/WebP/JPEG at two widths (660px, 990px) and committed to `docs/` for GitHub Pages.

```sh
bun run build:images   # process src/images/ → docs/images/
bun run build          # build:images + astro build
bun run dev            # dev server (run build:images first)
```
