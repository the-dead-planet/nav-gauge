import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useToolIcons, LEFT_ICONS_WIDTH, RIGHT_ICONS_WIDTH } from "@apparatus";
import { ToolIconRight } from "./tool-icons/ToolIconRight";
import { ToolIconLeft } from "./tool-icons/ToolIconLeft";
import { MobileMap } from "@mobile-ui";

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
        paddingTop: 4,
        paddingLeft: 4,
        rowGap: 4,
        alignContent: 'flex-start',
    },
    right: {
        rowGap: 4,
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        paddingBottom: 4,
        paddingRight: 4,
    },
    cell: {
        width: '50%',
    },
    cellNotStaggeredLeftWithSpacer: {
        transform: [
            { translateY: -23 },
        ],
    },
    cellStaggeredLeftWithSpacer: {
        transform: [
            { translateX: -8 },
            { translateY: 18 - 18 },
        ],
    },
    cellStaggeredLeft: {
        transform: [
            { translateX: -8 },
            { translateY: 18 },
        ],
    },
    cellStaggeredRight: {
        transform: [
            { translateX: 5 },
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
    const { len, hasSpacer, toolIconsByPlacement } = useToolIcons(placement);
    const Component = placement === 'left' ? ToolIconLeft : ToolIconRight;

    if (len === 0) {
        return null;
    }

    return (
        <View
            pointerEvents="box-none"
            style={[
                styles.icons,
                styles[placement], {
                    width: placement === 'left' ? LEFT_ICONS_WIDTH : RIGHT_ICONS_WIDTH,
                }
            ]}
        >
            {hasSpacer ? (
                <View
                    pointerEvents="none"
                    style={{
                        width: "50%",
                        height: placement === 'left' ? 41 : 32,
                    }}
                />
            ) : null}
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
                                !isStaggered
                                    ? (placement === 'left' && hasSpacer ? styles.cellNotStaggeredLeftWithSpacer : null)
                                    : placement === 'right'
                                        ? styles.cellStaggeredRight
                                        : hasSpacer ? styles.cellStaggeredLeftWithSpacer
                                            : styles.cellStaggeredLeft,
                            ]}
                        >
                            <Component map={map} {...toolIcon} />
                        </View>
                    );
                })}
        </View>
    );
};
