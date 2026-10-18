import { expect } from 'chai';
import { getDropdownMenuPosition } from '../src/forms/dropdown/tinkers';

describe('Mobile Dropdown', () => {
    it('places measured menus on the side where they fit', () => {
        expect(getDropdownMenuPosition(100, 124, 80, 600)).to.deep.equal({
            top: 128,
            maxHeight: 240,
        });
        expect(getDropdownMenuPosition(500, 524, 120, 600)).to.deep.equal({
            top: 376,
            maxHeight: 240,
        });
    });
});
