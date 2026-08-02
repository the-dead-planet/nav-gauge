import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useMachineWard } from "@apparatus";
import { useObservableState } from "@tinker-chest";
import { ToolIconRight } from "./tool-icons/ToolIconRight";
import { ToolIconLeft } from "./tool-icons/ToolIconLeft";
import { MobileMap } from "@mobile-ui";

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

    if (!map || len === 0) {
        return null;
    }

    const hasSpacer = (placement === 'right' && len === 1) || (placement === 'left' && len > 1);

    return (
        <View style={[styles.icons, placement === 'right' ? styles.right : styles.left]}>
            {hasSpacer ? <View /> : null}
            {toolIconsByPlacement[placement].map((toolIcon, index) => {
                // nth-child parity in the web CSS counts the spacer as a child
                const childNumber = index + 1 + (hasSpacer ? 1 : 0);
                const isStaggered = placement === 'left'
                    ? childNumber % 2 === 0
                    : childNumber % 2 === 1;

                return (
                    <View
                        key={toolIcon.id}
                        style={[
                            styles.cell,
                            isStaggered ? (placement === 'left' ? styles.cellStaggered : styles.cellStaggeredRight) : null,
                        ]}
                    >
                        <Component
                            map={map}
                            {...toolIcon}
                        />
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    icons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        zIndex: 60,
        overflow: 'hidden',
        width: '100%',
        height: '100%',
    },
    left: {
        rowGap: 6,
        alignContent: 'flex-start',
    },
    right: {
        rowGap: 4,
        alignContent: 'flex-end',
    },
    cell: {
        width: '50%',
        alignItems: 'center',
    },
    cellStaggered: {
        // ponytail: translateY approximates the web calc(50% + 3px)/calc(-50% - 2px) with
        // known hexagon heights (sm 48, xs 36); RN transforms can't use percentages here
        transform: [
            { translateX: -7 },
            { translateY: 27 },
        ],
    },
    cellStaggeredRight: {
        transform: [
            { translateX: 6 },
            { translateY: -20 },
        ],
    },
});
