import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://staging.portalteam.org',
        changeOrigin: true,
        secure: false, // Set to false if the target is using self-signed SSL
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
