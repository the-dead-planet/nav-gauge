import { GaugeControlsType, MapLayout } from "./model";

export const defaultGaugeControls: GaugeControlsType = {
    globeProjection: true,
    showZoomButtons: false,
    showCurrentZoom: true,
    showCompass: true,
    showGreenScreen: false,
    controlPosition: 'top-right',
    controlPlacement: { top: 0, bottom: 0, left: 0, right: 0 },
    showRouteLine: true,
    showRoutePoints: true,
}

export const defaultMapLayout: MapLayout = {
    size: {
        type: 'full-screen',
        width: 400,
        height: 400
    },
    borderWidth: 0,
    borderColor: '#000',
    borderRadius: '0',
    innerBorderWidth: 0,
    innerBorderColor: '#000000',
    boxShadow: '',
    innerBoxShadow: '',
};
