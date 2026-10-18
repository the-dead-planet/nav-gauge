import { uiArchitectureGroups } from '@ui';
import { MobileStoryDefinition, StoryEntry, StoryGroup } from './model';

interface StoryModule {
    key: string;
    exports: Record<string, unknown>;
}

function isMobileStoryDefinition(value: unknown): value is MobileStoryDefinition {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const definition = value as Record<string, unknown>;
    return typeof definition.args === 'object'
        && definition.args !== null
        && typeof definition.controls === 'object'
        && definition.controls !== null
        && typeof definition.renderPlayground === 'function'
        && typeof definition.renderGallery === 'function';
}

export function createStoryGroups(modules: StoryModule[]): StoryGroup[] {
    const entries = modules.map(({ key, exports }): StoryEntry => {
        const path = key.replace(/^\.\//, '').replace(/\.stories\.tsx$/, '');
        const parts = path.split('/');
        const group = parts[0];
        const defaultExport = exports.default;

        if (defaultExport !== undefined && !isMobileStoryDefinition(defaultExport)) {
            throw new Error(`Invalid mobile story definition: ${path}`);
        }

        return {
            id: path,
            group,
            name: parts.at(-1) ?? path,
            definition: defaultExport,
            legacyStories: Object.entries(exports)
                .filter(([name, value]) => name !== 'default' && typeof value === 'function')
                .map(([name, Component]) => ({ name, Component: Component as StoryEntry['legacyStories'][number]['Component'] })),
        };
    });

    const knownGroups = new Set<string>(uiArchitectureGroups.map(({ name }) => name));
    const unknownEntry = entries.find((entry) => !knownGroups.has(entry.group));
    if (unknownEntry) {
        throw new Error(`Unknown mobile story group "${unknownEntry.group}": ${unknownEntry.id}`);
    }

    return uiArchitectureGroups.map((group) => ({
        ...group,
        entries: entries
            .filter((entry) => entry.group === group.name)
            .sort((first, second) => first.name.localeCompare(second.name)),
    })).filter((group) => group.entries.length > 0);
}

export function discoverStoryGroups(): StoryGroup[] {
    const context = require.context('../', true, /\.stories\.tsx$/);
    return createStoryGroups(context.keys().map((key: string) => ({
        key,
        exports: context(key) as Record<string, unknown>,
    })));
}
