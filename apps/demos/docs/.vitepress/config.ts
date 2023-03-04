import { defineConfig } from 'vitepress'
import { resolve, join } from 'path';
import { writeFileSync } from 'fs';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Arrangement Diagram",
  description: "基于@antv/g6的编排可视化解决方案",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
    ],

    socialLinks: [
    ],
    
  },
  // 注意：这个路径是为了适配gitpage，本地预览的
  base: '/arrangement-diagram',
  vite: {
    build: {
      chunkSizeWarningLimit: 1000
    },
    ssr: {
      noExternal: ['d3-interpolate', '@antv/g-base', 'd3-interpolate/src/index.js', '@antv/g-base/lib/animate/timeline.js']
    },
  },
})
