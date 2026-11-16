import { defineConfig, type ProxyOptions } from "vite";
import react from "@vitejs/plugin-react-swc";

// Il browser chiama /api e /auth sullo stesso host del frontend; Vite inoltra al backend.
// L'header Origin viene rimosso così Spring non applica il controllo CORS alle richieste proxate.
const backend: ProxyOptions = {
  target: "http://localhost:8080",
  changeOrigin: true,
  configure: (proxy) => {
    proxy.on("proxyReq", (proxyReq) => proxyReq.removeHeader("origin"));
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      "/api": backend,
      "/auth": backend,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "bootstrap/scss/functions" as *;
          @use "bootstrap/scss/mixins" as *;
        `,
      },
    },
  },
});
