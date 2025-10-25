import { glob } from 'glob';
import { exec, spawn } from 'node:child_process';
import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { Arguments } from 'yargs';

export const execAsync = promisify(exec);

export const execAsyncWithDebug = async (command: string, options?: { cwd?: string }) => {
  const isDebug = true;

  if (isDebug) {
    await runCommand(command, options);
    return { stdout: '', stderr: '' };
  } else {
    return await execAsync(command, options);
  }
};

export const runCommand = (command: string, options?: { cwd?: string }) => {
  return new Promise<void>((resolve, reject) => {
    const isDebug = process.env.DEBUG === 'true' || process.env.DEBUG === '1';

    if (isDebug) {
      console.log(`🔧 [DEBUG] Ejecutando comando: ${command}`);
      if (options?.cwd) {
        console.log(`🔧 [DEBUG] Directorio de trabajo: ${options.cwd}`);
      }
    }

    const child = spawn(command, {
      cwd: options?.cwd,
      shell: true,
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (isDebug) {
        console.log(`🔧 [DEBUG] Comando finalizado con código: ${code}`);
      }
      if (code === 0) resolve();
      else reject(new Error(`Command failed with exit code ${code}`));
    });
  });
};

// function to get a path of a folder or file in this CLI
export const getSourcePath = (...folderOrFiles: string[]) =>
  path.join(path.dirname(fileURLToPath(import.meta.url)), ...folderOrFiles);

export async function replaceFiles(projectName: string, projectType: string, template: string) {
  const origen = getSourcePath();
  const TEMPLATES = `${origen}/templates`;
  const templatePath = `${TEMPLATES}/${projectType}/${template}`;
  const destinationPath = path.join(process.cwd(), projectName);

  try {
    // copy or replace files from templates
    await cp(`${templatePath}`, destinationPath, { recursive: true });

    // replace always
    if (!template.includes('next')) {
      await cp(`${origen}/always/.vscode`, `${destinationPath}/.vscode`, { recursive: true });
    }

    // await cp(`${origen}/always/next/.eslintrc.json`, `${destinationPath}/.eslintrc.json`); // NOT always, only for next template

    // Get all files from the destination folder
    const files = await glob(`**/*`, {
      nodir: true,
      cwd: destinationPath,
      absolute: true,
      ignore: ['**/node_modules/**'],
    });

    // Read each file and replace the tokens
    for await (const file of files) {
      // Skip binary files that shouldn't be processed as text
      const binaryExtensions = [
        '.ico',
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.svg',
        '.webp',
        '.bmp',
        '.tiff',
        '.woff',
        '.woff2',
        '.ttf',
        '.eot',
        '.otf',
        '.mp3',
        '.mp4',
        '.avi',
        '.mov',
        '.wav',
        '.pdf',
        '.zip',
        '.tar',
        '.gz',
      ];
      const fileExtension = path.extname(file).toLowerCase();
      if (binaryExtensions.includes(fileExtension)) {
        continue; // Skip binary files
      }

      const data = await readFile(file, 'utf8');
      const draft = data.replace(/{{\s*projectName\s*}}/g, projectName);

      await writeFile(file, draft, 'utf8');
    }
  } catch (err) {
    console.error(err);
  }
}

export async function removeFiles(projectName: string, template: string) {
  const projectDirectory = path.join(process.cwd(), projectName);

  if (template.includes('next')) {
    try {
      await rm(`${projectDirectory}/public/file.svg`);
      await rm(`${projectDirectory}/public/globe.svg`);
      await rm(`${projectDirectory}/public/next.svg`);
      await rm(`${projectDirectory}/public/vercel.svg`);
      await rm(`${projectDirectory}/public/window.svg`);
    } catch (err) {
      console.error(err);
    }
  }

  if (template.includes('vite')) {
    try {
      await rm(path.join(projectDirectory, '.eslintrc.cjs'), { force: true });
      await rm(path.join(projectDirectory, 'src', 'App.css'), { force: true });
      await rm(path.join(projectDirectory, 'src', 'index.css'), { force: true });
      await rm(path.join(projectDirectory, 'src', 'assets'), { recursive: true, force: true });
      await rm(path.join(projectDirectory, 'src', 'vite.config.js'), { force: true });
    } catch (err) {
      console.error(err);
    }
  }
}

export function getPkgManager(args: Arguments) {
  if (args['use-pnpm']) return 'pnpm';
  if (args['use-yarn']) return 'yarn';
  if (args['use-npm']) return 'npm';
  if (args['use-bun']) return 'bun';

  const userAgent = process.env.npm_config_user_agent;

  if (userAgent?.startsWith('yarn')) {
    return 'yarn';
  } else if (userAgent?.startsWith('pnpm')) {
    return 'pnpm';
  } else if (userAgent?.startsWith('bun')) {
    return 'bun';
  }

  return 'npm';
}

export const checkIfYarnIsInstalled = async () => {
  try {
    await execAsyncWithDebug('yarn --version');
    return true;
  } catch (error) {
    return false;
  }
};

export async function addUltraciteScripts(projectName: string, pkgManager: string) {
  const projectDirectory = path.join(process.cwd(), projectName);
  const packageJsonPath = path.join(projectDirectory, 'package.json');

  const cmd = pkgManager.startsWith('n')
    ? 'npx'
    : pkgManager === 'bun'
      ? 'bunx'
      : `${pkgManager} dlx`;

  try {
    const packageJsonContent = await readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    // Agregar scripts de ultracite si no existen
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    if (!packageJson.scripts.check) {
      packageJson.scripts.check = `${cmd} ultracite check`;
    }

    if (!packageJson.scripts.fix) {
      packageJson.scripts.fix = `${cmd} ultracite fix`;
    }

    await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  } catch (error) {
    console.error('Error adding ultracite scripts:', error);
  }
}

export async function fixUltraciteErrors(projectName: string, pkgManager: string) {
  const projectDirectory = path.join(process.cwd(), projectName);
  const cmd = pkgManager.startsWith('n') ? 'npm' : pkgManager;

  await execAsyncWithDebug(`${cmd} ultracite fix`, {
    cwd: projectDirectory,
  });
}
