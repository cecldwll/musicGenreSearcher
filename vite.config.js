import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  optimizeDeps: {
    exclude: ['js/lastfm.api.md5.js', 'js/lastfm.api.js']
  },

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        genre: resolve(__dirname, "src/genre.html")
      }
    }
  }
});
