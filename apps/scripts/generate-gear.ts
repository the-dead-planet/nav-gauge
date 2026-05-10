import { cpSync, existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');
const gearsRoot = join(root, 'gears');
const templatesRoot = join(root, 'gears', '.templates');
const defaultTemplate = join(templatesRoot, 'default');
const webOnlyTemplate = join(templatesRoot, 'web-only');
const mobileOnlyTemplate = join(templatesRoot, 'mobile-only');

const toPascal = (s: string) =>
    s.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');

const usage = () => {
    console.log(`Usage: yarn tsx ./scripts/generate-gear.ts <name> [options]

Options:
  --web-only        Generate only web/ package (no common/ intermediate)
  --mobile-only     Generate only mobile/ package (no common/ intermediate)

If no platform flag is given, common/ + web/ + mobile/ are all generated.

The gear name should be in kebab-case (e.g. "route-story").`);
};

const die = (msg: string) => {
    console.error(`Error: ${msg}`);
    process.exit(1);
};

const replacePlaceholders = (dir: string, kebab: string) => {
    const pascal = toPascal(kebab);
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
            replacePlaceholders(fullPath, kebab);

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
        die(`Invalid gear name "${nameArg}". Use kebab-case (e.g. "my-feature"). Rerun with a valid name.`);
    }

    const gearDir = join(gearsRoot, nameArg);

    if (existsSync(gearDir)) {
        die(`Gear "${nameArg}" already exists at ${gearDir}.`);
    }

    const flags = process.argv.slice(3);
    const webOnly = flags.includes('--web-only');
    const mobileOnly = flags.includes('--mobile-only');

    const templateDir = webOnly
        ? webOnlyTemplate
        : mobileOnly
            ? mobileOnlyTemplate
            : defaultTemplate;

    if (!existsSync(templateDir)) {
        die(`Template not found at ${templateDir}.`);
    }

    console.log(`Generating gear "${nameArg}"...`);
    if (webOnly) console.log('  Template: web-only (no common)');
    else if (mobileOnly) console.log('  Template: mobile-only (no common)');
    else console.log('  Template: common + web + mobile');

    cpSync(templateDir, gearDir, { recursive: true });
    replacePlaceholders(gearDir, nameArg);

    console.log(`\nDone. Gear "${nameArg}" created at ${gearDir}`);
    console.log('\nNext steps:');
    console.log(`  1. cd apps`);
    console.log(`  2. yarn install`);
    console.log(`  3. yarn test:gear ${nameArg}`);
    console.log(`  4. Implement engage/disengage logic`);
};

main();
