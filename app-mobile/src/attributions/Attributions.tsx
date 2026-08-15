import { FC } from "react";
import { AttributionEntry, useMachineWard } from "@apparatus";
import { StyleSheet, View } from "react-native";
import { Text } from "@mobile-ui";
import { useSubjectState } from "@tinker-chest";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 0,
        top: 200,
        borderRadius: 4,
    },
});

export const Attributions: FC = () => {
    const theme = useTheme();
    const { attributionVault } = useMachineWard();
    const [attributions] = useSubjectState(attributionVault.attributions$);
    const entries = ([...Object.values(attributions)] as AttributionEntry[][]).flatMap((el) => el);

    return (
        <View style={[styles.container, {
            backgroundColor: theme.componentColor('background', .6)
        }]}>
            {entries.map(({ text, href }) => (
                // TODO: Link
                <Text key={text}>{text}</Text>
            ))}
        </View>
    );
};
