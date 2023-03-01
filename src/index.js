#!/usr/bin/env node
import { intro, outro, text, confirm, select, spinner, group, cancel } from '@clack/prompts';
import colors from 'picocolors';
import { createNextApp, installTailwind, removeFiles, replaceFiles } from './utils.js';

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
        message: colors.cyan('Pick a project type.'),
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

const s = spinner();

// Create Next App
s.start(colors.yellow('Creating Next project'));
await createNextApp(promptsGroup.projectName);
s.stop(colors.green('Successfully Next project created!'));

// Install Tailwind
s.start(colors.yellow('Installing Tailwind'));
await installTailwind(promptsGroup.projectName);
s.stop(colors.green('Tailwind successfully installed!'));

// Replace files
s.start(colors.yellow('Replacing files'));
await replaceFiles(promptsGroup.projectName);
s.stop(colors.green('All files successfully replaced!'));

// Remove unnecessary files
s.start(colors.yellow('Removing unnecessary files'));
await removeFiles(promptsGroup.projectName);
s.stop(colors.green('Unnecessary files deleted correctly!'));

outro(colors.bold(colors.italic(colors.white(" Let's do great things! 🌀 "))));
