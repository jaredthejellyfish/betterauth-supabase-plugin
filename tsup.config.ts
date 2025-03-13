import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts', 'client-plugin.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  external: ['better-auth', 'better-auth/client', 'better-auth/plugins', 'better-auth/api', 'nanostores'],
}); 