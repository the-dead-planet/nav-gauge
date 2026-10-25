import { expect } from 'chai';
import {
    getThemeColorPreviewGroups,
    Theme,
    ThemeName,
    ThemeSpecification,
    themeSpecifications,
} from '../src';

describe('Theme color previews', () => {
    it('keeps palette and status roles in separate ordered groups for every theme and mode', () => {
        for (const modes of Object.values(themeSpecifications)) {
            for (const specification of [modes.light, modes.dark]) {
                const groups = getThemeColorPreviewGroups(specification);
                expect(
                    groups.map((group) => group.map(({ role }) => role)),
                ).to.deep.equal([
                    ['neutral', 'primary', 'secondary', 'tertiary'],
                    ['glitch', 'hazard', 'secured', 'intel'],
                ]);
                for (const { color, shade } of groups.flat()) {
                    expect(color[shade]).to.have.keys('r', 'g', 'b');
                }
            }
        }
    });

    it('resolves status aliases and configured shades without changing the source specification', () => {
        const original = themeSpecifications[ThemeName.Default].light;
        const specification: ThemeSpecification = {
            ...original,
            statusColors: {
                ...original.statusColors,
                glitch: {
                    name: 'primary',
                    shade: 700,
                },
                hazard: {
                    name: 'red',
                    shade: 400,
                },
            },
        };
        const [, statuses] = getThemeColorPreviewGroups(specification);
        expect(statuses[0].color).to.equal(specification.colors.primary);
        expect(statuses[0].shade).to.equal(700);
        expect(statuses[1].color).to.equal(Theme.palette.red);
        expect(statuses[1].shade).to.equal(400);
        expect(specification.colors).not.to.have.property('glitch');
    });
});
