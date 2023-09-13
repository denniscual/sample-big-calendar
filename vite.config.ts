import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  server: {
    proxy: {
      "/api/countries": {
        target: "https://timeapi.io/api",
        changeOrigin: true,
        rewrite: (path) => path.replace("api/countries", ""),
      },
    },
  },
});
