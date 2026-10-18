import { ComponentProps } from 'react';
import { ScrollView, View, StyleSheet } from "react-native";
import { Button } from "./Button";
import { Text } from '../../design-system/typography';
import {
    buttonCorners,
    buttonStoryArgs,
    buttonStoryControls,
    Icons,
    surfaceVariantOptions,
} from "@ui";
import { VariantGallery } from '../../storybook/VariantGallery';
import { MobileStoryDefinition } from '../../storybook/model';

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    section: {
        paddingVertical: 12,
        gap: 8,
    },
    label: {
        marginBottom: 4,
    },
});

const story = {
    args: {
        ...buttonStoryArgs,
        icon: Icons.Beaker,
        contentShade: undefined,
        highlightColor: undefined,
        highlightContentShade: undefined,
        tooltipPlacement: undefined,
    },
    controls: {
        ...buttonStoryControls,
        icon: {
            control: 'select',
            options: ['None', 'Beaker', 'Light bulb'],
            mapping: {
                None: undefined,
                Beaker: Icons.Beaker,
                'Light bulb': Icons.NounProject.LightBulbCogWheel,
            },
        },
    },
    galleryEditableControls: [
        'children',
        'icon',
        'contentShade',
        'highlightColor',
        'highlightContentShade',
        'activeGlow',
        'active',
        'disabled',
        'tooltip',
        'tooltipPlacement',
        'showTooltipConnection',
        'iconRotateX',
        'iconRotateZ',
    ],
    renderPlayground: (args) => {
        return (
            <Button
                {...args}
                accessibilityLabel={args.corners === 'square' ? undefined : 'Button'}
            >
                {args.corners === 'square' ? args.children : null}
            </Button>
        );
    },
    renderGallery: (args) => {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                {buttonCorners.map((corners) => (
                    <View key={corners} style={styles.section}>
                        <Text style={styles.label}>{corners}</Text>
                        <VariantGallery
                            variants={surfaceVariantOptions}
                            scrollEnabled={false}
                            render={({ color, size, variant }) => (
                                <Button
                                    {...args}
                                    variant={variant}
                                    color={color}
                                    corners={corners}
                                    size={size}
                                    accessibilityLabel={corners === 'square' ? undefined : `${corners} button`}
                                >
                                    {corners === 'square' ? args.children : null}
                                </Button>
                            )}
                        />
                    </View>
                ))}
            </ScrollView>
        );
    },
} satisfies MobileStoryDefinition<ComponentProps<typeof Button>>;

export default story;
