import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fse from 'fs-extra';

const execAsync = promisify(exec);

export async function createNextApp(projectName, pkgManager) {
  if (pkgManager === 'npm' || pkgManager === 'npx') {
    await execAsync(
      `npx create-next-app@latest ${projectName} --ts --tailwind --eslint --src-dir  --no-experimental-app --import-alias "@/*`
    );
  } else {
    await execAsync(
      `${pkgManager} create next-app ${projectName} --ts --tailwind --eslint --src-dir --no-experimental-app --import-alias "@/*`
    );
  }
}

export async function installRainbowKit(projectName, pkgManager) {
  const projectDirectory = path.join(process.cwd(), projectName);

  if (pkgManager === 'npm' || pkgManager === 'npx') {
    await execAsync('npm i @rainbow-me/rainbowkit wagmi ethers@^5', {
      cwd: projectDirectory,
    });
  } else {
    await execAsync(`${pkgManager} add @rainbow-me/rainbowkit wagmi ethers@^5`, {
      cwd: projectDirectory,
    });
  }
}

export async function replaceFiles(projectName, projectType) {
  const origen = path.join(path.dirname(import.meta.url.substring(8)), '/templates');
  const destino = path.join(process.cwd(), projectName);

  try {
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
      await fse.copy(`${origen}/web3/src/config`, `${destino}/src/config`);
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

  // public/next.svg
  const file1 = path.join(projectDirectory, '/public/next.svg');

  // public/vercel.svg
  const file2 = path.join(projectDirectory, '/public/vercel.svg');

  try {
    await fse.remove(file1);
    await fse.remove(file2);
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

export function getPkgManager() {
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith('yarn')) {
      return 'yarn';
    } else if (userAgent.startsWith('pnpm')) {
      return 'pnpm';
    } else {
      return 'npm';
    }
  } else {
    return 'npm';
  }
}
