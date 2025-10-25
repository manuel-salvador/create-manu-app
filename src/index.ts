#!/usr/bin/env node
import { cancel, confirm, group, intro, outro, select, spinner, text } from '@clack/prompts';
import colors from 'picocolors';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createNextApp, createSE2, createViteReactApp } from './commands/create';
import { makeCommit } from './helpers/gitUtils';
import { installRainbowKit, installShadcn, installTailwindAndInit } from './helpers/installation';
import {
  addUltraciteScripts,
  checkIfYarnIsInstalled,
  fixUltraciteErrors,
  getPkgManager,
  removeFiles,
  replaceFiles,
} from './helpers/utils';

// List of web 2 templates
const TEMPLATES_WEB2 = [
  {
    label: 'Next.js + Ultracite + TypeScript + Shadcn/ui',
    value: 'next-shadcn',
  },
  {
    label: 'Next.js + Ultracite + TypeScript + Tailwind',
    value: 'next-tw',
  },
  {
    label: 'React (vite) + ESLint + TypeScript + Shadcn/ui',
    value: 'react-vite-shadcn',
  },
];

// List of web 3 templates
const TEMPLATES_WEB3 = [
  {
    label: 'Next.js + ESLint + TypeScript + Shadcn/ui + RainbowKit',
    value: 'next-rainbowkit',
  },
  {
    label: 'Scaffold-Eth-2 Windows: Updated toolkit for building Ethereum dapps with Next.js.',
    value: 'se2-w',
  },
];

const s = spinner();

async function main() {
  const argv = await yargs(hideBin(process.argv)).argv;

  intro(colors.bold(colors.white(' Assistant to create a project as Manu would ')));

  const promptsGroup = await group(
    {
      projectName: () =>
        text({
          message: colors.cyan('Project name:'),
          placeholder: 'my-app',
          validate(value) {
            if (value.length === 0) return `Name is required!`;
            if (value.match(/[^a-zA-Z0-9-_]+/g))
              return 'Project name can only contain letters, numbers, dashes and underscores';
          },
        }),
      projectType: () =>
        select({
          message: colors.cyan('Select a project type.'),
          initialValue: 'web2',
          options: [
            { value: 'web2', label: '💻 Web 2' },
            { value: 'web3', label: '🌐 Web 3' },
          ],
        }),
      template: ({ results: { projectType } }) =>
        select({
          message: colors.cyan('Select a template.'),
          initialValue: projectType === 'web2' ? TEMPLATES_WEB2[0].value : TEMPLATES_WEB3[0].value,
          options: projectType === 'web2' ? TEMPLATES_WEB2 : TEMPLATES_WEB3,
        }),
    },
    {
      onCancel: () => {
        cancel('Cancelled.');
        process.exit(0);
      },
    },
  );

  const { projectName, projectType, template } = promptsGroup as {
    projectName: string;
    projectType: string;
    template: string;
  };

  let pkgManager = getPkgManager(argv);

  if (template === 'se2-w') {
    // Check if template is se2-w and pkgManager is yarn and exit if so to avoid yarn conflicts
    if (pkgManager !== 'yarn') {
      const shouldChangePkgManager = await confirm({
        message: colors.bold(colors.italic(colors.yellow('Scaffold-Eth-2 only supports yarn'))),
      });

      if (!shouldChangePkgManager) {
        outro(colors.bold(colors.italic(colors.red('Cancelled'))));
        process.exit(0);
      }

      const yarnIsInstalled = await checkIfYarnIsInstalled();

      if (!yarnIsInstalled) {
        outro(colors.bold(colors.italic(colors.red('Yarn is not installed'))));
        process.exit(1);
      }

      pkgManager = 'yarn';
    }

    s.start(colors.yellow('🚀 Creating Scaffold-Eth-2 project'));
    await createSE2(projectName);
    s.stop(colors.green('🚀 Successfully Scaffold-Eth-2 project created!'));
  }

  if (template.includes('next')) {
    // Create Next App
    s.start(colors.yellow('🚀 Creating Next project'));
    await createNextApp(projectName, pkgManager);
    s.stop(colors.green('🚀 Successfully Next project created!'));

    if (template === 'next-rainbowkit') {
      // Install RainbowKit
      s.start(colors.yellow('🌈 Installing RainbowKit'));
      await installRainbowKit(projectName, pkgManager);
      s.stop(colors.green('🌈 RainbowKit successfully installed!'));
    }

    if (template === 'next-shadcn') {
      // Install Shadcn
      s.start(colors.yellow('🧩 Installing Shadcn'));
      await installShadcn(projectName, template, pkgManager);
      s.stop(colors.green('🧩 Shadcn successfully installed!'));
    }

    // Replace files
    s.start(colors.yellow('📁 Configuring files'));
    await replaceFiles(projectName, projectType, template);
    s.stop(colors.green('📁 Files configured successfully!'));

    // Add ultracite scripts to package.json
    s.start(colors.yellow('📝 Adding ultracite scripts'));
    await addUltraciteScripts(projectName, pkgManager);
    s.stop(colors.green('📝 Ultracite scripts added successfully!'));

    // Remove unnecessary files
    s.start(colors.yellow('🗑️ Removing unnecessary files'));
    await removeFiles(projectName, template);
    s.stop(colors.green('🗑️ Unnecessary files deleted correctly!'));

    if (template.includes('next')) {
      await fixUltraciteErrors(projectName, pkgManager);
    }

    await makeCommit(projectName);
  }

  if (template.includes('vite')) {
    // Create Vite React App
    s.start(colors.yellow('🚀 Creating Vite React project'));
    await createViteReactApp(projectName, pkgManager);
    s.stop(colors.green('🚀 Successfully Vite React project created!'));

    // install tailwind
    s.start(colors.yellow('🎨 Installing Tailwind'));
    await installTailwindAndInit(pkgManager, projectName);
    s.stop(colors.green('🎨 Tailwind successfully installed!'));

    // Replace files
    s.start(colors.yellow('📁 Configuring files'));
    await replaceFiles(projectName, projectType, template);
    s.stop(colors.green('📁 Files configured successfully!'));

    // Install Shadcn
    s.start(colors.yellow('🧩 Installing Shadcn'));
    await installShadcn(projectName, template, pkgManager);
    s.stop(colors.green('🧩 Shadcn successfully installed!'));

    // Remove unnecessary files
    s.start(colors.yellow('🗑️ Removing unnecessary files'));
    await removeFiles(projectName, template);
    s.stop(colors.green('🗑️ Unnecessary files deleted correctly!'));
  }

  const command = `${pkgManager} ${pkgManager === 'npm' ? 'run dev' : 'dev'}`;
  const message = `\n👉 To get started, run ${colors.italic(
    `cd ${projectName}`,
  )} and then ${colors.italic(command)}`;

  console.log(colors.white(message));

  outro(colors.bold(colors.italic(colors.white(" Let's do great things! 🌀 "))));

  process.exit(0);
}

// Run the main function
main().catch(console.error);
