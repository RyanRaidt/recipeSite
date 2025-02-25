import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Load environment variables
const API_URL =
  process.env.VITE_API_URL || "https://recipe-round-table-0ovf.onrender.com";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy:
      process.env.NODE_ENV === "development"
        ? {
            "/api": {
              target: "http://localhost:3000",
              changeOrigin: true,
              secure: false,
            },
          }
        : {}, // No proxy in production
  },
  define: {
    "import.meta.env.VITE_API_URL": JSON.stringify(API_URL),
  },
});
