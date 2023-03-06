import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fse from 'fs-extra';
import { detect } from 'detect-package-manager';

const execAsync = promisify(exec);

export async function createNextApp(projectName, pkgManager) {
  if (pkgManager === 'npm' || pkgManager === 'npx') {
    await execAsync(
      `npx create-next-app@latest ${projectName} --ts --eslint --src-dir --no-experimental-app --import-alias "@/*`
    );
  } else {
    await execAsync(
      `${pkgManager} create next-app ${projectName} --ts --eslint --src-dir --no-experimental-app --import-alias "@/*`
    );
  }
}

export async function installTailwind(projectName, pkgManager) {
  const projectDirectory = path.join(process.cwd(), projectName);

  if (pkgManager === 'npm' || pkgManager === 'npx') {
    await execAsync('npm install -D tailwindcss postcss autoprefixer', {
      cwd: projectDirectory,
    });
  } else {
    await execAsync(`${pkgManager} add -D tailwindcss postcss autoprefixer`, {
      cwd: projectDirectory,
    });
  }

  if (pkgManager === 'npm' || pkgManager === 'npx') {
    await execAsync('npx tailwindcss init -p', {
      cwd: projectDirectory,
    });
  } else {
    await execAsync(`${pkgManager} tailwindcss init -p`, {
      cwd: projectDirectory,
    });
  }
}

export async function installRainbowKit(projectName, pkgManager) {
  const projectDirectory = path.join(process.cwd(), projectName);

  if (pkgManager === 'npm' || pkgManager === 'npx') {
    await execAsync('npm i @rainbow-me/rainbowkit wagmi ethers@5.5.1', {
      cwd: projectDirectory,
    });
  } else {
    await execAsync(`${pkgManager} add @rainbow-me/rainbowkit wagmi ethers@5.5.1`, {
      cwd: projectDirectory,
    });
  }
}

export async function replaceFiles(projectName, projectType) {
  const origen = path.join(path.dirname(import.meta.url.substring(8)), '/templates');
  const destino = path.join(process.cwd(), projectName);

  try {
    // globals.css
    await fse.copy(`${origen}/globals.css`, `${destino}/src/styles/globals.css`);

    // tailwind.config.js
    await fse.copy(`${origen}/tailwind.config.js`, `${destino}/tailwind.config.js`);

    // web 2
    if (projectType === 'web2') {
      await fse.copy(`${origen}/web2/README.md`, `${destino}/README.md`);
      await fse.copy(`${origen}/web2/src/pages/index.tsx`, `${destino}/src/pages/index.tsx`);
    }

    // web 3
    if (projectType === 'web3') {
      await fse.copy(`${origen}/web3/README.md`, `${destino}/README.md`);
      await fse.copy(`${origen}/web3/.env.example`, `${destino}/.env.example`);
      await fse.copy(`${origen}/web3/next.config.js`, `${destino}/next.config.js`);
      await fse.copy(`${origen}/web3/src/constants`, `${destino}/src/constants`);
      await fse.copy(`${origen}/web3/src/pages/_app.tsx`, `${destino}/src/pages/_app.tsx`);
      await fse.copy(`${origen}/web3/src/pages/index.tsx`, `${destino}/src/pages/index.tsx`);
    }
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
  const file3 = path.join(projectDirectory, '/public/thirteen.svg');

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

export async function makeCommit(projectName) {
  const projectDirectory = path.join(process.cwd(), projectName);

  await execAsync('git commit --amend -m  "Initial commit from Create Manu App"', {
    cwd: projectDirectory,
  });

  await execAsync('git add ."', {
    cwd: projectDirectory,
  });

  await execAsync('git commit -m  "Initial commit from Create Manu App"', {
    cwd: projectDirectory,
  });
}

export async function detectManager() {
  return await detect();
}
