import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  /* Prefetch every internal link as it scrolls into view: the next page is
     already there when the visitor taps. */
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: {
    format: 'directory',
    inlineStylesheets: 'always'
  },
  vite: {
    build: {
      cssMinify: 'lightningcss'
    }
  }
});
