import { cp, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { installEslintDevDeps, installUltracite } from '../helpers/installation';
import { execAsyncWithDebug, getSourcePath } from '../helpers/utils';

export async function createViteReactApp(projectName: string, pkgManager: string) {
  const createCmd = pkgManager.startsWith('n')
    ? 'npx create-vite@latest'
    : `${pkgManager} create vite`;
  const cmd = pkgManager.startsWith('n') ? 'npm' : `${pkgManager}`;

  await execAsyncWithDebug(`${createCmd} ${projectName} --template react-swc-ts`, {
    cwd: process.cwd(),
  });
  await execAsyncWithDebug(`${cmd} i`, {
    cwd: path.join(process.cwd(), projectName),
  });
  await execAsyncWithDebug(`${cmd} add -D @types/node`, {
    cwd: path.join(process.cwd(), projectName),
  });
  await installEslintDevDeps(pkgManager, projectName, 'vite');
}

export async function createNextApp(projectName: string, pkgManager: string) {
  const cmd = pkgManager === 'npm' ? 'npx create-next-app@latest' : `${pkgManager} create next-app`;
  await execAsyncWithDebug(
    `${cmd} ${projectName} --ts --no-linter --react-compiler --tailwind --src-dir --app --turbopack --import-alias "@/*"`,
  );
  // await installEslintDevDeps(pkgManager, projectName, 'next');
  await installUltracite(pkgManager, projectName);
}

export async function createSE2(projectName: string) {
  const projectDirectory = path.join(process.cwd(), projectName);

  await execAsyncWithDebug(
    `git clone https://github.com/scaffold-eth/scaffold-eth-2.git ${projectName}`,
    {
      cwd: projectDirectory,
    },
  );

  const origen = getSourcePath('templates', 'web3', 'se2-w');
  await cp(`${origen}/package.json`, `${projectDirectory}/package.json`);
  await cp(`${origen}/start-dev.ps1`, `${projectDirectory}/start-dev.ps1`);

  const packageJsonDir = path.join(projectDirectory, 'package.json');
  const data = await readFile(packageJsonDir, 'utf8');
  const draft = data.replace(/{{\s*projectName\s*}}/g, projectName);
  await writeFile(packageJsonDir, draft, 'utf8');

  await execAsyncWithDebug('yarn install', {
    cwd: projectDirectory,
  });
}
