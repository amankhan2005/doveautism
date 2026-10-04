import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const shared = fileURLToPath(new URL('../shared', import.meta.url));

// Development only: where `npm run dev:server` listens (server PORT, default 5050).
// Not :5000 — on macOS that is AirPlay Receiver, which answers /api with an empty 403.
const API_TARGET = process.env.API_PROXY_TARGET || 'http://localhost:5050';

/**
 * Preload the three font files used above the fold so text renders in its
 * final font on first paint (avoids layout shift from font swapping).
 */
function preloadFonts() {
  const wanted = [/lexend-latin-wght-normal.*\.woff2$/, /atkinson-hyperlegible-latin-400-normal.*\.woff2$/, /atkinson-hyperlegible-latin-700-normal.*\.woff2$/];
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml(_html, ctx) {
      if (!ctx.bundle) return [];
      return Object.keys(ctx.bundle)
        .filter((file) => wanted.some((re) => re.test(file)))
        .map((file) => ({
          tag: 'link',
          attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
          injectTo: 'head',
        }));
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadFonts()],
  resolve: { alias: { '@shared': shared } },
  server: {
    port: 5173,
    fs: { allow: ['..'] },
    // In development, API + SEO routes are served by Express (see API_TARGET).
    proxy: {
      '/api': API_TARGET,
      '/sitemap.xml': API_TARGET,
      '/robots.txt': API_TARGET,
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
