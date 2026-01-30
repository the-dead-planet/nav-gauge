import { validateBoolean, validateNumber, validateString, validateStringEnum } from "@tinker-chest";
import { GaugeControlsType, MapLayout } from "../model";

export const validateMapLayout = (mapLayout: Partial<MapLayout>) => {
    validateString(mapLayout.borderColor, 'Border color');
    validateString(mapLayout.borderRadius, 'Border radius');
    validateNumber(mapLayout.borderWidth, 'Border width');
    validateString(mapLayout.boxShadow, 'Box shadow');
    validateStringEnum(mapLayout.size?.type, 'Size type', ['full-screen', 'manual']);
    validateNumber(mapLayout.size?.height, 'Height');
    validateNumber(mapLayout.size?.width, 'Width');
    validateString(mapLayout.innerBorderColor, 'Inner border color');
    validateNumber(mapLayout.innerBorderWidth, 'Inner border width');
    validateString(mapLayout.innerBoxShadow, 'Inner box shadow');
};

export const validateGaugeControls = (gaugeControls: Partial<GaugeControlsType>) => {
    if (gaugeControls.controlPlacement && typeof gaugeControls.controlPlacement !== 'object') {
        throw new Error('Control placement incorrect');
    }
    if (gaugeControls.controlPlacement && !(
        'left' in gaugeControls.controlPlacement ||
        'top' in gaugeControls.controlPlacement ||
        'right' in gaugeControls.controlPlacement ||
        'bottom' in gaugeControls.controlPlacement
    )) {
        throw new Error('Control placement missing required keys: top, left, right, bottom');
    }
    validateNumber(gaugeControls.controlPlacement?.left, 'Control placement left');
    validateNumber(gaugeControls.controlPlacement?.top, 'Control placement top');
    validateNumber(gaugeControls.controlPlacement?.right, 'Control placement right');
    validateNumber(gaugeControls.controlPlacement?.bottom, 'Control placement bottom');
    validateStringEnum(gaugeControls.controlPosition, 'Control position', ["top-left", "top-right", "bottom-left", "bottom-right"]);
    validateBoolean(gaugeControls.globeProjection, 'Globe projection');
    validateBoolean(gaugeControls.showCompass, 'Show compass');
    validateBoolean(gaugeControls.showZoomButtons, 'Show zoom buttons');
    validateBoolean(gaugeControls.showCurrentZoom, 'Show current zoom');
    validateBoolean(gaugeControls.showGreenScreen, 'Show green screen');
    validateBoolean(gaugeControls.showRouteLine, 'Show route line');
    validateBoolean(gaugeControls.showRoutePoints, 'Show route points');
};
