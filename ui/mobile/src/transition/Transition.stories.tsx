import { FC, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Transition } from "./Transition";
import { Button } from "../button";
import { Text } from "../typography";

const styles = StyleSheet.create({
    container: {
        padding: 16,
        rowGap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    box: {
        width: 200,
        height: 200,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
});

const directions = ['to-top', 'to-right', 'to-bottom', 'to-left'] as const;

export const SlideDemo: FC = () => {
    const [render, setRender] = useState(true);
    const [direction, setDirection] = useState<typeof directions[number]>('to-top');
    const [fade, setFade] = useState(false);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                {directions.map((d) => (
                    <Button
                        key={d}
                        variant={direction === d ? 'fill' : 'ghost'}
                        color="primary"
                        size="xs"
                        corners="rounded"
                        onPress={() => setDirection(d)}
                    >
                        {d}
                    </Button>
                ))}
                <Button
                    variant={fade ? 'fill' : 'ghost'}
                    color="tertiary"
                    size="xs"
                    corners="rounded"
                    onPress={() => setFade((v) => !v)}
                >
                    {fade ? 'fade: on' : 'fade: off'}
                </Button>
            </View>

            <Button onPress={() => setRender((v) => !v)}>
                {render ? 'Hide' : 'Show'}
            </Button>

            <Transition render={render} slide={direction} fade={fade} durationMs={400}>
                <View style={[styles.box, { backgroundColor: '#1a3a5c' }]}>
                    <Text style={{ fontWeight: '700', color: '#fff' }}>
                        {direction}{fade ? ' + fade' : ''}
                    </Text>
                </View>
            </Transition>
        </View>
    );
};
