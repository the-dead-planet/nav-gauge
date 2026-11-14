import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ToolsStation } from '../../src/machine-ward/tools-station/tools-station';

describe('Tool icon updates', () => {
    it('updates the observed icon without registering the tool again', () => {
        const station = new ToolsStation<unknown>();
        const toolIcon = station.addToolIcon('images', {
            placement: 'left',
            icon: 'visible-icon',
            tooltip: {
                n: 'test',
                t: 'images',
            },
        });
        let registryEmissions = 0;
        let observedIcon: string | undefined;
        const registrySubscription = station.toolIcons$.subscribe(() => { registryEmissions++; });
        const placementSubscription = station.toolIconsByPlacement$.subscribe((tools) => {
            observedIcon = tools[0].icon;
        });

        expect(observedIcon).to.equal('visible-icon');
        toolIcon.icon$.next('hidden-icon');
        expect(observedIcon).to.equal('hidden-icon');
        toolIcon.icon$.next(undefined);
        expect(observedIcon).to.equal(undefined);
        expect(registryEmissions).to.equal(1);
        expect(station.toolIcons$.value.get('images')).to.equal(toolIcon);

        placementSubscription.unsubscribe();
        registrySubscription.unsubscribe();
        station.cleanUp();
    });
});
