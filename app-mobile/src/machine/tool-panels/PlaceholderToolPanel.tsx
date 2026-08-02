import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ToolPanelPlacement } from "@apparatus";

interface Props {
    placement: ToolPanelPlacement | "bottom-secondary";
}

export const PlaceholderToolPanel: FC<Props> = ({
    placement
}) => {
    const styleMap: Record<string, object> = {
        'left': styles.leftPlaceholder,
        'right': styles.rightPlaceholder,
        'bottom': styles.bottomPlaceholder,
        'bottom-secondary': styles.bottomSecondaryPlaceholder,
    };

    return (
        <View style={styleMap[placement] || styles.placeholder} />
    );
};

const styles = StyleSheet.create({
    placeholder: {
        width: 0,
        height: 0,
    },
    leftPlaceholder: {
        width: 0,
    },
    rightPlaceholder: {
        width: 0,
    },
    bottomPlaceholder: {
        height: 0,
    },
    bottomSecondaryPlaceholder: {
        height: 0,
    },
});
