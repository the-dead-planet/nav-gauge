import { expect } from 'chai';
import { describe, it } from 'mocha';
import { formatImageMarkerCount } from '../src/tinkers/images';
import { getImageCountBadges, getImageCountBadgeImageName } from '../src/layer-specification/image-count-badges';
import ImagesLayers from '../src/layer-specification/images-layers';

describe('Composite image count badges', () => {
    it('provides exactly ten outlined labels, with both theme colors in each image', () => {
        for (const [background, text] of [['#123456', '#ffffff'], ['#abcdef', '#111111']]) {
            const badges = getImageCountBadges(background, text);
            expect(badges.map(({ id }) => id)).to.deep.equal(
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '9+'].map((label) => getImageCountBadgeImageName(label, background, text)),
            );
            for (const { svg } of badges) {
                expect(svg).to.include(`<polygon points=`).and.include(`fill="${background}"`);
                expect(svg).to.include('<path d="M ').and.include(`fill="${text}"`);
                expect(svg).not.to.include('<text');
            }
            expect(ImagesLayers.countBadge.getLayout(background, text)['icon-image']).to.deep.equal([
                'concat', getImageCountBadgeImageName('', background, text),
                ['case', ['>', ['get', 'markerCount'], 9], '9+', ['to-string', ['get', 'markerCount']]],
            ]);
        }
        expect([1, 9, 10, 100].map(formatImageMarkerCount)).to.deep.equal(['1', '9', '9+', '9+']);
    });
});
