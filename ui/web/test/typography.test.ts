import { expect } from 'chai';
import { createRequire } from 'node:module';
import { createElement, ReactElement } from 'react';
import { renderToStaticMarkup as renderMarkup } from 'react-dom/server';
import { ColorVariant, Orientation, Theme, ThemeContext, ThemeName, themeSpecifications, typographyFontWeights } from '@ui';

const require = createRequire(__filename);
const previousCssLoader = require.extensions['.css'];
require.extensions['.css'] = (module) => {
    module.exports = {
        __esModule: true,
        default: new Proxy({}, {
            get: (_target, name) => name,
        }),
    };
};

const { Text } = require('../src/design-system/typography/Text') as typeof import('../src/design-system/typography/Text');
const { LinkText } = require('../src/design-system/typography/LinkText') as typeof import('../src/design-system/typography/LinkText');
if (previousCssLoader) {
    require.extensions['.css'] = previousCssLoader;
} else {
    delete require.extensions['.css'];
}

const theme = new Theme(themeSpecifications[ThemeName.Default].light, {
    initial: () => ({
        orientation: Orientation.Landscape,
        windowWidth: 1280,
        windowHeight: 720,
    }),
    subscribe: () => ({ unsubscribe: () => undefined }),
});
const renderToStaticMarkup = (children: ReactElement): string => renderMarkup(
    createElement(ThemeContext.Provider, {
        value: theme,
        children,
    }),
);

describe('Typography', () => {
    after(() => theme.destroy());

    it('selects an optional glyph variant while retaining mode and shade overrides', () => {
        const markup = renderToStaticMarkup(createElement(Text, {
            variant: 'ghost',
            themeMode: 'dark',
            color: 'primary',
            shade: 500,
            highlightShade: 200,
            children: 'Route name',
        }));
        expect(markup).to.include('data-appearance-variant="ghost"');
        expect(markup).to.include('data-appearance-mode="dark"');
        expect(markup).to.include('--appearance-default-glyphs-override:var(--color-primary-500)');
        expect(markup).to.include('--appearance-active-pressed-glyphs-override:var(--color-primary-200)');
        expect(markup).not.to.include(' variant=');
        expect(markup).not.to.include('background-color');
    });

    it('lets themeMode override the surrounding theme without leaking a DOM prop', () => {
        const markup = renderToStaticMarkup(createElement(Text, {
            themeMode: 'dark',
            children: 'Dark text',
        }));
        expect(markup).to.include('data-appearance-mode="dark"');
        expect(markup).not.to.include('themeMode=');
    });

    it('inherits the owning appearance when no palette is supplied', () => {
        const markup = renderToStaticMarkup(createElement(Text, {
            children: 'Inherited label',
        }));
        expect(markup).not.to.include('data-appearance-variant=');
        expect(markup).not.to.include('data-appearance-color=');
        expect(markup).not.to.include('data-appearance-highlight=');

        const shadedMarkup = renderToStaticMarkup(createElement(Text, {
            shade: 100,
            highlightShade: 200,
        }));
        expect(shadedMarkup).to.include('--appearance-default-glyphs-override:var(--appearance-color-100)');
        expect(shadedMarkup).to.include('--appearance-active-pressed-glyphs-override:var(--appearance-highlight-200)');
    });

    it('renders every color through default appearance regardless of text hierarchy', () => {
        const colors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary', 'glitch', 'hazard', 'secured', 'intel'];
        for (const color of colors) {
            const markup = renderToStaticMarkup(createElement(Text, {
                color,
                usage: 'header',
                as: 'h1',
                shade: 100,
                highlightColor: 'hazard',
                highlightShade: 700,
                children: 'Telemetry',
            }));

            expect(markup).to.match(/^<h1 /);
            expect(markup).to.include('data-appearance-variant="default"');
            expect(markup).to.include(`data-appearance-color="${color}"`);
            expect(markup).to.include('--appearance-default-glyphs-override:var(--color-' + color + '-100)');
            expect(markup).to.include('--appearance-hover-focus-glyphs-override:var(--color-hazard-700)');
            expect(markup).to.include('--appearance-active-pressed-glyphs-override:var(--color-hazard-700)');
        }
    });

    it('applies weight overrides to headers without leaking typography props to the DOM', () => {
        for (const fontWeight of typographyFontWeights) {
            const markup = renderToStaticMarkup(createElement(Text, {
                usage: 'header',
                fontWeight,
                bold: true,
                children: 'Weighted header',
            }));

            expect(markup).to.include(`weight-${fontWeight}`);
            expect(markup).not.to.include('fontWeight=');
            expect(markup).not.to.include('usage=');
        }
        const normalHeader = renderToStaticMarkup(createElement(Text, {
            usage: 'header',
            fontWeight: 'normal',
            bold: true,
        }));
        expect(normalHeader).to.include('weight-400');
    });

    it('removes navigation and keyboard access from disabled highlighted links', () => {
        const markup = renderToStaticMarkup(createElement(LinkText, {
            href: 'https://example.com',
            disabled: true,
            highlighted: true,
            children: 'Link',
        }));

        expect(markup).to.include('aria-disabled="true"');
        expect(markup).to.include('role="link"');
        expect(markup).to.include('tabindex="-1"');
        expect(markup).not.to.include('href=');
    });
});
