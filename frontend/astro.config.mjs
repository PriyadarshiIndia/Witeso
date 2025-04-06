// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import preact from '@astrojs/preact';
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  output: "server", // Enable server-side rendering (SSR)
  adapter: vercel(), // Use the Vercel adapter
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    preact({
      include: ['**/*.jsx'],
      compat: true
    })
  ]
});