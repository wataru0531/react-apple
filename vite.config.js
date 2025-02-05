

import { defineConfig } from 'vite';
// import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // ViteはデフォルトでReactに対応していないため、このプラグインを入れることでJSXなどを処理できるようになる
    react(),

    // Sentry（エラートラッキングツール）の Vite プラグイン。
    // sentryVitePlugin({
    //   org: "jsm-x9", // Sentry の組織ID。
    //   project: "javascript-react" // このプロジェクト名
    // })
  ],
  build: {
    sourcemap: true,
  }
})
