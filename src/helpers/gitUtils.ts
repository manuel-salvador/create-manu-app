import path from 'path';
import { execAsyncWithDebug } from './utils';

export async function makeCommit(projectName: string) {
  const projectDirectory = path.join(process.cwd(), projectName);

  await execAsyncWithDebug('git commit --amend -m  "Initial commit from Create Manu App"', {
    cwd: projectDirectory,
  });

  await execAsyncWithDebug('git add ."', {
    cwd: projectDirectory,
  });

  await execAsyncWithDebug('git commit -m  "Initial commit from Create Manu App"', {
    cwd: projectDirectory,
  });
}
