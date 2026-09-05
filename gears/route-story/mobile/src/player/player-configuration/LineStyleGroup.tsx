import { FC } from "react";
import { RouteStoryLineStyle } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Checkbox, Dropdown, Fieldset, NumberInput } from "@mobile-ui";
import { ColorSelectField } from "./ColorSelectField";
import { View, Text, StyleSheet } from "react-native";

interface Props {
    label: string;
    style: RouteStoryLineStyle;
    linesLabel: string;
    pointsLabel: string;
    solidLabel: string;
    dashedLabel: string;
    lineStyleLabel: string;
    lineLabel: string;
    outlineLabel: string;
    onChange: (patch: Partial<RouteStoryLineStyle>) => void;
}

export const LineStyleGroup: FC<Props> = ({
    label,
    style,
    linesLabel,
    pointsLabel,
    lineStyleLabel,
    lineLabel,
    outlineLabel,
    solidLabel,
    dashedLabel,
    onChange
}) => {
    const variantOptions = [
        { label: solidLabel, value: 'solid' as const },
        { label: dashedLabel, value: 'dashed' as const },
    ];

    return (
        <Fieldset size="xs" label={label}>
            <View style={styles['top-controls']}>
                <Checkbox size="xs" checked={style.showRouteLine} onChange={(checked) => onChange({ showRouteLine: checked })}>
                    {linesLabel}
                </Checkbox>
                <Checkbox size="xs" checked={style.showRoutePoints} onChange={(checked) => onChange({ showRoutePoints: checked })}>
                    {pointsLabel}
                </Checkbox>
            </View>
            <Text style={styles['variant-label']}>{lineStyleLabel}</Text>
            <Dropdown size="xs" value={style.variant} options={variantOptions} onChange={(variant) => onChange({ variant })} />
            <Text style={styles['section-label']}>{lineLabel}</Text>
            <View style={styles['grid']}>
                <ColorSelectField value={style.color} onChange={(color) => onChange({ color })} />
                <NumberInput size="xs" min={1} max={8} step={1} value={style.width} onChange={(width) => onChange({ width })} unit="px" />
            </View>
            <Text style={styles['section-label']}>{outlineLabel}</Text>
            <View style={styles['grid']}>
                <ColorSelectField value={style.outlineColor} onChange={(outlineColor) => onChange({ outlineColor })} />
                <NumberInput size="xs" min={0} max={4} step={1} value={style.outlineWidth} onChange={(outlineWidth) => onChange({ outlineWidth })} unit="px" />
            </View>
        </Fieldset>
    );
};

const styles = StyleSheet.create({
    'top-controls': {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 8,
    },
    'variant-label': {
        fontSize: 11,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
    },
    'section-label': {
        fontSize: 11,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    grid: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
});
