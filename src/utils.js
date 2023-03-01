import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import colors from 'picocolors';
import fse from 'fs-extra';

const execAsync = promisify(exec);

export async function createNextApp(projectName) {
  await execAsync(
    `pnpm create next-app ${projectName} --ts --eslint --src-dir --no-experimental-app --import-alias "@/*`
  );
}

export async function installTailwind(projectName) {
  const projectDirectory = path.join(process.cwd(), projectName);

  await execAsync('pnpm add -D tailwindcss postcss autoprefixer', {
    cwd: projectDirectory,
  });

  await execAsync('pnpm tailwindcss init -p', {
    cwd: projectDirectory,
  });
}

export async function replaceFiles(projectName) {
  const origen = path.join(path.dirname(import.meta.url.substring(8)), '/templates');
  const destino = path.join(process.cwd(), projectName);

  try {
    // globals.css
    await fse.copy(`${origen}/globals.css`, `${destino}/src/styles/globals.css`);

    // tailwind.config.js
    await fse.copy(`${origen}/tailwind.config.js`, `${destino}/tailwind.config.js`);

    // index.tsx
    await fse.copy(`${origen}/index.tsx`, `${destino}/src/pages/index.tsx`);
  } catch (err) {
    console.error(err);
  }
}

export async function removeFiles(projectName) {
  const projectDirectory = path.join(process.cwd(), projectName);

  // Home.module.css
  const file1 = path.join(projectDirectory, '/src/styles/Home.module.css');

  // public/next.svg
  const file2 = path.join(projectDirectory, '/public/next.svg');

  // public/thirtheen.svg
  const file3 = path.join(projectDirectory, '/public/thirtheen.svg');

  // public/vercel.svg
  const file4 = path.join(projectDirectory, '/public/vercel.svg');

  try {
    await fse.remove(file1);
    await fse.remove(file2);
    await fse.remove(file3);
    await fse.remove(file4);
  } catch (err) {
    console.error(err);
  }
}
