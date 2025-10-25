import { cp } from 'fs/promises';
import path from 'path';
import { execAsyncWithDebug, getSourcePath } from './utils';

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

  await execAsyncWithDebug(`${cmd} ${deps.join(' ')}`, {
    cwd: path.join(process.cwd(), projectName),
  });
};

export const installTailwindAndInit = async (pkgManager: string, projectName: string) => {
  const projectDirectory = path.join(process.cwd(), projectName);

  const installCmd = pkgManager.startsWith('n') ? 'npm i -D' : `${pkgManager} add -D`;
  const initCmd = pkgManager.startsWith('n') ? 'npx' : `${pkgManager}`;

  await execAsyncWithDebug(`${installCmd} tailwindcss postcss autoprefixer`, {
    cwd: projectDirectory,
  });

  await execAsyncWithDebug(`${initCmd} tailwindcss init -p`, {
    cwd: projectDirectory,
  });
};

export async function installRainbowKit(projectName: string, pkgManager: string) {
  const projectDirectory = path.join(process.cwd(), projectName);
  const cmd = pkgManager === 'npm' ? 'npm i' : `${pkgManager} add`;

  await execAsyncWithDebug(`${cmd} @rainbow-me/rainbowkit wagmi ethers@^5`, {
    cwd: projectDirectory,
  });
}

export async function installShadcn(projectName: string, template: string, pkgManager: string) {
  const projectDirectory = path.join(process.cwd(), projectName);
  const cmd = pkgManager === 'pnpm' ? 'pnpm dlx' : pkgManager === 'bun' ? 'bunx' : 'npx';
  const installCmd = pkgManager.startsWith('n') ? 'npm i' : `${pkgManager} add`;

  if (template.includes('next')) {
    await execAsyncWithDebug(
      `${cmd} shadcn@latest init --yes --defaults --base-color neutral --src-dir`,
      {
        cwd: projectDirectory,
      },
    );
  } else {
    await execAsyncWithDebug(
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

  await execAsyncWithDebug(`${cmd} --no-install shadcn add --all`, {
    cwd: projectDirectory,
  });
  await execAsyncWithDebug(`${cmd} --no-install shadcn migrate radix --yes`, {
    cwd: projectDirectory,
  });
}

export async function installUltracite(pkgManager: string, projectName: string) {
  const projectDirectory = path.join(process.cwd(), projectName);
  const cmd = pkgManager.startsWith('n')
    ? 'npx'
    : pkgManager === 'bun'
      ? 'bunx'
      : `${pkgManager} dlx`;

  await execAsyncWithDebug(
    `${cmd} ultracite init --frameworks next --editors vscode --agents cursor --integrations husky lefthook`,
    {
      cwd: projectDirectory,
    },
  );
}
