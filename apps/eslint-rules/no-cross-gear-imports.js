const FILE_PATTERNS = [
    { re: /[/\\]packages[/\\]tinker-chest[/\\]/,            type: 'tinker-chest' },
    { re: /[/\\]packages[/\\]apparatus[/\\]/,               type: 'apparatus' },
    { re: /[/\\]ui[/\\]common[/\\]/,                        type: 'ui-common' },
    { re: /[/\\]ui[/\\]web[/\\]/,                           type: 'ui-web' },
    { re: /[/\\]ui[/\\]mobile[/\\]/,                        type: 'ui-mobile' },
    { re: /[/\\]app-web[/\\]/,                               type: 'app-web' },
    { re: /[/\\]app-mobile[/\\]/,                            type: 'app-mobile' },
    { re: /[/\\]gears[/\\]([^/\\]+)[/\\]common[/\\]/,      type: 'gear-common', gearIdx: 1 },
    { re: /[/\\]gears[/\\]([^/\\]+)[/\\]web[/\\]/,         type: 'gear-web',    gearIdx: 1 },
    { re: /[/\\]gears[/\\]([^/\\]+)[/\\]mobile[/\\]/,      type: 'gear-mobile', gearIdx: 1 },
];

function getSourceInfo(filename) {
    for (const p of FILE_PATTERNS) {
        const m = filename.match(p.re);
        if (m) return { type: p.type, gear: p.gearIdx != null ? m[p.gearIdx] : undefined };
    }
    return null;
}

const IMPORT_PATTERNS = [
    { re: /^@the-dead-planet\/nav-gauge-tinker-chest$/,                                        type: 'tinker-chest' },
    { re: /^@the-dead-planet\/nav-gauge-apparatus$/,                                           type: 'apparatus' },
    { re: /^@the-dead-planet\/nav-gauge-ui-common$/,                                           type: 'ui-common' },
    { re: /^@the-dead-planet\/nav-gauge-ui-web$/,                                              type: 'ui-web' },
    { re: /^@the-dead-planet\/nav-gauge-ui-mobile$/,                                           type: 'ui-mobile' },
    { re: /^@the-dead-planet\/nav-gauge-gears-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)-common$/,       type: 'gear-common', gearIdx: 1 },
    { re: /^@the-dead-planet\/nav-gauge-gears-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)-web$/,          type: 'gear-web',    gearIdx: 1 },
    { re: /^@the-dead-planet\/nav-gauge-gears-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)-mobile$/,       type: 'gear-mobile', gearIdx: 1 },
    { re: /^@the-dead-planet\/nav-gauge-app-web$/,                                             type: 'app-web' },
    { re: /^@the-dead-planet\/nav-gauge-app-mobile$/,                                          type: 'app-mobile' },
];

function parseImport(source) {
    for (const p of IMPORT_PATTERNS) {
        const m = source.match(p.re);
        if (m) return { type: p.type, gear: p.gearIdx != null ? m[p.gearIdx] : undefined };
    }
    return null;
}

const ALLOWED = {
    'tinker-chest':  [],
    'apparatus':     ['tinker-chest'],
    'ui-common':     ['tinker-chest', 'apparatus'],
    'ui-web':        ['tinker-chest', 'apparatus', 'ui-common'],
    'ui-mobile':     ['tinker-chest', 'apparatus', 'ui-common'],
    'gear-common':   ['tinker-chest', 'apparatus', 'ui-common'],
    'gear-web':      ['tinker-chest', 'apparatus', 'ui-common', 'ui-web', 'gear-common'],
    'gear-mobile':   ['tinker-chest', 'apparatus', 'ui-common', 'ui-mobile', 'gear-common'],
    'app-web':       ['tinker-chest', 'apparatus', 'ui-common', 'ui-web', 'gear-web'],
    'app-mobile':    ['tinker-chest', 'apparatus', 'ui-common', 'ui-mobile', 'gear-mobile'],
};

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Enforce import direction rules across the monorepo.',
        },
        messages: {
            disallowed: '"{{source}}" must not import from "{{target}}". Allowed direction: {{source}} → {{allowed}}.',
            crossGear: 'Gear "{{srcGear}}" must not import from gear "{{tgtGear}}". Gears must be independent.',
        },
        schema: [],
    },
    create(context) {
        const filename = context.filename ?? context.getFilename();
        const source = getSourceInfo(filename);
        if (!source) return {};

        return {
            ImportDeclaration(node) {
                const importSource = node.source.value;
                if (typeof importSource !== 'string') return;

                const target = parseImport(importSource);
                if (!target) return;

                const allowed = ALLOWED[source.type];
                if (!allowed.includes(target.type)) {
                    context.report({
                        node,
                        messageId: 'disallowed',
                        data: {
                            source: source.type + (source.gear ? `/${source.gear}` : ''),
                            target: target.type + (target.gear ? `/${target.gear}` : ''),
                            allowed: allowed.join(', ') || '(none)',
                        },
                    });
                    return;
                }

                if (target.type.startsWith('gear-') && source.type.startsWith('gear-')) {
                    if (source.gear !== target.gear) {
                        context.report({
                            node,
                            messageId: 'crossGear',
                            data: {
                                srcGear: source.gear,
                                tgtGear: target.gear,
                            },
                        });
                    }
                }
            },
        };
    },
};
