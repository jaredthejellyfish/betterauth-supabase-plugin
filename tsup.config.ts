import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts', 'client-plugin.ts'],
  format: ['esm'],
  dts: {
    resolve: true,
  },
  clean: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  splitting: true,
  target: 'esnext',
  outExtension: () => ({
    js: '.js',
  }),
  external: ['better-auth', 'better-auth/client', 'better-auth/plugins', 'better-auth/api', 'nanostores'],
}); 