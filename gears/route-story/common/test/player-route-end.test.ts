import { expect } from "chai";
import { describe, it } from "mocha";
import { mock } from "node:test";
import { BehaviorSubject } from "rxjs";
import { ChronoLens, LoadedImageData } from "@apparatus";
import { GeoJson } from "@tinker-chest";
import { Animatrix, PlaybackPacing } from "../src/animatrix";
import { defaultRouteStoryState } from "../src/layer-specification";
import { RouteStoryFile } from "../src/model";
import { PlayerOperator } from "../src/player-operator";
import { RouteStoryGear } from "../src/route-story-gear";
import { getRouteGeometryData } from "../src/tinkers";

describe("Playback at the route endpoint", () => {
    const pacingOptions: PlaybackPacing[] = ["distance", "timeline"];
    for (const playbackPacing of pacingOptions) {
        it(`displays every endpoint image before the whole-route pan with ${playbackPacing} pacing`, () => {
            const events: string[] = [];
            const frames = new Map<number, (time: number) => void>();
            let frameId = 0;
            let now = 0;
            const descriptors = new Map(
                ["requestAnimationFrame", "cancelAnimationFrame"].map(
                    (name) => [
                        name,
                        Object.getOwnPropertyDescriptor(globalThis, name),
                    ],
                ),
            );
            Object.defineProperty(globalThis, "requestAnimationFrame", {
                configurable: true,
                value: (callback: (time: number) => void) => {
                    frames.set(++frameId, callback);
                    return frameId;
                },
            });
            Object.defineProperty(globalThis, "cancelAnimationFrame", {
                configurable: true,
                value: (id: number) => {
                    frames.delete(id);
                },
            });
            mock.method(performance, "now", () => now);
            mock.timers.enable({ apis: ["setTimeout"] });

            const geojson: GeoJson = {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: { type: "Point", coordinates: [0, 0] },
                        properties: { id: 1, time: "1970-01-01T00:00:00Z" },
                    },
                    {
                        type: "Feature",
                        geometry: { type: "Point", coordinates: [1, 0] },
                        properties: { id: 2, time: "1970-01-01T00:00:01Z" },
                    },
                ],
            };
            const animatrix = new Animatrix();
            animatrix.controls$.next({
                ...Animatrix.defaultControls,
                playbackPacing,
                routePlaybackDuration: 100,
                displayImageDuration: 50,
                easeDuration: 25,
            });
            const gear = {
                apparatus: {
                    chronoLens: { isPlaying$: new BehaviorSubject(true) },
                    cartomancer: { map: {} },
                },
                animatrix,
                data$: new BehaviorSubject({ geojson }),
                routeGeometryData$: new BehaviorSubject(
                    getRouteGeometryData(geojson),
                ),
                routeTimes$: new BehaviorSubject({
                    startTimeEpoch: 0,
                    duration: 1000,
                }),
                progressMs$: new BehaviorSubject(0),
                state$: new BehaviorSubject(defaultRouteStoryState),
                fitBoundsHandler: () => events.push("bounds"),
            } as unknown as RouteStoryGear<
                object,
                ChronoLens,
                RouteStoryFile,
                null
            >;
            const player = new PlayerOperator(gear);
            const subscription = animatrix.displayImageId$.subscribe((id) => {
                if (id !== null) {
                    events.push(`image-${id}`);
                }
            });
            const images: LoadedImageData<null>[] = [1, 2].map((id) => ({
                id,
                name: `image-${id}`,
                distanceFraction: 1,
                data: null,
            }));
            const runFrame = () => {
                const frame = frames.entries().next().value;
                if (!frame) {
                    throw new Error("No animation frame scheduled");
                }
                frames.delete(frame[0]);
                frame[1](now);
            };

            try {
                player.animateRoute(
                    images,
                    () => {},
                    (position) => {
                        expect(position).to.deep.equal([1, 0]);
                        events.push("camera");
                    },
                );
                now = 200;
                runFrame();
                expect(events).to.deep.equal(["camera"]);
                mock.timers.tick(25);
                expect(events).to.deep.equal(["camera", "image-1"]);
                mock.timers.tick(50);
                runFrame();
                expect(events).to.deep.equal(["camera", "image-1", "camera"]);
                mock.timers.tick(25);
                expect(events).to.deep.equal([
                    "camera",
                    "image-1",
                    "camera",
                    "image-2",
                ]);
                mock.timers.tick(50);
                runFrame();
                expect(events).to.deep.equal([
                    "camera",
                    "image-1",
                    "camera",
                    "image-2",
                    "bounds",
                ]);
                expect(gear.progressMs$.value).to.equal(1000);
                expect(frames.size).to.equal(0);
            } finally {
                player.cleanupAnimateRoute();
                subscription.unsubscribe();
                mock.timers.reset();
                mock.restoreAll();
                for (const [name, descriptor] of descriptors) {
                    if (descriptor) {
                        Object.defineProperty(globalThis, name, descriptor);
                    } else {
                        Reflect.deleteProperty(globalThis, name);
                    }
                }
            }
        });
    }
});
