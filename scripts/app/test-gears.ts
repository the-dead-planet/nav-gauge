import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';
import { Dirent } from 'fs';
import { targets } from './utils';

const target = process.argv[2]?.toLowerCase();
const root = join(__dirname, '..');

if (!target || !targets.includes(target)) {
  console.error(
    'Usage: yarn tsx ./scripts/test-gears.ts <common|web|mobile>'
  );
  process.exit(1);
}

const categoryEntry = { base: join(root, 'gears'), suffix: target };
const tasks = collectCategoryTasks(categoryEntry);

if (tasks.length === 0) {
  console.log(`No packages with tests found for category: ${target}`);
  process.exit(0);
}

interface Task {
  name: string;
  pkgDir: string;
}

function collectCategoryTasks(entry: { base: string; suffix: string | null }): Task[] {
  const { base, suffix } = entry;

  if (!existsSync(base) || !statSync(base).isDirectory()) {
    console.error(`Directory not found: ${base}`);
    process.exit(1);
  }

  const directories = readdirSync(base, { withFileTypes: true })
    .filter((dirent: Dirent) => dirent.isDirectory())
    .map((dirent: Dirent) => dirent.name)
    .sort();

  return directories
    .map((name: string) => ({
      name,
      pkgDir: suffix ? join(base, name, suffix) : join(base, name),
    }))
    .filter((task: Task) => existsSync(task.pkgDir) && statSync(task.pkgDir).isDirectory());
}

const runTask = (task: Task) =>
  new Promise<{ name: string; success: boolean }>((resolve) => {
    const proc = spawn('yarn', ['test'], {
      cwd: task.pkgDir,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    proc.stdout.on('data', (chunk: Buffer) => {
      process.stdout.write(`[${task.name}] ${chunk}`);
    });
    proc.stderr.on('data', (chunk: Buffer) => {
      process.stderr.write(`[${task.name}] ${chunk}`);
    });

    proc.on('close', (code: number | null) => {
      resolve({ name: task.name, success: code === 0 });
    });
  });

(async () => {
  const results = await Promise.all(tasks.map((task) => runTask(task)));
  const failed = results.filter((result) => !result.success).map((result) => result.name);

  if (failed.length > 0) {
    console.error(`\nTests failed for: ${failed.join(', ')}`);
    process.exit(1);
  }
})();
