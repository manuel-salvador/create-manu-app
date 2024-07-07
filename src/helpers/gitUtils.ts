import path from 'path';
import { execAsync } from './utils';

export async function makeCommit(projectName: string) {
  const projectDirectory = path.join(process.cwd(), projectName);

  await execAsync('git commit --amend -m  "Initial commit from Create Manu App"', {
    cwd: projectDirectory,
  });

  await execAsync('git add ."', {
    cwd: projectDirectory,
  });

  await execAsync('git commit -m  "Initial commit from Create Manu App"', {
    cwd: projectDirectory,
  });
}
