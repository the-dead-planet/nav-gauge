import { ComponentType, FC } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Button } from "../button";
import { Text } from "../typography";
import { TooltipPlacement, Icons, SizeVariant } from "@ui";
import { Tooltip } from "./Tooltip";
import { SvgProps } from "react-native-svg";

const styles = StyleSheet.create({
    container: {
        padding: 48,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
        paddingVertical: 12,
    },
    section: {
        paddingVertical: 12,
    },
    label: {
        marginBottom: 4,
    },
});

const allPlacements: TooltipPlacement[] = ['top', 'bottom', 'left', 'right', 'auto'];
const allSizes: SizeVariant[] = ['xs', 'sm', 'md'];

export const Placements: FC = () => (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Long press a button to show its tooltip.</Text>
        <Text style={styles.label}>Placements</Text>
        <View style={styles.row}>
            {allPlacements.map((placement) => (
                <Button
                    key={placement}
                    tooltip={`${placement} tooltip`}
                    tooltipPlacement={placement}
                    icon={Icons.Beaker as ComponentType<SvgProps>}
                    variant="ghost"
                    color="primary"
                    corners="circle"
                >
                    {placement}
                </Button>
            ))}
        </View>
    </ScrollView>
);

export const Sizes: FC = () => (
    <View style={styles.container}>
        <View style={styles.row}>
            {allSizes.map((size) => (
                <Tooltip key={size} content={`${size} tooltip`} size={size} placement="top">
                    <Button icon={Icons.Beaker as ComponentType<SvgProps>} variant="ghost" color="primary">
                        {size}
                    </Button>
                </Tooltip>
            ))}
        </View>
    </View>
);
