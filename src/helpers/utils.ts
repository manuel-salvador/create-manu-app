import { glob } from 'glob';
import { exec } from 'node:child_process';
import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { Arguments } from 'yargs';

export const execAsync = promisify(exec);

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
    await cp(`${origen}/always/.vscode`, `${destinationPath}/.vscode`, { recursive: true });
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

  const userAgent = process.env.npm_config_user_agent;

  if (userAgent?.startsWith('yarn')) {
    return 'yarn';
  } else if (userAgent?.startsWith('pnpm')) {
    return 'pnpm';
  }

  return 'npm';
}

export const checkIfYarnIsInstalled = async () => {
  try {
    await execAsync('yarn --version');
    return true;
  } catch (error) {
    return false;
  }
};
