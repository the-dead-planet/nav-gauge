import { spawn } from 'child_process';

export interface Task {
  name: string;
  pkgDir: string;
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

export const runAll = async (tasks: Task[]) => {
  const results = await Promise.all(tasks.map((task) => runTask(task)));
  const failed = results.filter((result) => !result.success).map((result) => result.name);

  if (failed.length > 0) {
    console.error(`\nTests failed for: ${failed.join(', ')}`);
    process.exit(1);
  }
};
