import { cpSync, existsSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');
const gearsRoot = join(root, 'gears');
const templateDir = join(root, 'gears', '.template');

const toPascal = (s: string) =>
    s.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');

const usage = () => {
    console.log(`Usage: yarn tsx ./scripts/generate-gear.ts <name> [options]

Options:
  --web-only        Generate only common/ and web/ packages
  --mobile-only     Generate only common/ and mobile/ packages

If no platform flag is given, both web and mobile are generated.

The gear name should be in kebab-case (e.g. "route-story").`);
};

const exit = (msg: string) => {
    console.error(`Error: ${msg}`);
    process.exit(1);
};

const replaceTemplateName = (dir: string, kebab: string) => {
    const pascal = toPascal(kebab);
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
            replaceTemplateName(fullPath, kebab);

            if (entry.name.includes('__name__')) {
                renameSync(fullPath, join(dir, entry.name.split('__name__').join(kebab)));
            }
        } else {
            let name = entry.name;
            if (name.includes('__name__')) {
                name = name.split('__name__').join(kebab);
                renameSync(fullPath, join(dir, name));
            }

            const content = readFileSync(join(dir, name), 'utf-8');
            const newContent = content
                .split('__name__').join(kebab)
                .split('__PascalName__').join(pascal);

            writeFileSync(join(dir, name), newContent, 'utf-8');
        }
    }
};

const main = () => {
    const nameArg = process.argv[2];

    if (!nameArg || nameArg.startsWith('--')) {
        usage();
        process.exit(1);
    }

    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(nameArg)) {
        exit(`Invalid gear name "${nameArg}". Use kebab-case (e.g. "my-feature"). Rerun with a valid name.`);
    }

    const gearDir = join(gearsRoot, nameArg);

    if (existsSync(gearDir)) {
        exit(`Gear "${nameArg}" already exists at ${gearDir}.`);
    }

    const flags = process.argv.slice(3);
    const webOnly = flags.includes('--web-only');
    const mobileOnly = flags.includes('--mobile-only');

    console.log(`Generating gear "${nameArg}"...`);
    if (webOnly) console.log('  Platform: web only');
    else if (mobileOnly) console.log('  Platform: mobile only');
    else console.log('  Platform: web + mobile');

    cpSync(templateDir, gearDir, { recursive: true });

    replaceTemplateName(gearDir, nameArg);

    if (mobileOnly) {
        const webDir = join(gearDir, 'web');
        if (existsSync(webDir)) {
            rmSync(webDir, { recursive: true, force: true });
        }
    }

    if (webOnly) {
        const mobileDir = join(gearDir, 'mobile');
        if (existsSync(mobileDir)) {
            rmSync(mobileDir, { recursive: true, force: true });
        }
    }

    console.log(`\nDone. Gear "${nameArg}" created at ${gearDir}`);
    console.log('\nNext steps:');
    console.log(`  1. cd apps`);
    console.log(`  2. yarn install`);
    console.log(`  3. yarn test:gear ${nameArg}`);
    console.log(`  4. Implement the engage/disengage logic in:`);
    console.log(`     - ${nameArg}/common/src/${nameArg}-gear.ts`);
    if (!mobileOnly) console.log(`     - ${nameArg}/web/src/${nameArg}-gear.ts`);
    if (!webOnly) console.log(`     - ${nameArg}/mobile/src/${nameArg}-gear.ts`);
};

main();
