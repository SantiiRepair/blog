import { resolve } from "node:path";
import { defineConfig } from "vite";

const root = process.cwd();

export default defineConfig(({ isSsrBuild }) => ({
  root: resolve(root),
  base: "/",
  publicDir: resolve(root, "public"),
  // The build-time renderer (src/entry-server.tsx) is bundled with its dependencies
  // and emitted as .mjs so scripts/prerender.js can import it from Node.
  ...(isSsrBuild && {
    ssr: { noExternal: true },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "[name].mjs",
          chunkFileNames: "[name]-[hash].mjs"
        }
      }
    }
  })
}));
