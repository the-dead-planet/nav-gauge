import { ComponentType, FC, RefAttributes, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { GeoJSONSource, Images } from "@maplibre/maplibre-react-native";
import Svg, { SvgProps } from "react-native-svg";
import { CurrentPointIconName, getCurrentPointImageName, getCurrentPointLayers, RouteStoryState, routeSourceIds } from "@the-dead-planet/nav-gauge-gears-route-story-common";
import { Icons } from "@ui";
import { renderLayerSpec } from "./render-layer-spec";

const ICON_SIZE = 20;
const RASTER_SIZE = 128;

const styles = StyleSheet.create({
    rasterizer: {
        height: RASTER_SIZE,
        left: -RASTER_SIZE,
        position: 'absolute',
        width: RASTER_SIZE,
    },
});

interface Props {
    source: GeoJSON.GeoJSON;
    state: RouteStoryState;
}

export const RouteCurrentPointLayer: FC<Props> = ({ source, state }) => {
    const [svg, setSvg] = useState<Svg | null>(null);
    const [rasterizedImage, setRasterizedImage] = useState<{ icon: CurrentPointIconName; source: string } | null>(null);
    const selectedIcon = state.currentPoint.icon;
    const Icon = (state.currentPoint.icon === 'Circle'
        ? Icons.Circle
        : Icons.NounProject[state.currentPoint.icon]) as ComponentType<SvgProps & RefAttributes<Svg>>;

    useEffect(() => {
        if (!svg) {
            return;
        }
        let isCurrent = true;
        const icon = selectedIcon;
        svg.toDataURL((base64) => {
            if (isCurrent) {
                setRasterizedImage({ icon, source: `data:image/png;base64,${base64}` });
            }
        }, {
            height: RASTER_SIZE,
            width: RASTER_SIZE,
        });

        return () => {
            isCurrent = false;
        };
    }, [svg]);

    const imageSource = rasterizedImage?.icon === selectedIcon ? rasterizedImage.source : null;

    return (
        <>
            <View pointerEvents="none" style={styles.rasterizer}>
                <Icon ref={setSvg} width={RASTER_SIZE} height={RASTER_SIZE} fill="black" />
            </View>
            {imageSource ? <Images images={{
                [getCurrentPointImageName(state.currentPoint.icon)]: {
                    source: { uri: imageSource, scale: RASTER_SIZE / ICON_SIZE },
                    sdf: true,
                },
            }} /> : null}
            <GeoJSONSource id={routeSourceIds.currentPoint} data={source}>
                {getCurrentPointLayers(state).map(renderLayerSpec)}
            </GeoJSONSource>
        </>
    );
};
