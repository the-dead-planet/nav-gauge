import { FC, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Button } from "./Button";
import { Text } from "../typography";
import { ColorVariant, GlowStyle, SurfaceVariant, ButtonCorners, SizeVariant, Icons } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 4,
    },
    cell: {
        flex: 1,
    },
    label: {
        marginBottom: 4,
    },
});

const allSizes: SizeVariant[] = ['md', 'sm', 'xs'];
const allColors: ColorVariant[] = ['neutral', 'primary', 'secondary', 'tertiary'];
const allVariants: SurfaceVariant[] = ['ghost', 'fill', 'fill-inverse', 'fill-translucent', 'outline', 'inset'];
const allCorners: ButtonCorners[] = ['square', 'rounded', 'circle', 'hexagon'];

const allGlowStyles: GlowStyle[] = ['none', 'glow', 'animate-borders-glow'];

export const AllVariants: FC = () => {
    const [highlightColor, setHighlightColor] = useState<ColorVariant | undefined>(undefined);
    const [glowStyle, setGlowStyle] = useState<GlowStyle>('none');
    const [disabled, setDisabled] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
                <View style={styles.row}>
                    <Button
                        variant={disabled ? 'fill' : 'ghost'}
                        color="primary"
                        size="xs"
                        corners="rounded"
                        active={disabled}
                        onPress={() => setDisabled((d) => !d)}
                    >
                        disabled: {String(disabled)}
                    </Button>
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>highlightColor: {highlightColor ?? 'default'}</Text>
                <View style={styles.row}>
                    {[undefined, ...allColors].map((c) => (
                        <Button
                            key={c ?? 'default'}
                            icon={Icons.Beaker}
                            variant="ghost"
                            color={c}
                            size="xs"
                            corners="rounded"
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
                <Text style={styles.label}>glowStyle: {glowStyle}</Text>
                <View style={styles.row}>
                    {allGlowStyles.map((g) => (
                        <Button
                            key={g}
                            variant={glowStyle === g ? 'fill' : 'ghost'}
                            color="primary"
                            size="xs"
                            corners="rounded"
                            active={glowStyle === g}
                            disabled={disabled}
                            onPress={() => setGlowStyle(g)}
                        >
                            {g}
                        </Button>
                    ))}
                </View>
            </View>

            {allSizes.map((size) => (
                <View key={size} style={styles.section}>
                    <Text style={styles.label}>{size}</Text>
                    {allCorners.map((corners) => (
                        <View key={corners} style={styles.section}>
                            <Text style={styles.label}>{corners}</Text>
                            <View style={styles.row}>
                                {allVariants.map((variant) => (
                                    <View key={variant} style={styles.cell}>
                                        <Text style={styles.label}>{variant}</Text>
                                    </View>
                                ))}
                            </View>
                            {allColors.map((color) => (
                                <View key={color} style={styles.row}>
                                    {allVariants.map((variant, i) => (
                                        <View key={`${size}-${corners}-${color}-${variant}`} style={styles.cell}>
                                            <Button
                                                icon={i % 2 === 0 ? Icons.NounProject.LightBulbCogWheel : Icons.Beaker}
                                                variant={variant}
                                                glowStyle={glowStyle}
                                                color={color}
                                                corners={corners}
                                                size={size}
                                                highlightColor={highlightColor}
                                                disabled={disabled}
                                            >
                                                {corners !== 'hexagon' ? color : null}
                                            </Button>
                                        </View>
                                    ))}
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};
