import { Theme } from "@ui";
import { ApplicationSettingsType } from "./model";

export const controlsPositions: maplibregl.ControlPosition[] = [
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right"
];

// TODO: Integrate this with statewarden
/**
 * Provides default settings which can be later changed by user.
 * @param defaultTheme Defaults to dark theme.
 * @returns 
 */
export const getDefaultApplicationSettings = (defaultTheme?: Theme): ApplicationSettingsType => ({
    theme: defaultTheme || Theme.Dark,
    /**
     * When set to true, user will be shown a confirmation popup on page close or reload.
     */
    confirmBeforeLeave: false,
})

// TODO
export const defaultZoomInToImages = 15;

export const clamp = (value: number, range: [number, number]) => {
    const [min, max] = range;

    return Math.max(min, Math.min(max, value));
}

