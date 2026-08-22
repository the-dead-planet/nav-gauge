import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-apparatus";

const styles = StyleSheet.create({
    topTools: {
        flexDirection: 'row',
        flex: 1,
        paddingHorizontal: 6
    },
});

interface Props {
    map?: MobileMap;
}

export const TopToolsGridArea: FC<Props> = ({
    map,
}) => {
    const { toolsStation } = useMachineWard();
    const [topTools] = useSubjectState(toolsStation.topTools$);

    return (
        <View pointerEvents="box-none" style={styles.topTools}>
            {map ? Array.from(topTools).map(([id, Component]) => <Component key={id} map={map} />) : null}
        </View>
    );
};
