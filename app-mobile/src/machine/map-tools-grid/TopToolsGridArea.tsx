import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { MobileMap } from "@mobile-ui";

interface Props {
    map?: MobileMap;
}

export const TopToolsGridArea: FC<Props> = ({
    map,
}) => {
    const { toolsStation } = useMachineWard();
    const [topTools] = useSubjectState(toolsStation.topTools$);

    if (!map || topTools.size === 0) {
        return null;
    }

    return (
        <View style={styles.topTools}>
            {Array.from(topTools).map(([id, Component]) => (
                <Component key={id} map={map} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    topTools: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
