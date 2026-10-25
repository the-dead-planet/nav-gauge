import { ElevationDirection, ElevationLevel, ResolvedThemeElevation, Theme, ElevationLayer } from '@ui';
import { ViewStyle } from 'react-native';

/**
 * Translates shared elevation metrics into React Native shadow properties.
 *
 * Levels:
 * - `none`: ordinary content and connectors without surface elevation.
 * - `raised`: persistent top bars, toolbars, and side or bottom panels.
 * - `floating`: transient notices, tool widgets, and tooltips.
 * - `overlay`: popups, menus, dropdowns, and dialogs.
 *
 * @param theme Active theme used to resolve mode-specific elevation metrics.
 * @param level Visual depth independent from z-index.
 * @param direction Direction in which the shadow is cast. Defaults to `down`.
 *
 * @example
 * <View style={resolveElevationStyle(theme, 'floating')} />
 * @example
 * <View style={resolveElevationStyle(theme, 'raised', 'up')} />
 */
export const resolveElevationStyle = (
    theme: Theme,
    level: ElevationLevel,
    direction?: ElevationDirection,
): ViewStyle => {
    const elevation = theme.elevation(level, direction);
    return elevationStyle(elevation);
};

const elevationStyle = (elevation: ResolvedThemeElevation): ViewStyle => {
    return {
        shadowColor: elevation.color,
        shadowOffset: {
            width: elevation.offset.x,
            height: elevation.offset.y,
        },
        shadowOpacity: elevation.opacity,
        shadowRadius: elevation.blur / 2,
        elevation: elevation.depth,
    };
};

/**
 * Resolves a global layer's z-index and assigned elevation into one React Native style.
 * Use this for globally stacked surfaces so their z-index and shadow cannot diverge.
 *
 * @example
 * <View style={resolveLayerStyle(theme, 'popup')} />
 */
export const resolveLayerStyle = (
    theme: Theme,
    layer: ElevationLayer,
    direction?: ElevationDirection,
): ViewStyle => {
    const resolved = theme.layer(layer, direction);
    return {
        zIndex: resolved.zIndex,
        ...elevationStyle(resolved.elevation),
    };
};

export const resolveElevationFilter = (
    theme: Theme,
    level: ElevationLevel,
    direction?: ElevationDirection,
): string => {
    const elevation = theme.elevation(level, direction);
    return `${elevation.offset.x}px ${elevation.offset.y}px ${elevation.blur}px rgba(0, 0, 0, ${elevation.opacity})`;
};
