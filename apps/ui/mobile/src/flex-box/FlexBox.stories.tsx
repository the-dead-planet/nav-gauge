import { FC } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { FlexBox } from "./FlexBox";
import { Text } from "../typography";
import { FlexBoxProps, SpacingVariant, useTheme } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
    },
    label: {
        marginBottom: 4,
    },
    item: {
        padding: 8,
        borderWidth: 1,
    },
    tallBox: {
        height: 60,
    },
});

const directions: Array<FlexBoxProps['direction']> = ['row', 'column', 'row-reverse', 'column-reverse'];
const justifyOptions: Array<FlexBoxProps['justifyContent']> = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'];
const alignOptions: Array<FlexBoxProps['alignItems']> = ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'];
const gapSizes: SpacingVariant[] = ['xs', 'sm', 'md', 'lg', 'xl'];

export const All: FC = () => {
    const theme = useTheme();
    const borderColor = theme.componentColor('border');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <FlexBox direction="column" gap="xl">
                <View style={styles.section}>
                    <Text style={styles.label}>direction</Text>
                    {directions.map((direction) => (
                        <FlexBox key={direction} direction="column" gap="sm" style={styles.section}>
                            <Text>{direction}</Text>
                            <FlexBox direction={direction} gap="sm">
                                <View style={[styles.item, { borderColor }]}><Text>1</Text></View>
                                <View style={[styles.item, { borderColor }]}><Text>2</Text></View>
                                <View style={[styles.item, { borderColor }]}><Text>3</Text></View>
                            </FlexBox>
                        </FlexBox>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>justifyContent</Text>
                    {justifyOptions.map((j) => (
                        <FlexBox key={j} direction="column" gap="xs" style={styles.section}>
                            <Text>{j}</Text>
                            <FlexBox justifyContent={j} gap="xs">
                                <View style={[styles.item, { borderColor }]}><Text>A</Text></View>
                                <View style={[styles.item, { borderColor }]}><Text>B</Text></View>
                                <View style={[styles.item, { borderColor }]}><Text>C</Text></View>
                            </FlexBox>
                        </FlexBox>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>alignItems</Text>
                    {alignOptions.map((a) => (
                        <FlexBox key={a} direction="column" gap="xs" style={styles.section}>
                            <Text>{a}</Text>
                            <View style={styles.tallBox}>
                                <FlexBox alignItems={a} gap="xs" style={{ height: '100%' }}>
                                    <View style={[styles.item, { borderColor }]}><Text>S</Text></View>
                                    <View style={[styles.item, { borderColor, paddingVertical: 12 }]}><Text>M</Text></View>
                                    <View style={[styles.item, { borderColor, paddingVertical: 24 }]}><Text>L</Text></View>
                                </FlexBox>
                            </View>
                        </FlexBox>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>gap</Text>
                    <FlexBox direction="column" gap="md">
                        {gapSizes.map((size) => (
                            <FlexBox key={size} gap={size}>
                                <View style={[styles.item, { borderColor }]}><Text>{`gap ${size}`}</Text></View>
                                <View style={[styles.item, { borderColor }]}><Text>{`gap ${size}`}</Text></View>
                            </FlexBox>
                        ))}
                    </FlexBox>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>rowGap / colGap</Text>
                    <FlexBox colGap="lg" rowGap="md">
                        <View style={[styles.item, { borderColor }]}><Text>col lg row md</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>col lg row md</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>col lg row md</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>col lg row md</Text></View>
                    </FlexBox>
                </View>
            </FlexBox>
        </ScrollView>
    );
};
