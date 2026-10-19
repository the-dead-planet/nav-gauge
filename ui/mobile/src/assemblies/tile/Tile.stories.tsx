import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { fillVariantOptions, tileStoryArgs, tileStoryControls } from '@ui';
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
            actions={<Button variant="fill">Open</Button>}
        >
            <View style={styles.content} />
        </Tile>
    ),
    renderGallery: (args) => (
        <View style={styles.gallery}>
            <VariantGallery
                sizes={['sm']}
                variants={fillVariantOptions}
                scrollEnabled={false}
                render={({ color, variant }) => (
                    <Tile
                        {...args}
                        panelProps={{ ...args.panelProps, color, variant }}
                        actions={<Button variant="fill">Open</Button>}
                    />
                )}
            />
        </View>
    ),
} satisfies MobileStoryDefinition<ComponentProps<typeof Tile>>;

export default story;
