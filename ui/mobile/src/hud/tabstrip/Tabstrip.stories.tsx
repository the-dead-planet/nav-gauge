import { FC, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TabstripOption, TabstripVariant } from '@ui';
import { Tabstrip } from './Tabstrip';
import { Text } from '../../typography';
import { VariantGallery } from '../../storybook/VariantGallery';

const options: TabstripOption[] = [
    { value: 'route', label: 'Route' },
    { value: 'waypoints', label: 'Waypoints' },
    { value: 'terrain', label: 'Terrain' },
    { value: 'weather', label: 'Weather' },
    { value: 'telemetry', label: 'Telemetry' },
    { value: 'export', label: 'Export' },
];
const content: Record<string, string> = {
    route: 'Configure the route line, direction, and playback behavior.\nAdjust its color, width, points, and outline.\nPreview the result before exporting.',
    waypoints: 'Review waypoint labels and marker visibility.',
    terrain: 'Adjust terrain exaggeration and contour details.',
    weather: 'Inspect wind, cloud, and precipitation overlays.',
    telemetry: 'Monitor speed, elevation, and recording statistics.',
    export: 'Export the finished route story.',
};
const variants: TabstripVariant[] = ['fill-inverse', 'fill-translucent', 'outline'];
const styles = StyleSheet.create({
    constrained: { width: 260 },
});

export const Playground: FC = () => {
    const [value, setValue] = useState('export');
    return (
        <View style={styles.constrained}>
            <Tabstrip options={options} value={value} onChange={setValue} contentShade={700} highlightColor="primary" highlightContentShade={200} overflowAccessibilityLabel="More tabs">
                <Text>{content[value]}</Text>
            </Tabstrip>
        </View>
    );
};

export const Spread: FC = () => {
    const [value, setValue] = useState('route');
    return (
        <View style={{ width: '100%', padding: 16 }}>
            <Tabstrip spread options={[{ value: 'route', label: 'Active' }, { value: 'waypoints', label: 'Current point' }, { value: 'terrain', label: 'Inactive' }]} value={value} onChange={setValue} contentShade={700} highlightColor="primary" highlightContentShade={200} overflowAccessibilityLabel="More tabs">
                <Text>{content[value]}</Text>
            </Tabstrip>
        </View>
    );
};

export const Gallery: FC = () => {
    const [value, setValue] = useState('route');
    return (
        <VariantGallery
            variants={variants}
            render={({ color, size, variant }) => (
                <Tabstrip
                    options={options.slice(0, 3)}
                    value={value}
                    onChange={setValue}
                    variant={variant}
                    color={color}
                    highlightColor={color}
                    size={size}
                    overflowAccessibilityLabel="More tabs"
                >
                    <Text>{content[value]}</Text>
                </Tabstrip>
            )}
        />
    );
};
