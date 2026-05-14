import { FC } from "react";
import { StyleSheet, View, } from "react-native";
import { useTheme } from "@ui";
import { Menu, MenuItem, Text } from '@mobile-ui';
import { MachineWardTopBarProps } from "@apparatus";
import { RootStackParamList } from "../navigation";

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
    },
});

export const TopBar: FC<MachineWardTopBarProps<keyof RootStackParamList>> = ({
    title,
    onNavigate,
}) => {
    const theme = useTheme();
    const items = [__DEV__ ? <MenuItem key="stories" label="Stories" onPress={() => onNavigate('Stories')} /> : null].filter(Boolean);

    return (
        <View style={[styles.container, {
            borderBottomColor: theme.componentColor('border')
        }]}>
            <Text style={styles.header}>
                {title}
            </Text>
            {items.length > 0 ? (
                <Menu>
                    {items}
                </Menu>
            ) : null}
        </View>
    );
};
