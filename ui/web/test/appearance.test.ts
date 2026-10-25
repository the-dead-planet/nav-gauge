import { expect } from 'chai';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
    Orientation,
    Theme,
    ThemeContext,
    ThemeMode,
    ThemeName,
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
const { ThemeSelect } =
    require('../src/assemblies/theme-select/ThemeSelect') as typeof import('../src/assemblies/theme-select/ThemeSelect');
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
        const glowIndex = markup.indexOf('class="polygon-glow"');
        expect(glowIndex).to.be.greaterThan(-1);
        expect(glowIndex).to.be.lessThan(
            markup.indexOf('class="polygon-base"'),
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
