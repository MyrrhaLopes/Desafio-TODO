import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //configuração para evitar problemas de CORS entre front pelo vite e servidor com express
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
