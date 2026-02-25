import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  build:
    command === 'build'
      ? {
          lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'ReactFrameComponent',
            formats: ['es', 'umd'],
            fileName: (format) =>
              `react-frame-component.${format === 'es' ? 'esm' : format}.js`
          },
          rollupOptions: {
            external: ['react', 'react-dom', 'prop-types'],
            output: {
              globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
                'prop-types': 'PropTypes'
              },
              exports: 'named'
            }
          },
          minify: false,
          sourcemap: true
        }
      : {}
}));
