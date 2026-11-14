import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { SvgXml } from 'react-native-svg';
import { Images } from '@maplibre/maplibre-react-native';
import { getImageCountBadges, IMAGE_COUNT_BADGE_PIXEL_RATIO, IMAGE_COUNT_BADGE_SIZE } from '@the-dead-planet/nav-gauge-gears-route-story-common';

const styles = StyleSheet.create({
    rasterizer: {
        position: 'absolute',
        left: -IMAGE_COUNT_BADGE_SIZE,
        width: IMAGE_COUNT_BADGE_SIZE,
        height: IMAGE_COUNT_BADGE_SIZE,
    },
});

const useBadgeRasterization = () => {
    const [svg, setSvg] = useState<Svg | null>(null);
    const [source, setSource] = useState<string | null>(null);
    useEffect(() => {
        if (!svg) {
            return;
        }
        let isCurrent = true;
        svg.toDataURL((base64) => {
            if (isCurrent) {
                setSource(`data:image/png;base64,${base64}`);
            }
        }, {
            width: IMAGE_COUNT_BADGE_SIZE,
            height: IMAGE_COUNT_BADGE_SIZE,
        });
        return () => { isCurrent = false; };
    }, [svg]);
    return { source, setSvg };
};

const ImageCountBadge = ({ id, svg }: { id: string; svg: string }) => {
    const { source, setSvg } = useBadgeRasterization();
    return source ? (
        <Images images={{ [id]: { source: { uri: source, scale: IMAGE_COUNT_BADGE_PIXEL_RATIO } } }} />
    ) : (
        <View pointerEvents="none" style={styles.rasterizer}>
            <SvgXml xml={svg} override={{ ref: setSvg }} />
        </View>
    );
};

export const ImageCountBadges = ({ backgroundColor, textColor }: { backgroundColor: string; textColor: string }) =>
    getImageCountBadges(backgroundColor, textColor).map((badge) => <ImageCountBadge key={badge.id} {...badge} />);
