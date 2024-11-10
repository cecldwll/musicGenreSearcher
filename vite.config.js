import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        genre: resolve(__dirname, "genre.html")
      }
    }
  }
});
