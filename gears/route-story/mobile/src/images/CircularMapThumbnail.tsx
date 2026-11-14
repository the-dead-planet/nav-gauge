import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Circle, ClipPath, Defs, Image } from 'react-native-svg';
import { Images } from '@maplibre/maplibre-react-native';
import RNFS from 'react-native-fs';
import { MAP_THUMBNAIL_SIZE } from '@the-dead-planet/nav-gauge-gears-route-story-common';
import { glitchmitter } from '@apparatus';
import { determineSize, extractFilePathFromData } from './image-parser';

const styles = StyleSheet.create({
    rasterizer: {
        position: 'absolute',
        left: -MAP_THUMBNAIL_SIZE,
        width: MAP_THUMBNAIL_SIZE,
        height: MAP_THUMBNAIL_SIZE,
    },
});

interface Props {
    imageId: string;
    uri: string;
}

const useCircularMapThumbnail = (uri: string) => {
    const [svg, setSvg] = useState<Svg | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [imageUri, setImageUri] = useState(Platform.OS === 'android' ? null : uri);
    const [source, setSource] = useState<string | null>(null);

    useEffect(() => {
        if (Platform.OS !== 'android') {
            return;
        }
        let isCurrent = true;
        // Android getSize decodes data URIs, but only reads metadata for file URIs.
        void RNFS.readFile(extractFilePathFromData(uri), 'base64').then(async (base64) => {
            const dataUri = `data:image/jpeg;base64,${base64}`;
            await determineSize(dataUri);
            if (isCurrent) {
                setImageUri(dataUri);
                setLoaded(true);
            }
        }).catch((error: unknown) => glitchmitter.transmit('Error loading map thumbnail', error));
        return () => { isCurrent = false; };
    }, [uri]);

    useEffect(() => {
        if (!svg || !loaded) {
            return;
        }
        let isCurrent = true;
        svg.toDataURL((base64) => {
            if (isCurrent) {
                setSource(`data:image/png;base64,${base64}`);
            }
        }, {
            width: MAP_THUMBNAIL_SIZE,
            height: MAP_THUMBNAIL_SIZE,
        });
        return () => { isCurrent = false; };
    }, [svg, loaded]);

    return { source, imageUri, setSvg, setLoaded };
};

export const CircularMapThumbnail = ({ imageId, uri }: Props) => {
    const { source, imageUri, setSvg, setLoaded } = useCircularMapThumbnail(uri);

    if (source) {
        return <Images images={{ [imageId]: { source: { uri: source } } }} />;
    }

    if (!imageUri) {
        return null;
    }

    return (
        <View pointerEvents="none" style={styles.rasterizer}>
            <Svg
                ref={setSvg}
                width={MAP_THUMBNAIL_SIZE}
                height={MAP_THUMBNAIL_SIZE}
                viewBox={`0 0 ${MAP_THUMBNAIL_SIZE} ${MAP_THUMBNAIL_SIZE}`}
            >
                <Defs>
                    <ClipPath id="thumbnail-circle">
                        <Circle cx="50%" cy="50%" r="50%" />
                    </ClipPath>
                </Defs>
                <Image
                    href={{ uri: imageUri }}
                    width={MAP_THUMBNAIL_SIZE}
                    height={MAP_THUMBNAIL_SIZE}
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#thumbnail-circle)"
                    onLoad={() => {
                        if (Platform.OS !== 'android') {
                            setLoaded(true);
                        }
                    }}
                />
            </Svg>
        </View>
    );
};
