import { cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  outDir: 'dist',
  target: 'es2022',
  // Copy the templates files to the dist folder
  async onSuccess() {
    await cp(
      path.join(path.dirname(fileURLToPath(import.meta.url)), './src/templates'),
      path.join('dist', 'templates'),
      { recursive: true },
    );
    await cp(
      path.join(path.dirname(fileURLToPath(import.meta.url)), './src/always'),
      path.join('dist', 'always'),
      { recursive: true },
    );
  },
});
