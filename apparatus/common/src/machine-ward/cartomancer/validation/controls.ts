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
    validateBoolean(gaugeControls.globeProjection, 'Globe projection');
    validateBoolean(gaugeControls.showCompass, 'Show compass');
    validateBoolean(gaugeControls.showZoomButtons, 'Show zoom buttons');
    validateBoolean(gaugeControls.showGreenScreen, 'Show green screen');
};
