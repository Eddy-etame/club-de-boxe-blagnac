import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
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
