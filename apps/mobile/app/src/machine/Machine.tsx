import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from '@mobile-ui';
import { MachineWardMachineProps, useMachineWard, useSubjectState } from "@apparatus";
import { MapSection } from "./MapSection";

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export const Machine: FC<MachineWardMachineProps> = () => {
    const { individuator } = useMachineWard();
    const [orientation] = useSubjectState(individuator.orientation$);

    return (
        <View style={styles.container}>
            <Text>
                Machineee
            </Text>
            <MapSection />
        </View>
    );
};
