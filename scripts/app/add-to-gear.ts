import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');

const usage = () => {
    console.log(`Usage: yarn add:gear <gear-name> <common|web|mobile> <package...>

Examples:
  yarn add:gear route-story common @turf/along
  yarn add:gear navigate web -D @types/foo
  yarn add:gear submit-data mobile react-native-fs`);
};

const exit = (msg: string) => {
    console.error(`Error: ${msg}`);
    process.exit(1);
};

const main = () => {
    const args = process.argv.slice(2);

    if (args.length < 3) {
        usage();
        process.exit(1);
    }

    const gearName = args[0];
    const platform = args[1];

    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(gearName)) {
        exit(`Invalid gear name "${gearName}". Use kebab-case.`);
    }

    if (!['common', 'web', 'mobile'].includes(platform)) {
        exit(`Platform must be "common", "web", or "mobile", got "${platform}".`);
    }

    const gearDir = join(root, 'gears', gearName, platform);
    if (!existsSync(gearDir)) {
        exit(`Gear not found at ${gearDir}.`);
    }

    const workspaceName = `@the-dead-planet/nav-gauge-gears-${gearName}-${platform}`;
    const pkgArgs = ['workspace', workspaceName, 'add', ...args.slice(2)];

    const result = spawnSync('yarn', pkgArgs, {
        cwd: root,
        stdio: 'inherit',
        shell: true,
    });

    process.exit(result.status ?? 1);
};

main();
