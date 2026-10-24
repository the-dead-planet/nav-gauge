import { expect } from 'chai';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ColorVariant, typographyFontWeights } from '@ui';

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

describe('Typography', () => {
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
