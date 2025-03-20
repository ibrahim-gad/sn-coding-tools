import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    title: 'SN Coding Tools',
    favicon: './src/assets/turing.svg',
  },
  plugins: [pluginReact()],
  server: {
    base: '/sn-coding-tools',
  },
});
