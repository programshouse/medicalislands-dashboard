import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.programshouse.com/dashboards/medical',
        changeOrigin: true,
        secure: false,
        ws: true,
        timeout: 10000,
      }
    }
  },
  build: {
    sourcemap: true,
  },
});
