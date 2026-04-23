import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "astro/config";

const imageMime = {
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

function serveDocsImages() {
  return {
    name: "serve-docs-images",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        const mime = imageMime[path.extname(url)];
        if (!mime) return next();
        const filePath = path.join(process.cwd(), "docs", url);
        if (!fs.existsSync(filePath)) return next();
        res.setHeader("Content-Type", mime);
        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
}

export default defineConfig({
  output: "static",
  outDir: "./docs",
  site: "https://www.enure.net",
  vite: {
    build: { emptyOutDir: false },
    plugins: [serveDocsImages()],
  },
});
