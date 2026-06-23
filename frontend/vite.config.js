import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Set the limit in KB (e.g., 1000 KB = 1 MB). Default is 500.
    chunkSizeWarningLimit: 1000,
  },
});
