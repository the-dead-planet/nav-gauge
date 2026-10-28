import { ComponentProps, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
    appearanceColorOptions,
    dialogPlacementOptions,
    fillVariantOptions,
} from '@ui';
import { Dialog } from './Dialog';
import { Button } from '../../gizmos/button';
import { VariantGallery } from '../../storybook/VariantGallery';

const styles = StyleSheet.create({
    placements: {
        gap: 12,
    },
});

export const DialogPreview = ({
    args,
    gallery = false,
}: {
    args: ComponentProps<typeof Dialog>;
    gallery?: boolean;
}) => {
    const [active, setActive] = useState<ComponentProps<typeof Dialog> | null>(
        null,
    );
    return (
        <>
            {gallery ? (
                <VariantGallery
                    colors={appearanceColorOptions}
                    variants={fillVariantOptions}
                    render={({ color, variant }) => (
                        <View style={styles.placements}>
                            {dialogPlacementOptions.map((placement) => (
                                <Button
                                    key={placement}
                                    color={color}
                                    onPress={() =>
                                        setActive({
                                            ...args,
                                            color,
                                            variant,
                                            placement,
                                            onClose: () => setActive(null),
                                        })
                                    }
                                >
                                    {color} / {placement}
                                </Button>
                            ))}
                        </View>
                    )}
                />
            ) : (
                <Button
                    onPress={() =>
                        setActive({ ...args, onClose: () => setActive(null) })
                    }
                >
                    Open dialog
                </Button>
            )}
            {active && <Dialog {...active} />}
        </>
    );
};
