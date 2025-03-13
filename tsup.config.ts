import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts', 'client-plugin.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  target: 'node18',
  outDir: 'dist',
  treeshake: true,
}); 