import { FC, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button } from "./Button";
import { Text } from '../../design-system/typography';
import { ButtonCorners, ColorVariant, ActiveGlow, Icons, colorOptions, surfaceVariantOptions } from "@ui";
import { VariantGallery } from '../../storybook/VariantGallery';

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 4,
    },
    label: {
        marginBottom: 4,
    },
});

const allCorners: ButtonCorners[] = ['square', 'circle', 'hexagon'];

const allActiveGlows: ActiveGlow[] = ['none', 'glow', 'animate-borders-glow'];

export const Gallery: FC = () => {
    const [highlightColor, setHighlightColor] = useState<ColorVariant | undefined>(undefined);
    const [activeGlow, setActiveGlow] = useState<ActiveGlow>('none');
    const [disabled, setDisabled] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View>
                <View style={styles.row}>
                    <Button
                        variant={disabled ? 'fill' : 'ghost'}
                        color="primary"
                        size="xs"
                        active={disabled}
                        onPress={() => setDisabled((d) => !d)}
                    >
                        {`disabled: ${String(disabled)}`}
                    </Button>
                </View>
            <View style={styles.section}>
                <Text style={styles.label}>highlightColor: {highlightColor ?? 'default'}</Text>
                <View style={styles.row}>
                    {[undefined, ...colorOptions].map((c) => (
                        <Button
                            key={c ?? 'default'}
                            icon={Icons.Beaker}
                            variant="ghost"
                            color={c}
                            size="xs"
                            active={highlightColor === c}
                            disabled={disabled}
                            onPress={() => setHighlightColor(c)}
                        >
                            {c ?? 'default'}
                        </Button>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>activeGlow: {activeGlow}</Text>
                <View style={styles.row}>
                    {allActiveGlows.map((g) => (
                        <Button
                            key={g}
                            variant={activeGlow === g ? 'fill' : 'ghost'}
                            color="primary"
                            size="xs"
                            active={activeGlow === g}
                            disabled={disabled}
                            onPress={() => setActiveGlow(g)}
                        >
                            {g}
                        </Button>
                    ))}
                </View>
            </View>
            </View>
            {allCorners.map((corners) => (
                <View key={corners} style={styles.section}>
                    <Text style={styles.label}>{corners}</Text>
                    <VariantGallery
                        variants={surfaceVariantOptions}
                        scrollEnabled={false}
                        render={({ color, size, variant }) => (
                            <Button
                                icon={Icons.Beaker}
                                variant={variant}
                                activeGlow={activeGlow}
                                color={color}
                                corners={corners}
                                size={size}
                                highlightColor={highlightColor}
                                disabled={disabled}
                                accessibilityLabel={corners === 'square' ? undefined : `${corners} button`}
                            >
                                {corners === 'square' ? color : null}
                            </Button>
                        )}
                    />
                </View>
            ))}
        </ScrollView>
    );
};

export const Playground: FC = () => {
    const [active, setActive] = useState(false);

    return <Button onPress={() => setActive(!active)} active={active}>Button</Button>;
};

export const TooltipPressBehavior: FC = () => {
    const [pressCount, setPressCount] = useState(0);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tap increments. Long press shows the tooltip without incrementing.</Text>
            <Text style={styles.label}>Presses: {pressCount}</Text>
            <View style={styles.row}>
                {(['square', 'hexagon'] as ButtonCorners[]).map((corners) => (
                    <Button
                        key={corners}
                        corners={corners}
                        tooltip="Long-press tooltip"
                        onPress={() => setPressCount((count) => count + 1)}
                    >
                        {corners === 'hexagon' ? null : corners}
                    </Button>
                ))}
            </View>
        </View>
    );
};
