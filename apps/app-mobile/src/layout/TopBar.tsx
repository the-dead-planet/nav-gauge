import { FC } from "react";
import { StyleSheet, View, } from "react-native";
import { Icons, useTheme } from "@ui";
import { Button, Menu, MenuItem, Text } from '@mobile-ui';
import { MachineWardTopBarProps, useMachineWard } from "@apparatus";
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
    button: {
        marginLeft: "auto",
    }
});

export const TopBar: FC<MachineWardTopBarProps<keyof RootStackParamList>> = ({
    title,
    onNavigate,
}) => {
    const theme = useTheme();
    const { individuator } = useMachineWard();
    const items = [
        __DEV__
            ? <MenuItem key="stories" onPress={() => onNavigate('Stories')}>Stories</MenuItem>
            : null,
    ].filter(Boolean);

    return (
        <View style={[styles.container, {
            borderBottomColor: theme.componentColor('border')
        }]}>
            <Text style={styles.header}>
                {title}
            </Text>
            <Button
                icon={Icons.NounProject.LightBulbCogWheel}
                color={theme.mode === 'dark' ? "secondary" : "neutral"}
                size="md"
                variant="inset"
                onPress={individuator.toggleMode}
                style={styles.button}
            />
            {items.length > 0 ? (
                <Menu iconActiveColor="secondary">
                    {items}
                </Menu>
            ) : null}
        </View>
    );
};
