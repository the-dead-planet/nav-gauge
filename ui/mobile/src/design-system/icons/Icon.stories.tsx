import { Fragment } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from '../typography';
import { appearanceColorOptions, IconAppearanceProps, Icons, iconStoryArgs, iconStoryControls, sizeOptions, themeAppearanceStateOptions } from "@ui";
import iconRegistry from '@the-dead-planet/nav-gauge-ui-common/src/design-system/icons/svg/noun-project/icon-registry.json';
import { Icon } from './Icon';
import { MobileStoryDefinition } from '../../storybook/model';

const { NounProject, ...rest } = Icons;
const IconData = {
    ...NounProject,
    ...rest,
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '100%',
    },
    item: {
        width: '33.3333%',
        padding: 8,
        justifyContent: 'center',
        flexDirection: 'row',
        textAlign: 'center'
    },
    title: {
        fontWeight: 700
    },
    section: {
        gap: 12,
        paddingVertical: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 32,
        gap: 16,
    },
    state: {
        width: 120,
    }
});

const story: MobileStoryDefinition<IconAppearanceProps> = {
    args: iconStoryArgs,
    controls: iconStoryControls,
    galleryEditableControls: ['highlightColor', 'glyphsShade', 'highlightGlyphsShade', 'highlighted', 'disabled'],
    renderPlayground: (args) => <Icon {...args} icon={Icons.NounProject.Gear} />,
    renderGallery: (args) => (
        <ScrollView contentContainerStyle={styles.section}>
            {sizeOptions.map((size) => appearanceColorOptions.map((color) => (
                <View key={`${color}-${size}`} style={styles.section}>
                    <Text usage="header">{color} / {size}</Text>
                    {themeAppearanceStateOptions.map((appearanceState) => (
                        <View key={appearanceState} style={styles.row}>
                            <Text style={styles.state}>{appearanceState}</Text>
                            {[Icons.Circle, Icons.Play, Icons.NounProject.Gear].map((icon, index) => (
                                <Icon
                                    {...args}
                                    key={index}
                                    icon={icon}
                                    color={color}
                                    size={size}
                                    appearanceState={appearanceState}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            )))}
        </ScrollView>
    ),
};

export default story;

export const IconsWithCreators = () => (
    <View style={styles.container}>
        <Text style={[styles.item, styles.title]}>Icon</Text>
        <Text style={[styles.item, styles.title]}>Name</Text>
        <Text style={[styles.item, styles.title]}>Creator</Text>

        {Object.entries(IconData)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([iconName, Component]) => {
                const data = iconRegistry.find(
                    (entry) => entry.id.replaceAll('-', '').toLowerCase() === iconName.toLowerCase()
                );

                return (
                    <Fragment key={iconName}>
                        <View style={styles.item}>
                            <Icon icon={Component} width={50} height={50} />
                        </View>
                        <Text style={styles.item}>{iconName}</Text>
                        {data
                            ? <Text style={styles.item}>{data.creator} from {data.source}</Text>
                            : <Text style={styles.item}>N/A</Text>}
                    </Fragment>
                );
            })}
    </View>
);
