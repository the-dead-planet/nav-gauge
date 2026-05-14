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
    navigate
}) => {
    const theme = useTheme();

    return (
        <View style={[styles.container, {
            borderBottomColor: theme.componentColor('border')
        }]}>
            <Text style={styles.header}>
                {title}
            </Text>
            <Menu>
                <MenuItem label="Stories" onPress={() => { 
                    navigate('Stories');
                }} />
            </Menu>
        </View>
    );
};
