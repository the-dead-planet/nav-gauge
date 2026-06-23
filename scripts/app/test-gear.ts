import { existsSync, statSync } from 'fs';
import { join } from 'path';
import { runAll, Task } from './tasks';
import { targets } from './utils';

const gearName = process.argv[2]?.toLowerCase();
const root = join(__dirname, '..');

if (!gearName) {
  console.error('Usage: yarn tsx ./scripts/test-gears.ts <gear-name>');
  process.exit(1);
}

const folderRoot = join(root, 'gears', gearName);
if (!existsSync(folderRoot) || !statSync(folderRoot).isDirectory()) {
  console.error(`Gear folder not found: ${folderRoot}`);
  process.exit(1);
}

const tasks = targets
  .map((target) => ({
    name: `${gearName}/${target}`,
    pkgDir: join(folderRoot, target),
  }))
  .filter((task: Task) => existsSync(task.pkgDir) && statSync(task.pkgDir).isDirectory());

if (tasks.length === 0) {
  console.log(`No workspace tests found for gear folder: ${gearName}`);
  process.exit(0);
}

runAll(tasks);
