import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  html: {
    title: 'SN Coding Tools',
    template: './public/index.html',
    favicon: './src/assets/turing.svg',
    scriptLoading: 'defer',
    inject: 'head',
    meta: {
      viewport: 'width=device-width, initial-scale=1.0',
    },
    templateParameters: {
      title: 'SN Coding Tools',
      ghPagesScript: `
        // Single Page Apps for GitHub Pages
        // MIT License
        // https://github.com/rafgraph/spa-github-pages
        (function(l) {
          if (l.search[1] === '/' ) {
            var decoded = l.search.slice(1).split('&').map(function(s) { 
              return s.replace(/~and~/g, '&')
            }).join('?');
            window.history.replaceState(null, null,
              l.pathname.slice(0, -1) + decoded + l.hash
            );
          }
        }(window.location))
      `,
    },
  },
  plugins: [pluginReact()],
  server: {
    base: '/sn-coding-tools',
  },
});
