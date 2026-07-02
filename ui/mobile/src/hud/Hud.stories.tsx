import { FC, useState } from "react";
import { ScrollView, View, StyleSheet, Switch } from "react-native";
import { Hexagon } from "./hexagon";
import { FlexBox } from "../flex-box";
import { Text } from "../typography";
import { ColorVariant, GlowStyle, SizeVariant, SurfaceFillVariant, useTheme, Icons } from "@ui";
import { Button } from "../button";
import { Panel } from "./panel";
import { BevelPanel } from "./bevel-panel";

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
    },
    label: {
        marginBottom: 8,
        fontWeight: "700",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    cell: {
        width: 80,
    },
});

const allSizes: (SizeVariant | undefined)[] = [undefined, "md", "sm", "xs"];
const allColors: ColorVariant[] = ["neutral", "primary", "secondary", "tertiary"];
const allFillVariants: SurfaceFillVariant[] = ["fill", "fill-inverse", "fill-translucent"];
const allGlowStyles: (GlowStyle | undefined)[] = [undefined, "glow", "animate-borders-glow"];

export const Hexagons: FC = () => {
    const theme = useTheme();
    const [highlightColor, setHighlightColor] = useState<ColorVariant | undefined>(undefined);
    const [glowStyle, setGlowStyle] = useState<GlowStyle>();
    const [interactive, setInteractive] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>Active highlightColor:</Text>
                <View style={styles.row}>
                    {[undefined, ...allColors].map((c) => (
                        <Button
                            key={c ?? "default"}
                            icon={Icons.Beaker}
                            variant={highlightColor === c ? "fill" : "ghost"}
                            color={c}
                            size="xs"
                            corners="circle"
                            active={highlightColor === c}
                            onPress={() => setHighlightColor(c)}
                        >
                            {c ?? "default"}
                        </Button>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.row}>
                    <Switch value={interactive} onValueChange={setInteractive} />
                    <Text>Interactive</Text>
                </View>
            </View>

            {interactive ? (
                <View style={styles.section}>
                    <View style={styles.row}>
                        {allGlowStyles.map((gs) => (
                            <Button
                                key={gs ?? "default"}
                                variant={glowStyle === gs ? "fill" : "ghost"}
                                size="xs"
                                corners="circle"
                                active={glowStyle === gs}
                                onPress={() => setGlowStyle(gs)}
                            >
                                {gs ?? "none"}
                            </Button>
                        ))}
                    </View>
                </View>
            ) : null}

            <FlexBox direction="column" gap="xl">
                <Text style={styles.label}>All variants</Text>
                {allSizes.map((size) => (
                    <View key={size?.toString() ?? "auto"} style={styles.section}>
                        <Text style={styles.label}>{size ?? "Auto size"}</Text>
                        {allColors.map((color) => (
                            <View key={color} style={styles.row}>
                                {(["ghost", ...allFillVariants, "outline", "inset"] as const).map((variant) => (
                                    <View key={variant} style={styles.cell}>
                                        <Hexagon
                                            variant={variant}
                                            color={color}
                                            highlightColor={highlightColor}
                                            size={size}
                                            glowStyle={glowStyle}
                                            interactive={interactive}
                                        >
                                            <Text style={{
                                                color: theme.isDark ? "white" : "black",
                                                fontSize: { xs: 10, sm: 12, md: 14 }[size ?? "md"],
                                            }}>
                                                {color}
                                            </Text>
                                        </Hexagon>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                ))}

                <View style={styles.section}>
                    <Text style={styles.label}>Hover: Glow (default)</Text>
                    <View style={styles.row}>
                        <Hexagon shape="pointy-top" interactive color="primary" style={{ width: 100 }}>
                            <Text>1</Text>
                        </Hexagon>
                        <Hexagon shape="flat-top" interactive glowStyle="glow" color="secondary" style={{ width: 100 }}>
                            <Text>2</Text>
                        </Hexagon>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Hover: Borders glow</Text>
                    <View style={styles.row}>
                        <Hexagon shape="pointy-top" interactive glowStyle="animate-borders-glow" color="primary" style={{ width: 100 }}>
                            <Text>1</Text>
                        </Hexagon>
                        <Hexagon shape="flat-top" interactive glowStyle="animate-borders-glow" color="secondary" style={{ width: 100 }}>
                            <Text>2</Text>
                        </Hexagon>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>sizes</Text>
                    <View style={styles.row}>
                        <Hexagon shape="pointy-top" interactive color="tertiary" size="xs" />
                        <Hexagon shape="pointy-top" interactive color="tertiary" size="sm" />
                        <Hexagon shape="pointy-top" interactive color="tertiary" size="md" />
                    </View>
                    <View style={styles.row}>
                        <Hexagon shape="flat-top" interactive color="tertiary" size="xs" />
                        <Hexagon shape="flat-top" interactive color="tertiary" size="sm" />
                        <Hexagon shape="flat-top" interactive color="tertiary" size="md" />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>stroke width</Text>
                    <View style={styles.row}>
                        <Hexagon interactive strokeWidth={1} color="primary" style={{ width: 100 }} />
                        <Hexagon interactive strokeWidth={3} color="primary" style={{ width: 100 }} />
                        <Hexagon interactive strokeWidth={5} color="primary" style={{ width: 100 }} />
                    </View>
                </View>
            </FlexBox>
        </ScrollView>
    );
};

export const Panels: FC = () => {
    const theme = useTheme();
    const [highlightColor, setHighlightColor] = useState<ColorVariant | undefined>(undefined);
    const [glowStyle, setGlowStyle] = useState<GlowStyle>();
    const [interactive, setInteractive] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>Active highlightColor:</Text>
                <View style={styles.row}>
                    {[undefined, ...allColors].map((c) => (
                        <Button
                            key={c ?? "default"}
                            icon={Icons.Beaker}
                            variant={highlightColor === c ? "fill" : "ghost"}
                            color={c}
                            size="xs"
                            corners="circle"
                            active={highlightColor === c}
                            onPress={() => setHighlightColor(c)}
                        >
                            {c ?? "default"}
                        </Button>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.row}>
                    <Switch value={interactive} onValueChange={setInteractive} />
                    <Text>Interactive</Text>
                </View>
            </View>

            {interactive ? (
                <View style={styles.section}>
                    <View style={styles.row}>
                        {allGlowStyles.map((gs) => (
                            <Button
                                key={gs ?? "default"}
                                variant={glowStyle === gs ? "fill" : "ghost"}
                                size="xs"
                                corners="circle"
                                active={glowStyle === gs}
                                onPress={() => setGlowStyle(gs)}
                            >
                                {gs ?? "none"}
                            </Button>
                        ))}
                    </View>
                </View>
            ) : null}

            <FlexBox direction="column" gap="xl">
                <Text style={styles.label}>All variants</Text>

                {allFillVariants.map((variant) => (
                    <View key={variant} style={styles.section}>
                        <Text style={styles.label}>{variant}</Text>
                        <View style={styles.row}>
                            {allColors.map((color) => (
                                <Panel
                                    key={color}
                                    color={color}
                                    highlightColor={highlightColor}
                                    variant={variant}
                                    glowStyle={glowStyle}
                                    interactive={interactive}
                                    padding="md"
                                >
                                    <Text style={{
                                        color: theme.isDark ? "white" : "black",
                                    }}>
                                        {color}
                                    </Text>
                                </Panel>
                            ))}
                        </View>
                    </View>
                ))}
            </FlexBox>
        </ScrollView>
    );
};

export const BevelPanels: FC = () => {
    const theme = useTheme();
    const [highlightColor, setHighlightColor] = useState<ColorVariant | undefined>(undefined);
    const [glowStyle, setGlowStyle] = useState<GlowStyle>();
    const [interactive, setInteractive] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.section}>
                <Text style={styles.label}>Active highlightColor:</Text>
                <View style={styles.row}>
                    {[undefined, ...allColors].map((c) => (
                        <Button
                            key={c ?? "default"}
                            icon={Icons.Beaker}
                            variant={highlightColor === c ? "fill" : "ghost"}
                            color={c}
                            size="xs"
                            corners="circle"
                            active={highlightColor === c}
                            onPress={() => setHighlightColor(c)}
                        >
                            {c ?? "default"}
                        </Button>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.row}>
                    <Switch value={interactive} onValueChange={setInteractive} />
                    <Text>Interactive</Text>
                </View>
            </View>

            {interactive ? (
                <View style={styles.section}>
                    <View style={styles.row}>
                        {allGlowStyles.map((gs) => (
                            <Button
                                key={gs ?? "default"}
                                variant={glowStyle === gs ? "fill" : "ghost"}
                                size="xs"
                                corners="circle"
                                active={glowStyle === gs}
                                onPress={() => setGlowStyle(gs)}
                            >
                                {gs ?? "none"}
                            </Button>
                        ))}
                    </View>
                </View>
            ) : null}

            <FlexBox direction="column" gap="xl">
                <Text style={styles.label}>All variants</Text>

                {allFillVariants.map((variant) => (
                    <View key={variant} style={styles.section}>
                        <Text style={styles.label}>{variant}</Text>
                        <View style={styles.row}>
                            {allColors.map((color) => (
                                <BevelPanel
                                    key={color}
                                    color={color}
                                    highlightColor={highlightColor}
                                    variant={variant}
                                    glowStyle={glowStyle}
                                    interactive={interactive}
                                    padding="md"
                                >
                                    <Text style={{
                                        color: theme.isDark ? "white" : "black",
                                    }}>
                                        {color}
                                    </Text>
                                </BevelPanel>
                            ))}
                        </View>
                    </View>
                ))}
            </FlexBox>
        </ScrollView>
    );
};
