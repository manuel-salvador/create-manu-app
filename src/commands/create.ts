import { cp, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { installEslintDevDeps } from '../helpers/installation';
import { execAsync, getSourcePath } from '../helpers/utils';

export async function createViteReactApp(projectName: string, pkgManager: string) {
  const createCmd = pkgManager.startsWith('n')
    ? 'npx create-vite@latest'
    : `${pkgManager} create vite`;
  const cmd = pkgManager.startsWith('n') ? 'npm' : `${pkgManager}`;

  await execAsync(`${createCmd} ${projectName} --template react-swc-ts`, {
    cwd: process.cwd(),
  });
  await execAsync(`${cmd} i`, {
    cwd: path.join(process.cwd(), projectName),
  });
  await execAsync(`${cmd} add -D @types/node`, {
    cwd: path.join(process.cwd(), projectName),
  });
  await installEslintDevDeps(pkgManager, projectName, 'vite');
}

export async function createNextApp(projectName: string, pkgManager: string) {
  const cmd = pkgManager === 'npm' ? 'npx create-next-app@latest' : `${pkgManager} create next-app`;
  await execAsync(
    `${cmd} ${projectName} --ts --eslint --tailwind --src-dir --app --import-alias "@/*"`,
  );
  await installEslintDevDeps(pkgManager, projectName, 'next');
}

export async function createSE2(projectName: string) {
  const projectDirectory = path.join(process.cwd(), projectName);

  await execAsync(`git clone https://github.com/scaffold-eth/scaffold-eth-2.git ${projectName}`, {
    cwd: projectDirectory,
  });

  const origen = getSourcePath('templates', 'web3', 'se2-w');
  await cp(`${origen}/package.json`, `${projectDirectory}/package.json`);
  await cp(`${origen}/start-dev.ps1`, `${projectDirectory}/start-dev.ps1`);

  const packageJsonDir = path.join(projectDirectory, 'package.json');
  const data = await readFile(packageJsonDir, 'utf8');
  const draft = data.replace(/{{\s*projectName\s*}}/g, projectName);
  await writeFile(packageJsonDir, draft, 'utf8');

  await execAsync('yarn install', {
    cwd: projectDirectory,
  });
}
