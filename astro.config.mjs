import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://blog.kevinhyde.com',
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});
