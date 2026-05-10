import { cpSync, existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createInterface, Interface } from 'readline';

const root = join(__dirname, '..');
const gearsRoot = join(root, 'gears');
const templatesRoot = join(root, 'gears', '.templates');
const defaultTemplate = join(templatesRoot, 'default');
const webOnlyTemplate = join(templatesRoot, 'web-only');
const mobileOnlyTemplate = join(templatesRoot, 'mobile-only');

const toPascal = (s: string) =>
    s.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');

const die = (msg: string) => {
    console.error(`Error: ${msg}`);
    process.exit(1);
};

const prompt = (rl: Interface, query: string): Promise<string> =>
    new Promise((resolve) => rl.question(query, (answer) => resolve(answer.trim())));

const validateName = (name: string): string | null => {
    if (!name) return 'Name cannot be empty.';
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) {
        return 'Use kebab-case (e.g. "my-feature").';
    }
    if (existsSync(join(gearsRoot, name))) {
        return `Gear "${name}" already exists.`;
    }
    return null;
};

const promptName = async (rl: Interface): Promise<string> => {
    while (true) {
        const name = await prompt(rl, 'Gear name (kebab-case): ');
        const error = validateName(name);
        if (error) {
            console.log(`  ${error}`);
            continue;
        }
        return name;
    }
};

const promptPlatform = async (rl: Interface): Promise<string> => {
    console.log('\nPlatform:');
    console.log('  1) Web + Mobile (default)');
    console.log('  2) Web only');
    console.log('  3) Mobile only');
    while (true) {
        const choice = await prompt(rl, 'Choice [1]: ');
        if (!choice || choice === '1') return 'default';
        if (choice === '2') return 'web-only';
        if (choice === '3') return 'mobile-only';
        console.log('  Invalid choice. Enter 1, 2, or 3.');
    }
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

const generate = (name: string, templateDir: string) => {
    const gearDir = join(gearsRoot, name);

    const templateLabel = templateDir === webOnlyTemplate
        ? 'web-only (no common)'
        : templateDir === mobileOnlyTemplate
            ? 'mobile-only (no common)'
            : 'common + web + mobile';

    console.log(`\nGenerating gear "${name}"...`);
    console.log(`  Template: ${templateLabel}`);

    cpSync(templateDir, gearDir, { recursive: true });
    replacePlaceholders(gearDir, name);

    console.log(`\nDone. Gear "${name}" created at ${gearDir}`);
    console.log('\nNext steps:');
    console.log(`  1. yarn install`);
    console.log(`  2. yarn add:gear ${name} <common|web|mobile> <package>`);
    console.log(`  3. yarn test:gear ${name}`);
    console.log(`  4. Implement engage/disengage logic`);
};

const getTemplateDir = (platform: string) => {
    if (platform === 'web-only') return webOnlyTemplate;
    if (platform === 'mobile-only') return mobileOnlyTemplate;
    return defaultTemplate;
};

const main = async () => {
    const args = process.argv.slice(2);
    const webOnly = args.includes('--web-only');
    const mobileOnly = args.includes('--mobile-only');
    const nameArg = args.find((a) => !a.startsWith('--'));

    let name = '';
    let platform = '';

    if (nameArg) {
        const error = validateName(nameArg);
        if (error) die(error);
        name = nameArg;
    }

    if (webOnly || mobileOnly) {
        platform = webOnly ? 'web-only' : 'mobile-only';
    } else if (nameArg) {
        platform = 'default';
    }

    if (!name || !platform) {
        const rl = createInterface({ input: process.stdin, output: process.stdout });
        try {
            if (!name) name = await promptName(rl);
            if (!platform) platform = await promptPlatform(rl);
        } finally {
            rl.close();
        }
    }

    const templateDir = getTemplateDir(platform);

    if (!existsSync(templateDir)) {
        die(`Template not found at ${templateDir}.`);
    }

    generate(name, templateDir);
};

main();
