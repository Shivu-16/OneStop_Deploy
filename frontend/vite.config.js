import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss("./tailwind.config.js"),
    autoprefixer(),
    react(),
  ],
});
