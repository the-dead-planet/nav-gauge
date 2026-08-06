import { RefObject } from "react";
import { ToolsStation } from "../../tools-station";

export const MIN_REMAINING_MAIN_AREA = {
    width: 200,
    height: 100,
};

let zoomEndHandlerTimeout: number;

export const compassToolIconId = 'cartomancer-compass';
export const zoomInIconId = 'cartomancer-zoom-in';
export const currentZoomIconId = 'cartomancer-current-zoom';
export const zoomOutIconId = 'cartomancer-zoom-out';
export const mapLayoutControlsId = 'map-layout-controls';

export const updateCompassIcon = <TMap>(
    toolsStation: ToolsStation<TMap>,
    { bearing, pitch }: { bearing: number; pitch: number },
) => {
    const compassToolIcon = toolsStation.toolIcons$.value.get(compassToolIconId);
    compassToolIcon?.rotate$.next(Math.round(bearing));
    compassToolIcon?.pitch$.next(Math.round(pitch));
};

export const updateCurrentZoomIcon = <TMap>(
    toolsStation: ToolsStation<TMap>,
    clickedZoom: RefObject<number | null>,
    getZoom: (() => Promise<number>) | undefined,
) => {
    clearTimeout(zoomEndHandlerTimeout);
    zoomEndHandlerTimeout = setTimeout(() => {
        getZoom?.()
            .then((mapZoom) => {
                clickedZoom.current = mapZoom;
            });
    }, 200);
    getZoom?.()
        .then((mapZoom) => {
            toolsStation.toolIcons$.value.get(currentZoomIconId)?.value$.next(mapZoom.toFixed(1));
        });
};
