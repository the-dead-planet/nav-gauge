import { ComponentProps } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
    fillVariantOptions,
    sizeOptions,
    tileStoryArgs,
    tileStoryControls,
} from '@ui';
import { Button } from '../../gizmos/button';
import { MobileStoryDefinition } from '../../storybook/model';
import { VariantGallery } from '../../storybook/VariantGallery';
import { Tile } from './Tile';

const styles = StyleSheet.create({
    gallery: {
        gap: 16,
        padding: 16,
    },
    content: {
        minHeight: 64,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
});

const story = {
    args: {
        ...tileStoryArgs,
        panelProps: { variant: 'fill-inverse' },
    },
    controls: tileStoryControls,
    renderPlayground: (args) => (
        <Tile
            {...args}
            append={<Button size="xs">Info</Button>}
            actions={(size, variants) => <Button size={size} variant={variants.active}>Open</Button>}
        >
            <View style={styles.content} />
        </Tile>
    ),
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.gallery}>
            <VariantGallery
                sizes={sizeOptions}
                variants={fillVariantOptions}
                scrollEnabled={false}
                render={({ color, size, variant }) => (
                    <Tile
                        {...args}
                        size={size}
                        panelProps={{ ...args.panelProps, color, variant }}
                        actions={(actionSize, variants) => (
                            <Button size={actionSize} variant={variants.active}>
                                Open
                            </Button>
                        )}
                    />
                )}
            />
        </ScrollView>
    ),
} satisfies MobileStoryDefinition<ComponentProps<typeof Tile>>;

export default story;
