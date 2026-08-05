import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useMachineWard } from "@apparatus";
import { useObservableState } from "@tinker-chest";
import { ToolIconRight } from "./tool-icons/ToolIconRight";
import { ToolIconLeft } from "./tool-icons/ToolIconLeft";
import { MobileMap } from "@mobile-ui";
import { LEFT_ICONS_WIDTH, RIGHT_ICONS_WIDTH } from "../tool-panels/tool-panel-size";

const styles = StyleSheet.create({
    icons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        zIndex: 60,
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        borderColor: 'green',
        borderWidth: 1,
    },
    left: {
        paddingLeft: 4,
        rowGap: 4,
        alignContent: 'flex-start',
    },
    right: {
        rowGap: 4,
        alignContent: 'flex-end',
    },
    cell: {
        width: '50%',
    },
    cellStaggeredLeft: {
        transform: [
            { translateX: -8 },
            { translateY: 23 },
        ],
    },
    cellStaggeredRight: {
        transform: [
            { translateX: 6 },
            { translateY: -18 },
        ],
    },
});

interface Props {
    map?: MobileMap;
    placement: 'right' | 'left';
}

export const ToolIcons: FC<Props> = ({
    map,
    placement,
}) => {
    const { toolsStation } = useMachineWard();
    const toolIcons = useObservableState(toolsStation.toolIconsByPlacement$, []);
    const toolIconsByPlacement = toolsStation.getToolIconsByPlacement(toolIcons);
    const len = toolIconsByPlacement[placement].length;
    const Component = placement === 'left' ? ToolIconLeft : ToolIconRight;
    const hasSpacer = (placement === 'right' && len === 1) || (placement === 'left' && len > 1);

    if (len === 0) {
        return null;
    }

    return (
        <View pointerEvents="box-none" style={[
            styles.icons,
            styles[placement], {
                width: placement === 'left' ? LEFT_ICONS_WIDTH : RIGHT_ICONS_WIDTH,
            }
        ]}>
            {hasSpacer ? <View pointerEvents="none" style={{
                width: "50%",
                height: placement === 'left' ? 41 : 32,
                borderColor: 'red',
                borderWidth: 1,
            }} /> : null}
            {!map
                ? null
                : toolIconsByPlacement[placement].map((toolIcon, index) => {
                    const i = index + 1 + (hasSpacer ? 1 : 0);
                    const isStaggered = placement === 'left'
                        ? i % 2 === 0
                        : i % 2 === 1;

                    return (
                        <View
                            key={toolIcon.id}
                            style={[
                                styles.cell,
                                {
                                    marginTop: placement === 'right' ? 0 : hasSpacer ? -18 : 6
                                },
                                isStaggered ? (placement === 'left' ? styles.cellStaggeredLeft : styles.cellStaggeredRight) : null,
                            ]}
                        >
                            <Component map={map} {...toolIcon} />
                        </View>
                    );
                })}
        </View>
    );
};
