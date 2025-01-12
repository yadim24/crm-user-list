import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  console.log(`vite mode => ${mode}`);

  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      checker({
        // Typechecking in development mode
        typescript: true,
        // Linting in production mode
        ...(mode === 'production' && {
          eslint: {
            lintCommand:
              'eslint "./src/**/*.{ts,tsx}"' +
              ' --report-unused-disable-directives' +
              ' --max-warnings 0',
          },
        }),
      }),
    ],
    server: {
      port: 3007,
      proxy: {
        '/api': {
          target: env.VITE_PROXY,
          changeOrigin: true,
        },
      },
      watch: {
        /**
         * Для устранения бага "Uncaught SyntaxError: The requested
         * module '/src/SomeComponent.ts?t=1684657356454' does not provide
         * an export named 'SomeComponent'" нужно включить polling, это
         * касается только Ubuntu. Проблема может быть решена как после
         * очередного обновления VSCode или vite. В других редакторах на
         * Ubuntu этот баг не проявляется. Проблема кроется в модуле
         * chokidar (зависимость vite).
         * https://vitejs.dev/config/server-options.html#server-watch
         * Влияет на загрузку процессора, поэтому после обновлений VSCode или
         * vite пробовать отключать этот параметр.
         */
        usePolling: !!env.XDG_SESSION_DESKTOP?.includes('ubuntu'),
      },
    },
    preview: {
      port: 3070,
      proxy: {
        // При запуске vite preview, mode = production и используется
        // .env.production
        '/api': {
          target: env.VITE_PROXY,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'build',
      chunkSizeWarningLimit: 1000,
    },
  };
});
