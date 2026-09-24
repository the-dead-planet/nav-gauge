import { expect } from 'chai';
import { getAutoTooltipPlacement } from '../src/tooltip';

describe('getAutoTooltipPlacement', () => {
    it('prefers the first side where the tooltip fits', () => {
        expect(getAutoTooltipPlacement(
            { x: 10, y: 10, width: 20, height: 20 },
            { width: 100, height: 50 },
            300,
            200,
        )).to.equal('bottom');
    });

    it('uses the side with the most space when none fit', () => {
        expect(getAutoTooltipPlacement(
            { x: 130, y: 80, width: 20, height: 20 },
            { width: 400, height: 300 },
            300,
            200,
        )).to.equal('right');
    });
});
