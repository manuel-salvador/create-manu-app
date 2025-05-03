import { cp } from 'fs/promises';
import path from 'path';
import { execAsync, getSourcePath } from './utils';

export const installEslintDevDeps = async (
  pkgManager: string,
  projectName: string,
  template: string,
) => {
  const cmd = pkgManager.startsWith('n') ? 'npm i -D' : `${pkgManager} add -D`;

  const deps = [
    '@typescript-eslint/eslint-plugin',
    'prettier',
    'eslint-plugin-import',
    'eslint-plugin-prettier',
    'eslint-config-prettier',
  ];

  if (template.includes('vite')) {
    deps.push('eslint-plugin-react');
  }

  await execAsync(`${cmd} ${deps.join(' ')}`, {
    cwd: path.join(process.cwd(), projectName),
  });
};

export const installTailwindAndInit = async (pkgManager: string, projectName: string) => {
  const projectDirectory = path.join(process.cwd(), projectName);

  const installCmd = pkgManager.startsWith('n') ? 'npm i -D' : `${pkgManager} add -D`;
  const initCmd = pkgManager.startsWith('n') ? 'npx' : `${pkgManager}`;

  await execAsync(`${installCmd} tailwindcss postcss autoprefixer`, {
    cwd: projectDirectory,
  });

  await execAsync(`${initCmd} tailwindcss init -p`, {
    cwd: projectDirectory,
  });
};

export async function installRainbowKit(projectName: string, pkgManager: string) {
  const projectDirectory = path.join(process.cwd(), projectName);
  const cmd = pkgManager === 'npm' ? 'npm i' : `${pkgManager} add`;

  await execAsync(`${cmd} @rainbow-me/rainbowkit wagmi ethers@^5`, {
    cwd: projectDirectory,
  });
}

export async function installShadcn(projectName: string, template: string, pkgManager: string) {
  const projectDirectory = path.join(process.cwd(), projectName);
  const cmd = pkgManager === 'pnpm' ? 'pnpm dlx' : 'npx';
  const installCmd = pkgManager.startsWith('n') ? 'npm i' : `${pkgManager} add`;

  if (template.includes('next')) {
    await execAsync(`${cmd} shadcn@latest init --yes --defaults --base-color neutral`, {
      cwd: projectDirectory,
    });
  } else {
    await execAsync(
      `${installCmd} class-variance-authority tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react`,
      {
        cwd: projectDirectory,
      },
    );
    const filesForVite = getSourcePath('always', 'shadcn', template);
    await cp(`${filesForVite}/tailwind.config.ts`, `${projectDirectory}/tailwind.config.js`, {
      force: true,
    });
    await cp(`${filesForVite}/globals.css`, `${projectDirectory}/src/globals.css`);
    await cp(`${filesForVite}/lib`, `${projectDirectory}/src/lib`, { recursive: true });
  }

  // const shadcnConfig = getSourcePath('always', 'shadcn', template, 'components.json'); // NOT always, only for next template
  // await cp(shadcnConfig, `${projectDirectory}/components.json`);

  await execAsync(`${cmd} shadcn@latest add --all`, {
    cwd: projectDirectory,
  });
}
