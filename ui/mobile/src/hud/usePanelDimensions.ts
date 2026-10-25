import { useState } from "react";
import { LayoutChangeEvent } from "react-native";

export const usePanelDimensions = () => {
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
        headerHeight: 0,
    });
    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setDimensions((previous) =>
            previous.width === width && previous.height === height
                ? previous
                : { ...previous, width, height },
        );
    };
    const onHeaderLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        setDimensions((previous) =>
            previous.headerHeight === height
                ? previous
                : { ...previous, headerHeight: height },
        );
    };
    return { ...dimensions, onLayout, onHeaderLayout };
};
