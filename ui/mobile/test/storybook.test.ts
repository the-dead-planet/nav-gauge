import { expect } from 'chai';
import { createStoryGroups } from '../src/storybook/discoverStories';

const definition = {
    args: {},
    controls: {},
    renderPlayground: () => null,
    renderGallery: () => null,
};

describe('Mobile story discovery', () => {
    it('preserves path IDs and validates story modules', () => {
        const groups = createStoryGroups([
            { key: './gizmos/first/Button.stories.tsx', exports: { default: definition } },
            { key: './gizmos/second/Button.stories.tsx', exports: { default: definition } },
        ]);

        expect(groups[0].entries.map(({ id }) => id)).to.deep.equal([
            'gizmos/first/Button',
            'gizmos/second/Button',
        ]);
        expect(() => createStoryGroups([
            { key: './gizmos/Broken.stories.tsx', exports: { default: {} } },
        ])).to.throw('Invalid mobile story definition: gizmos/Broken');
        expect(() => createStoryGroups([
            { key: './unknown/Thing.stories.tsx', exports: { default: definition } },
        ])).to.throw('Unknown mobile story group "unknown": unknown/Thing');
    });
});
