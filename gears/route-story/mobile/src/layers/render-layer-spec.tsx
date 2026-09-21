import { Layer } from "@maplibre/maplibre-react-native";
import { RouteCircleLayerSpec, RouteLineLayerSpec, RouteSymbolLayerSpec } from "@the-dead-planet/nav-gauge-gears-route-story-common";

export const renderLayerSpec = (spec: RouteLineLayerSpec | RouteCircleLayerSpec | RouteSymbolLayerSpec) => {
    if (spec.type === 'line') {
        return (
            <Layer
                key={spec.id}
                type="line"
                id={spec.id}
                filter={spec.filter}
                layout={spec.layout}
                paint={spec.paint}
            />
        );
    }

    if (spec.type === 'symbol') {
        return (
            <Layer
                key={spec.id}
                type="symbol"
                id={spec.id}
                layout={spec.layout}
                paint={spec.paint}
            />
        );
    }

    return (
        <Layer
            key={spec.id}
            type="circle"
            id={spec.id}
            filter={spec.filter}
            layout={spec.layout}
            paint={spec.paint}
        />
    );
};
