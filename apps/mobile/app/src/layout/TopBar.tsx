import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@ui";
import { Text } from '@mobile-ui';
import { MachineWardTopBarProps } from "@apparatus";

const styles = StyleSheet.create({
    container: {
        height: 50,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    header: {
        fontSize: 20,
        paddingHorizontal: 15
    }
});

export const TopBar: FC<MachineWardTopBarProps> = ({ title }) => {
    const theme = useTheme();

    return (
        <View style={[styles.container, {
            borderBottomColor: theme.colors.border
        }]}>
            <Text style={styles.header}>
                {title}
            </Text>
        </View>
    );
};
