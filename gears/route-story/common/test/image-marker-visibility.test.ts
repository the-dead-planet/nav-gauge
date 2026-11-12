import { expect } from "chai";
import { describe, it } from "mocha";
import { BehaviorSubject } from "rxjs";
import { StorageKeeper } from "@apparatus";
import {
    cleanUpImageMarkerVisibility,
    DEFAULT_IMAGE_MARKER_VISIBILITY,
} from "../src/tinkers/images";

describe("Image marker visibility persistence", () => {
    it("restores a saved false value through asynchronous storage", async () => {
        const values = new Map<string, string>();
        const keeper = new StorageKeeper({
            getItem: async (key) => values.get(key) ?? null,
            setItem: (key, value) => {
                values.set(key, value);
            },
            removeItem: (key) => {
                values.delete(key);
            },
        });
        const visibility = new BehaviorSubject({
            ...DEFAULT_IMAGE_MARKER_VISIBILITY,
        });
        const subscription = await keeper.synchronizeSubjectWithStorage(
            visibility,
            "route-story:marker-visibility",
            cleanUpImageMarkerVisibility,
        );
        visibility.next({ showImageMarkers: false });
        subscription.unsubscribe();

        const restored = new BehaviorSubject({
            ...DEFAULT_IMAGE_MARKER_VISIBILITY,
        });
        const restoredSubscription = await keeper.synchronizeSubjectWithStorage(
            restored,
            "route-story:marker-visibility",
            cleanUpImageMarkerVisibility,
        );
        expect(restored.value.showImageMarkers).to.equal(false);
        restoredSubscription.unsubscribe();
    });

    it("uses the default for invalid stored values", () => {
        for (const stored of [null, false, {}, { showImageMarkers: "false" }]) {
            expect(cleanUpImageMarkerVisibility(stored)).to.deep.equal(
                DEFAULT_IMAGE_MARKER_VISIBILITY,
            );
        }
    });
});
