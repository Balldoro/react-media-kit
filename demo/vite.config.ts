import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "stream-player": new URL("../src/index.ts", import.meta.url).pathname,
      "@": new URL("../src", import.meta.url).pathname,
    },
  },
});
