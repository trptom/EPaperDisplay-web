import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server:
    command === 'serve'
      ? (() => {
          // shared proxy options for backend routes used during development
          const backendProxy = {
            target: 'http://localhost:8000',
            changeOrigin: true,
            secure: false,
            ws: true,
            cookieDomainRewrite: 'localhost',
            cookiePathRewrite: '/',
            // Keep the path as-is. If your backend expects a base prefix, add
            // a `rewrite` here.
            // rewrite: (path: string) => path,
          }

          return {
            proxy: {
              '/ws': {
                ...backendProxy,
                // rewrite removes the leading /ws so /ws/foo -> /foo on the backend
                rewrite: (path: string) => path.replace(/^\/ws/, ''),
              },
            },
          }
        })()
      : undefined,
}))
