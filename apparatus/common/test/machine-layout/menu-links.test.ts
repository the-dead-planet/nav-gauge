import { expect } from 'chai';
import { getMachineMenuLinks } from '../../src/machine-ward/tinkers';

describe('Machine menu documentation links', () => {
    it('uses development documentation on localhost and production URLs otherwise', () => {
        expect(getMachineMenuLinks('localhost')).to.deep.equal({
            componentLibrary: 'http://127.0.0.1:6006',
            iconCreators: 'http://127.0.0.1:6006/?path=/docs/design-system-icons--docs',
            legal: '/legal',
            privacy: '/privacy',
        });
        const productionLinks = getMachineMenuLinks();
        expect(productionLinks.componentLibrary).to.equal(
            'https://gauge.spookydoodle.com/storybook',
        );
        expect(productionLinks.iconCreators).to.equal(
            'https://gauge.spookydoodle.com/storybook/?path=/docs/design-system-icons--docs',
        );
        expect(getMachineMenuLinks('preview.example')).to.deep.equal(
            productionLinks,
        );
    });
});
