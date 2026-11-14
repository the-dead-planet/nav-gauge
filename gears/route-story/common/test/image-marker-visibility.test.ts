import { expect } from 'chai';
import { describe, it } from 'mocha';
import { BehaviorSubject } from 'rxjs';
import { StorageKeeper } from '@apparatus';
import { cleanUpRouteStoryState, defaultRouteStoryState } from '../src';

describe('Route story marker visibility', () => {
    it('persists independent player and layer visibility with route styling', async () => {
        const values = new Map<string, string>();
        const keeper = new StorageKeeper({
            getItem: async (key) => values.get(key) ?? null,
            setItem: (key, value) => { values.set(key, value); },
            removeItem: (key) => { values.delete(key); },
        });
        const state = new BehaviorSubject({ ...defaultRouteStoryState });
        const subscription = await keeper.synchronizeSubjectWithStorage(state, 'route-story:state', cleanUpRouteStoryState);
        state.next({ ...state.value, markerPlayerVisibility: false, markerLayerVisibility: false });
        subscription.unsubscribe();
        const restored = new BehaviorSubject({ ...defaultRouteStoryState });
        const restoredSubscription = await keeper.synchronizeSubjectWithStorage(restored, 'route-story:state', cleanUpRouteStoryState);
        expect(restored.value.markerPlayerVisibility).to.equal(false);
        expect(restored.value.markerLayerVisibility).to.equal(false);
        expect(restored.value.routeStyleActive).to.deep.equal(defaultRouteStoryState.routeStyleActive);
        restoredSubscription.unsubscribe();
    });

    it('defaults missing or invalid visibility values in old saved route states', () => {
        for (const saved of [{}, { markerPlayerVisibility: 'false', markerLayerVisibility: null }]) {
            const state = cleanUpRouteStoryState(saved);
            expect(state.markerPlayerVisibility).to.equal(true);
            expect(state.markerLayerVisibility).to.equal(true);
        }
    });
});
