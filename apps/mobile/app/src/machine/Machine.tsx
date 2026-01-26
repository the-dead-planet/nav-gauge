import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from '@mobile-ui';
import { MachineWardMachineProps } from "@apparatus";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    }
});

export const Machine: FC<MachineWardMachineProps> = () => {
    return (
        <View style={styles.container}>
            <Text>
                Machine
            </Text>
        </View>
    );
};
