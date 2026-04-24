// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icon-192.png", "icon-512.png", "why_card_dark.png"],
        manifest: {
          name: "SQL.ref — Why Solutions",
          short_name: "SQL.ref",
          description: "Referência de comandos e funções SQL",
          theme_color: "#121212",
          background_color: "#121212",
          display: "standalone",
          orientation: "any",
          scope: "/",
          start_url: "/",
          icons: [
            {
              src: "icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,png,svg,woff2}"],
          maximumFileSizeToCacheInBytes: 3145728,
        },
      }),
    ],
  },
});
