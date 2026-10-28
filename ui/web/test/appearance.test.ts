import { expect } from 'chai';
import { createRequire } from 'node:module';
import { ComponentProps, createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
    appearanceColorOptions,
    ColorBoxProps,
    fillVariantOptions,
    MenuContext,
    Orientation,
    Theme,
    ThemeContext,
    ThemeMode,
    ThemeName,
    sizeOptions,
    themeSpecifications,
} from '@ui';

const require = createRequire(__filename);
const previousCssLoader = require.extensions['.css'];
require.extensions['.css'] = (module) => {
    module.exports = {
        __esModule: true,
        default: new Proxy(
            {},
            {
                get: (_target, name) => name,
            },
        ),
    };
};
const { Hexagon } =
    require('../src/hud/hexagon/Hexagon') as typeof import('../src/hud/hexagon/Hexagon');
const { Panel } = require('../src/hud/panel/Panel') as typeof import('../src/hud/panel/Panel');
const { BevelPanel } = require('../src/hud/bevel-panel/BevelPanel') as typeof import('../src/hud/bevel-panel/BevelPanel');
const { NotchedPanel } = require('../src/hud/notched-panel/NotchedPanel') as typeof import('../src/hud/notched-panel/NotchedPanel');
const { HudDecoration } = require('../src/hud/decoration/HudDecoration') as typeof import('../src/hud/decoration/HudDecoration');
const { ThemeSelect } =
    require('../src/assemblies/theme-select/ThemeSelect') as typeof import('../src/assemblies/theme-select/ThemeSelect');
const { Divider } =
    require('../src/chassis/divider/Divider') as typeof import('../src/chassis/divider/Divider');
const { Button } = require('../src/gizmos/button/Button') as typeof import('../src/gizmos/button/Button');
const { Chip } = require('../src/gizmos/chip/Chip') as typeof import('../src/gizmos/chip/Chip');
const { ResizeHandle } = require('../src/gizmos/resize-handle/ResizeHandle') as typeof import('../src/gizmos/resize-handle/ResizeHandle');
const { ColorBox } = require('../src/gizmos/color-box/ColorBox') as typeof import('../src/gizmos/color-box/ColorBox');
const { Menu } = require('../src/rigs/menu/Menu') as typeof import('../src/rigs/menu/Menu');
const { MenuItem } = require('../src/rigs/menu/MenuItem') as typeof import('../src/rigs/menu/MenuItem');
if (previousCssLoader) {
    require.extensions['.css'] = previousCssLoader;
} else {
    delete require.extensions['.css'];
}

const media = {
    initial: () => ({
        orientation: Orientation.Landscape,
        windowWidth: 1280,
        windowHeight: 720,
    }),
    subscribe: () => ({
        unsubscribe: () => undefined,
    }),
};

describe('Composed appearance rendering', () => {
    it('inherits menu item size and highlight policy without retaining disabled link navigation', () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        for (const color of appearanceColorOptions) {
            for (const size of sizeOptions) {
                const markup = renderToStaticMarkup(createElement(ThemeContext.Provider, {
                    value: theme,
                    children: createElement(MenuContext.Provider, {
                        value: { color, highlightColor: 'hazard', size, onClose: () => undefined },
                        children: createElement(MenuItem, {
                            key: 'link',
                            type: 'link',
                            href: '/route',
                            highlighted: true,
                            disabled: true,
                            glyphsShade: 500,
                            highlightGlyphsShade: 200,
                            children: 'Route',
                        }),
                    }),
                }));
                expect(markup).to.include(`size-${size}`);
                expect(markup).to.include(`data-appearance-color="${color}"`);
                expect(markup).to.include('data-appearance-highlight="hazard"');
                expect(markup).to.include('data-appearance-variant="menu-item"');
                expect(markup).to.include('data-disabled="true"');
                expect(markup).to.include('aria-disabled="true"');
                expect(markup).to.include('tabindex="-1"');
                expect(markup).not.to.include('href=');
                expect(markup).to.include(`--appearance-default-glyphs-override:${theme.color(color, 500)}`);
                expect(markup).to.include(`--appearance-active-pressed-glyphs-override:${theme.color('hazard', 200)}`);
                expect([...markup.matchAll(/data-interactive="true"/g)]).to.have.length(1);
            }
        }
        theme.destroy();
    });

    it('renders selected menu rows with checked semantics and highlight-palette overrides', () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].dark, media);
        const markup = renderToStaticMarkup(createElement(ThemeContext.Provider, {
            value: theme,
            children: createElement(MenuItem, {
                type: 'button',
                color: 'glitch',
                highlightColor: 'intel',
                highlightGlyphsShade: 100,
                selected: true,
                children: 'Selected route',
            }),
        }));
        expect(markup).to.include('data-appearance-variant="menu-item"');
        expect(markup).to.include('data-highlighted="true"');
        expect(markup).to.include('data-appearance-color="glitch"');
        expect(markup).to.include('data-appearance-highlight="intel"');
        expect(markup).to.include('role="menuitemradio"');
        expect(markup).to.include('aria-checked="true"');
        expect(markup).to.include(`--appearance-active-pressed-glyphs-override:${theme.color('intel', 100)}`);
        expect([...markup.matchAll(/data-interactive="true"/g)]).to.have.length(1);
        theme.destroy();
    });

    it('marks link menu items without giving their icons a separate appearance owner', () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        const renderItem = (item: ComponentProps<typeof MenuItem>) => renderToStaticMarkup(createElement(ThemeContext.Provider, {
            value: theme,
            children: createElement(MenuItem, item),
        }));
        const internal = renderItem({ type: 'link', href: '#route', children: 'Route' });
        const external = renderItem({ type: 'link', href: '/legal', target: '_blank', children: 'Legal' });
        const action = renderItem({ type: 'button', children: 'Settings' });
        expect(internal).to.include('data-link-type="internal"');
        expect(external).to.include('data-link-type="external"');
        expect(action).not.to.include('data-link-type');
        expect(internal).to.include('aria-hidden="true"');
        expect(external).to.include('aria-hidden="true"');
        for (const markup of [internal, external, action]) {
            expect([...markup.matchAll(/data-appearance-variant=/g)]).to.have.length(1);
        }
        theme.destroy();
    });

    it('lets menu size override the legacy icon size and keeps the trigger accessible', () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        const markup = renderToStaticMarkup(createElement(ThemeContext.Provider, {
            value: theme,
            children: createElement(Menu, {
                size: 'lg',
                iconSize: 'xs',
                triggerAccessibilityLabel: 'Route actions',
                disabled: true,
                triggerActive: true,
            }),
        }));
        expect(markup).to.include('only-icon-lg');
        expect(markup).not.to.include('only-icon-xs');
        expect(markup).to.include('aria-label="Route actions"');
        expect(markup).to.include('aria-haspopup="menu"');
        expect(markup).to.include('aria-expanded="false"');
        expect(markup).to.include('disabled=""');
        theme.destroy();
    });

    it('gives the trigger-specific color priority over the shared menu highlight', () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        const markup = renderToStaticMarkup(createElement(ThemeContext.Provider, {
            value: theme,
            children: createElement(Menu, {
                color: 'neutral',
                highlightColor: 'primary',
                iconActiveColor: 'secondary',
                triggerAccessibilityLabel: 'Open menu',
            }),
        }));
        expect(markup).to.include('data-appearance-highlight="secondary"');
        expect(markup).not.to.include('data-appearance-highlight="primary"');
        theme.destroy();
    });

    it('renders named, default and custom ColorBox sizes as pixel dimensions', () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        const cases: { size: ColorBoxProps['size']; sideLength: number }[] = [
            { size: 'xs', sideLength: 18 },
            { size: 'sm', sideLength: 24 },
            { size: 'md', sideLength: 32 },
            { size: 'lg', sideLength: 40 },
            { size: undefined, sideLength: 24 },
            { size: 40, sideLength: 40 },
        ];
        for (const { size, sideLength } of cases) {
            const markup = renderToStaticMarkup(createElement(ThemeContext.Provider, {
                value: theme,
                children: createElement(ColorBox, {
                    color: Theme.palette.copper,
                    size,
                }),
            }));
            expect(markup).to.include(`--color-box-size:${sideLength}px`);
        }
        theme.destroy();
    });

    it('gives every button shape one appearance owner and resolves status glyph overrides', () => {
        const theme = new Theme(themeSpecifications[ThemeName.Default].light, media);
        for (const color of appearanceColorOptions) {
            for (const corners of ['square', 'circle', 'hexagon'] as const) {
                const markup = renderToStaticMarkup(createElement(ThemeContext.Provider, {
                    value: theme,
                    children: createElement(Button, {
                        color,
                        highlightColor: 'intel',
                        glyphsShade: 500,
                        highlightGlyphsShade: 200,
                        corners,
                        highlighted: true,
                        disabled: true,
                        tooltip: 'Launch',
                    }),
                }));
                expect([...markup.matchAll(/data-interactive="true"/g)]).to.have.length(1);
                expect([...markup.matchAll(/<button/g)]).to.have.length(1);
                expect(markup).to.include('aria-label="Launch"');
                expect(markup).to.include('disabled=""');
                expect(markup).to.include(`--appearance-default-glyphs-override:${theme.color(color, 500)}`);
                expect(markup).to.include(`--appearance-active-pressed-glyphs-override:${theme.color('intel', 200)}`);
            }
        }
        theme.destroy();
    });

    it('resets chip defaults and keeps resize grip appearance on its parent for all colors', () => {
        const chip = renderToStaticMarkup(createElement(Chip, { children: 'Telemetry' }));
        expect(chip).to.include('data-appearance-variant="ghost"');
        expect(chip).to.include('data-appearance-color="neutral"');
        for (const color of appearanceColorOptions) {
            const handle = renderToStaticMarkup(createElement(ResizeHandle, {
                direction: 'horizontal',
                color,
                disabled: true,
                tooltip: 'Resize panel',
                onDrag: () => undefined,
            }));
            expect(handle).to.include(`data-appearance-highlight="${color}"`);
            expect(handle).to.include('data-appearance-variant="outline"');
            expect([...handle.matchAll(/data-appearance-variant="fill-inverse"/g)]).to.have.length(2);
            expect(handle).to.include('aria-disabled="true"');
            expect(handle).not.to.include('tabindex="0"');
            expect(handle).not.to.include('--grip-color');
        }
    });

    it('applies resize fill variants only to passive decorative grips', () => {
        for (const variant of fillVariantOptions) {
            for (const color of appearanceColorOptions) {
                const markup = renderToStaticMarkup(createElement(ResizeHandle, {
                    direction: 'horizontal',
                    color,
                    highlightColor: 'secondary',
                    variant,
                    tooltip: 'Resize panel',
                    onDrag: () => undefined,
                }));
                expect([...markup.matchAll(/data-appearance-variant="outline"/g)]).to.have.length(1);
                expect([...markup.matchAll(new RegExp(`data-appearance-variant="${variant}"`, 'g'))]).to.have.length(2);
                expect([...markup.matchAll(/tabindex="0"/g)]).to.have.length(1);
                expect([...markup.matchAll(/aria-hidden="true"/g)]).to.have.length(2);
                expect(markup).not.to.include('role="button"');
            }
        }
    });

    it('resets HUD appearance for every color and removes disabled keyboard activation', () => {
        for (const color of appearanceColorOptions) {
            for (const Surface of [Panel, BevelPanel, NotchedPanel]) {
                const markup = renderToStaticMarkup(createElement(Surface, {
                    color,
                    highlightColor: 'hazard',
                    onClick: () => undefined,
                    highlighted: true,
                    disabled: true,
                    children: 'Telemetry',
                }));
                expect(markup).to.include('data-appearance-variant="fill-inverse"');
                expect(markup).to.include(`data-appearance-color="${color}"`);
                expect(markup).to.include('data-appearance-highlight="hazard"');
                expect(markup).to.include('role="button"');
                expect(markup).to.include('tabindex="-1"');
                expect(markup).to.include('aria-disabled="true"');
                expect(markup).to.include('data-disabled="true"');
                expect(markup).not.to.include('color-hazard');
            }
            const decoration = renderToStaticMarkup(createElement(HudDecoration, { color, children: 'Telemetry' }));
            expect(decoration).to.include(`data-appearance-color="${color}"`);
            expect(decoration).to.include('aria-hidden="true"');
        }
    });

    it('keeps the policy border optional and consumes one layer policy for stacked panels', () => {
        const markup = renderToStaticMarkup(createElement(Panel, {
            onClick: () => undefined,
            elevationLayer: 'dialog',
            borderWidth: 0,
        }));
        expect(markup).to.include('tabindex="0"');
        expect(markup).to.include('layer-dialog');
        expect(markup).not.to.include('elevation-none');
        expect(markup).to.include('--appearance-border-width-scale:0');
    });
    it('keeps divider margins independent of stylesheet order and resets inherited appearance', () => {
        for (const color of appearanceColorOptions) {
            const markup = renderToStaticMarkup(createElement(Divider, {
                orientation: 'vertical',
                color,
                m: 'xl',
                mh: 'lg',
                mv: 'md',
                mt: 'xs',
                ml: 'sm',
            }));

            expect(markup).to.include('aria-orientation="vertical"');
            expect(markup).to.include('data-appearance-variant="default"');
            expect(markup).to.include(`data-appearance-color="${color}"`);
            expect(markup).to.include('class="divider vertical margin-top-xs margin-right-lg margin-bottom-md margin-left-sm"');
        }
    });

    it('paints the glow behind the hexagon surface and border without an opaque source stroke', () => {
        const theme = new Theme(
            themeSpecifications[ThemeName.Default].dark,
            media,
        );
        const markup = renderToStaticMarkup(
            createElement(ThemeContext.Provider, {
                value: theme,
                children: createElement(Hexagon, {
                    variant: 'fill-inverse',
                    activeGlow: 'glow',
                    highlighted: true,
                }),
            }),
        );
        const glowIndex = markup.indexOf('class="polygon-glow glow"');
        expect(glowIndex).to.be.greaterThan(-1);
        expect(glowIndex).to.be.lessThan(
            markup.indexOf('class="polygon-base paint"'),
        );
        expect(markup).not.to.include('<feMergeNode in="SourceGraphic"');
        theme.destroy();
    });

    it('renders four palette and four status swatches with a divider between them in each mode', () => {
        const modes: ThemeMode[] = ['light', 'dark'];
        for (const mode of modes) {
            const theme = new Theme(
                themeSpecifications[ThemeName.Default][mode],
                media,
            );
            const markup = renderToStaticMarkup(
                createElement(ThemeContext.Provider, {
                    value: theme,
                    children: createElement(ThemeSelect, {
                        mode,
                        value: ThemeName.Default,
                        onChange: () => undefined,
                    }),
                }),
            );
            const swatches = [...markup.matchAll(/class="color-box"/g)];
            const dividerIndex = markup.indexOf('class="divider vertical"');
            expect(swatches).to.have.length(8);
            expect(dividerIndex).to.be.greaterThan(swatches[3].index);
            expect(dividerIndex).to.be.lessThan(swatches[4].index);
            theme.destroy();
        }
    });
});
