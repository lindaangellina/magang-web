import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Setiap permintaan ke /api... dari frontend diteruskan Vite ke backend (api-magang).
      // Browser hanya melihat SATU origin (localhost:5173), jadi CORS tidak terlibat di development.
      // /api/docs ikut diproksi: dokumentasi terbuka di http://localhost:5173/api/docs/
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
