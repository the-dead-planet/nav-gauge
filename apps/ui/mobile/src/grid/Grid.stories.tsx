import { FC } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Grid } from "./Grid";
import { FlexBox } from "../flex-box/FlexBox";
import { Text } from "../typography";
import { useTheme } from "@ui";

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
        height: 80,
    },
});

export const All: FC = () => {
    const theme = useTheme();
    const borderColor = theme.componentColor('text');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <FlexBox direction="column" gap="xl">
                <View style={styles.section}>
                    <Text style={styles.label}>cols equal</Text>
                    <Grid cols="equal-2" gap="sm">
                        <View style={[styles.item, { borderColor }]}><Text>1</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>2</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>3</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>4</Text></View>
                    </Grid>
                </View>

                <Grid cols="equal-3" gap="xs">
                    <View style={[styles.item, { borderColor }]}><Text>1</Text></View>
                    <View style={[styles.item, { borderColor }]}><Text>2</Text></View>
                    <View style={[styles.item, { borderColor }]}><Text>3</Text></View>
                </Grid>

                <View style={styles.section}>
                    <Text style={styles.label}>cols max-content</Text>
                    <Grid cols="max-content-3" gap="sm">
                        <View style={[styles.item, { borderColor }]}><Text>short</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>much longer text</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>mid</Text></View>
                    </Grid>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>justifyContent</Text>
                    <Grid cols="equal-2" gap="xs" justifyContent="center">
                        <View style={[styles.item, { borderColor }]}><Text>1</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>2</Text></View>
                    </Grid>
                    <Grid cols="equal-2" gap="xs" justifyContent="space-between">
                        <View style={[styles.item, { borderColor }]}><Text>1</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>2</Text></View>
                    </Grid>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>alignItems</Text>
                    <View style={styles.tallBox}>
                        <Grid cols="equal-3" gap="xs" alignItems="center">
                            <View style={[styles.item, { borderColor }]}><Text>A</Text></View>
                            <View style={[styles.item, { borderColor, paddingVertical: 12 }]}><Text>B</Text></View>
                            <View style={[styles.item, { borderColor, paddingVertical: 24 }]}><Text>C</Text></View>
                        </Grid>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>gap</Text>
                    <Grid cols="equal-2" gap="md">
                        <View style={[styles.item, { borderColor }]}><Text>gap md</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>gap md</Text></View>
                    </Grid>
                    <Grid cols="equal-2" colGap="lg" rowGap="sm">
                        <View style={[styles.item, { borderColor }]}><Text>col lg row sm</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>col lg row sm</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>col lg row sm</Text></View>
                        <View style={[styles.item, { borderColor }]}><Text>col lg row sm</Text></View>
                    </Grid>
                </View>
            </FlexBox>
        </ScrollView>
    );
};
