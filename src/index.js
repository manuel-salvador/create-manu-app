#!/usr/bin/env node
import { intro, outro, text, select, spinner, group, cancel } from '@clack/prompts';
import colors from 'picocolors';
import {
  installRainbowKit,
  makeCommit,
  createNextApp,
  installTailwind,
  removeFiles,
  replaceFiles,
} from './utils.js';

intro(colors.bold(colors.white(' Assistant to create a front-end project ')));

const promptsGroup = await group(
  {
    projectName: () =>
      text({
        message: colors.cyan('What is your project named?'),
        placeholder: 'my-app',
        validate(value) {
          if (value.length === 0) return `Name is required!`;
        },
      }),
    projectType: () =>
      select({
        message: colors.cyan('Select a project type.'),
        options: [
          { value: 'web2', label: '💻 Web 2' },
          { value: 'web3', label: '🌐 Web 3' },
        ],
      }),
  },
  {
    onCancel: ({ results }) => {
      cancel('Operation cancelled.');
      process.exit(0);
    },
  }
);

const { projectName, projectType } = promptsGroup;

let pkgManager = 'npx';
const detectManager = process.env.npm_execpath;

if (detectManager && detectManager.includes('pnpm')) {
  pkgManager = 'pnpm';
} else if (detectManager && detectManager.includes('yarn')) {
  pkgManager = 'yarn';
} else if (detectManager && detectManager.includes('npm')) {
  pkgManager = 'npm';
}

const s = spinner();

// Create Next App
s.start(colors.yellow('🚀 Creating Next project'));
await createNextApp(projectName, pkgManager);
s.stop(colors.green('🚀 Successfully Next project created!'));

// Install Tailwind
s.start(colors.yellow('🎨 Installing Tailwind'));
await installTailwind(projectName, pkgManager);
s.stop(colors.green('🎨 Tailwind successfully installed!'));

// install wagmi and replace files web 3
if (projectType === 'web3') {
  // Install RainbowKit
  s.start(colors.yellow('🌈 Installing RainbowKit'));
  await installRainbowKit(projectName, pkgManager);
  s.stop(colors.green('🌈 RainbowKit successfully installed!'));
}

// Replace web 3 files
s.start(colors.yellow('📁 Configuring files'));
await replaceFiles(projectName, projectType);
s.stop(colors.green('📁 Files configured successfully!'));

// Remove unnecessary files
s.start(colors.yellow('🗑️ Removing unnecessary files'));
await removeFiles(projectName);
s.stop(colors.green('🗑️ Unnecessary files deleted correctly!'));

await makeCommit(projectName);

const command = `${pkgManager} ${pkgManager === 'npm' ? 'run dev' : 'dev'}`;
const message = `\n👉 To get started, run ${colors.italic(
  `cd ${projectName}`
)} and then ${colors.italic(command)}`;

console.log(colors.white(message));

outro(colors.bold(colors.italic(colors.white(" Let's do great things! 🌀 "))));
