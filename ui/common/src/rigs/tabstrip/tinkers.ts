import { TabstripOption, TabstripProps } from './model';
import { StoryControls } from '../../storybook';
import { DEFAULT_COLOR, DEFAULT_SIZE, fillVariantOptions } from '../../design-system';
import { menuItemStoryControls } from '../menu/tinkers';

export const tabstripStoryOptions: TabstripOption[] = [
    { value: 'route', label: 'Route' },
    { value: 'waypoints', label: 'Waypoints' },
    { value: 'terrain', label: 'Terrain' },
    { value: 'weather', label: 'Weather', disabled: true },
    { value: 'telemetry', label: 'Telemetry' },
    { value: 'export', label: 'Export' },
];
export const tabstripStoryArgs: Omit<TabstripProps, 'onChange'> = {
    options: tabstripStoryOptions,
    value: 'route',
    overflowAccessibilityLabel: 'More tabs',
    children: 'Configure the selected layer.',
    variant: 'fill-inverse',
    color: DEFAULT_COLOR,
    size: DEFAULT_SIZE,
    spread: false,
    highlighted: false,
    disabled: false,
    actions: {
        primary: {
            label: 'Close',
            onPress: () => undefined,
        },
        secondary: {
            label: 'Reset to defaults',
            onPress: () => undefined,
        },
    },
};
export const tabstripStoryControls: StoryControls<TabstripProps> = {
    children: { control: 'text' },
    variant: { control: 'select', options: fillVariantOptions },
    color: menuItemStoryControls.color,
    size: menuItemStoryControls.size,
    highlightColor: menuItemStoryControls.highlightColor,
    glyphsShade: menuItemStoryControls.glyphsShade,
    highlightGlyphsShade: menuItemStoryControls.highlightGlyphsShade,
    highlighted: { control: 'boolean' },
    disabled: { control: 'boolean' },
    spread: { control: 'boolean' },
};

export const getVisibleTabCount = (tabWidths: readonly number[], containerWidth: number, overflowWidth: number): number => {
    if (tabWidths.reduce((total, width) => total + width, 0) <= containerWidth) return tabWidths.length;

    let usedWidth = overflowWidth;
    return tabWidths.findIndex((width) => {
        usedWidth += width;
        return usedWidth > containerWidth;
    });
};

export const getVisibleTabIndexes = (
    tabWidths: readonly number[],
    containerWidth: number,
    overflowWidth: number,
    selectedIndex: number,
): number[] => {
    const visibleCount = getVisibleTabCount(tabWidths, containerWidth, overflowWidth);
    if (visibleCount === tabWidths.length || selectedIndex < visibleCount || selectedIndex < 0) {
        return Array.from({ length: visibleCount }, (_, index) => index);
    }

    let usedWidth = overflowWidth + tabWidths[selectedIndex];
    if (usedWidth > containerWidth) return [];

    const indexes = [selectedIndex];
    tabWidths.forEach((width, index) => {
        if (index !== selectedIndex && usedWidth + width <= containerWidth) {
            indexes.push(index);
            usedWidth += width;
        }
    });
    return indexes;
};
