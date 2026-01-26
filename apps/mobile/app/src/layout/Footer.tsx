import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@ui";
import { Text } from '@mobile-ui';
import { MachineWardFooterProps, useStateWarden, useSubjectState } from "@apparatus";

const styles = StyleSheet.create({
    container: {
        height: 20,
        boxSizing: 'content-box',
        paddingHorizontal: 20,
        paddingVertical: 4,
        borderTopWidth: 1,
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

export const Footer: FC<MachineWardFooterProps> = ({ }) => {
    const theme = useTheme();
    const stateWarden = useStateWarden();
    const [attrributions] = useSubjectState(stateWarden.attributionVault.attributions$);

    return (
        <View style={[styles.container, {
            borderColor: theme.colors.border
        }]}>
            {[...attrributions.entries()].map(([id, { text, href }]) => (
                <Text key={id}>
                    © {text}
                </Text>
            ))}
        </View>
    );
};
