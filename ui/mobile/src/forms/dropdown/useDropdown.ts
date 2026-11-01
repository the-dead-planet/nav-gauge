import { useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { useMenu } from "../../rigs/menu/useMenu";

export function useDropdown(disabled: boolean) {
    const menu = useMenu({
        disabled,
        triggerAnchor: "bottom-left",
        popupAnchor: "top-left",
    });
    const [width, setWidth] = useState(0);
    const onTriggerLayout = (event: LayoutChangeEvent) =>
        setWidth(event.nativeEvent.layout.width);

    return {
        ...menu,
        onTriggerLayout,
        menuPosition: {
            ...menu.popupPosition,
            width,
        },
    };
}
