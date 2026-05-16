import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@ui";
import { LinkText } from '@mobile-ui';
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";

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

export const Footer: FC = ({ }) => {
    const theme = useTheme();
    const { attributionVault } = useMachineWard();
    const [attrributions] = useSubjectState(attributionVault.attributions$);

    return (
        <View style={[styles.container, {
            borderColor: theme.componentColor('border')
        }]}>
            {[...attrributions.entries()].map(([id, { text, href }]) => (
                <LinkText key={id} href={href}>
                    © {text}
                </LinkText>
            ))}
        </View>
    );
};
