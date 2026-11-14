import { act, renderHook } from "@testing-library/react-native";
import { GestureResponderEvent } from "react-native";
import { BehaviorSubject } from "rxjs";
import { MobileMap } from "@mobile-apparatus";
import { MarkerImage } from "@apparatus";
import { GeoJson } from "@tinker-chest";
import {
    draggingImage$,
    RouteGeometryData,
    updateImageDistanceFraction,
} from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { useMapImageInteraction } from "../src/images/useMapImageInteraction";
import { MobileMarkerImageData } from "../src/images/image-parser";
import { MapImageHitTarget } from "../src/images/model";

jest.mock("@the-dead-planet/nav-gauge-gears-route-story-common", () => {
    const { BehaviorSubject } = jest.requireActual<typeof import("rxjs")>("rxjs");
    return {
        draggingImage$: new BehaviorSubject(null),
        draggingPlacement$: new BehaviorSubject(null),
        MAP_IMAGE_MARKER_OFFSET_Y: -35,
        MAP_IMAGE_COUNT_BADGE_OFFSET: [20, -55],
        THUMBNAIL_IMAGE_SIZE: 50,
        getRoutePlacement: () => ({ distanceFraction: 0.5 }),
        updateImageDistanceFraction: jest.fn(),
        selectMapImageMarker: jest.fn(),
        clearImageMarkerSelection: jest.fn(),
    };
});

test("claims cached marker hits without native queries, preserves the grab offset, and never commits a cancelled drag", async () => {
    const queryRenderedFeatures = jest.fn();
    const project = jest.fn();
    const map = {
        map$: new BehaviorSubject({ queryRenderedFeatures, project }),
        dragPan$: new BehaviorSubject(true),
        panResponderOffset: [0, 0],
        onPanResponderShouldStartHandlers$: new BehaviorSubject(new Map()),
        onPanResponderStartHandlers$: new BehaviorSubject(new Map()),
        onPanResponderMoveHandlers$: new BehaviorSubject(new Map()),
        onPanResponderEndHandlers$: new BehaviorSubject(new Map()),
        onPressHandlers$: new BehaviorSubject(new Map()),
    } as unknown as MobileMap;
    const target: MapImageHitTarget = {
        point: [100, 100],
        routePoint: [100, 100],
        feature: {
            type: "Feature",
            geometry: { type: "Point", coordinates: [0, 0] },
            properties: {
                imageId: 1,
                distanceFromStartMeters: 0,
                iconImageId: "image",
                iconImageThumbnailId: "thumbnail",
            },
        },
    };
    const images = new BehaviorSubject<MarkerImage<MobileMarkerImageData>[]>([
        { id: 1, name: "photo.jpg", progress: 100, distanceFraction: 0.1 },
    ]);
    const geojson: GeoJson = { type: "FeatureCollection", features: [] };
    const geometry: RouteGeometryData = {
        spline: {
            type: "Feature",
            geometry: { type: "LineString", coordinates: [] },
            properties: {},
        },
        lookup: [],
        splinePoints: [],
        totalDistanceMeters: 1,
    };
    const touch = (x: number, y: number) =>
        ({
            nativeEvent: {
                locationX: x,
                locationY: y,
                pageX: x,
                pageY: y,
                touches: [{}],
            },
        }) as unknown as GestureResponderEvent;
    const { unmount } = await renderHook(() =>
        useMapImageInteraction(map, images, geojson, geometry, true, {
            current: [target],
        }),
    );
    const id = "route-story-thumbnails-layer";
    const start = async () => {
        expect(map.onPanResponderShouldStartHandlers$.value.get(id)?.(touch(100, 65))).toBe(true);
        await act(() => map.onPanResponderStartHandlers$.value.get(id)?.(touch(100, 65)));
    };
    expect(map.onPanResponderShouldStartHandlers$.value.get(id)?.(touch(500, 500))).toBe(false);
    await start();
    expect(map.dragPan$.value).toBe(false);
    expect(map.panResponderOffset).toEqual([0, 35]);
    expect(draggingImage$.value?.id).toBe(1);
    expect(queryRenderedFeatures).not.toHaveBeenCalled();
    expect(project).not.toHaveBeenCalled();
    await act(() => map.onPanResponderEndHandlers$.value.get(id)?.([1, 1], touch(110, 65), false));
    expect(updateImageDistanceFraction).toHaveBeenCalledWith(images, 1, 0.5);
    expect(map.dragPan$.value).toBe(true);
    jest.mocked(updateImageDistanceFraction).mockClear();
    await start();
    await act(() => map.onPanResponderEndHandlers$.value.get(id)?.([1, 1], touch(110, 65), true));
    expect(updateImageDistanceFraction).not.toHaveBeenCalled();
    expect(map.dragPan$.value).toBe(true);
    target.feature.properties.markerCount = 2;
    await start();
    expect(map.dragPan$.value).toBe(false);
    await unmount();
    expect(map.dragPan$.value).toBe(true);
    expect(map.onPanResponderShouldStartHandlers$.value.size).toBe(0);
});
