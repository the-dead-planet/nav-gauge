import { FC, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTheme } from '@ui';
import { Text } from '../design-system/typography';
import { ResizeHandle } from '../gizmos/resize-handle';
import { Tabstrip } from '../rigs/tabstrip';
import { MobileStoryArgs, StoryEntry } from './model';
import { StoryControlField } from './StoryControlField';
import { StoryHeader } from './StoryHeader';

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    page: {
        flex: 1,
        paddingVertical: 16,
        gap: 16,
    },
    header: {
        paddingHorizontal: 16,
    },
    list: {
        gap: 8,
    },
    legacyList: {
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    preview: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    galleryPreview: {
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
    },
    drawer: {
        position: 'absolute',
        borderWidth: 1,
        padding: 16,
    },
    portraitDrawer: {
        left: 0,
        right: 0,
        bottom: 0,
    },
    landscapeDrawer: {
        top: 0,
        right: 0,
        bottom: 0,
    },
    portraitHandle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: -12,
        height: 24,
    },
    landscapeHandle: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: -12,
        width: 24,
    },
    controls: {
        gap: 10,
    },
});

export const ComponentStory: FC<{ entry: StoryEntry }> = ({ entry }) => {
    const theme = useTheme();
    const { width, height } = useWindowDimensions();
    const landscape = width > height;
    const definition = entry.definition;
    const [tab, setTab] = useState('playground');
    const [args, setArgs] = useState<MobileStoryArgs>(() => ({ ...definition?.args }));
    const [storedDrawerSize, setStoredDrawerSize] = useState(landscape ? 300 : 240);

    if (!definition) {
        return (
            <View style={styles.page}>
                <View style={styles.header}>
                    <StoryHeader title={entry.name} />
                </View>
                <ScrollView contentContainerStyle={[styles.list, styles.legacyList]}>
                    {entry.legacyStories.map(({ name, Component }) => (
                        <View key={name} style={styles.list}>
                            <Text style={styles.title}>{name}</Text>
                            <Component />
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    }

    const controlNames = tab === 'gallery'
        ? definition.galleryEditableControls ?? []
        : Object.keys(definition.controls);
    const maximumDrawerSize = Math.max(160, (landscape ? width : height) * 0.7);
    const drawerSize = Math.min(storedDrawerSize, maximumDrawerSize);
    const resize = (delta: number) => setStoredDrawerSize((current) => Math.max(160, Math.min(maximumDrawerSize, current - delta)));
    const drawerStyle = landscape
        ? [styles.drawer, styles.landscapeDrawer, { width: drawerSize }]
        : [styles.drawer, styles.portraitDrawer, { height: drawerSize }];

    return (
        <View style={styles.area}>
            <View style={styles.page}>
                <View style={styles.header}>
                    <StoryHeader title={entry.name} />
                </View>
                <Tabstrip
                    options={[{ label: 'Playground', value: 'playground' }, { label: 'Gallery', value: 'gallery' }]}
                    value={tab}
                    onChange={setTab}
                    spread
                    overflowAccessibilityLabel="More story views"
                />
                <View style={[
                    styles.preview,
                    tab === 'gallery' ? styles.galleryPreview : undefined,
                    landscape ? { marginRight: drawerSize } : { marginBottom: drawerSize },
                ]}>
                    {tab === 'gallery' ? definition.renderGallery(args) : definition.renderPlayground(args)}
                </View>
            </View>
            <View style={[drawerStyle, { backgroundColor: theme.surfaceColor('background'), borderColor: theme.surfaceColor('border') }]}>
                <View style={landscape ? styles.landscapeHandle : styles.portraitHandle}>
                    <ResizeHandle
                        direction={landscape ? 'horizontal' : 'vertical'}
                        side={landscape ? 'left' : 'top'}
                        color="primary"
                        tooltip="Resize controls"
                        onDrag={resize}
                    />
                </View>
                <ScrollView contentContainerStyle={styles.controls}>
                    {controlNames.map((name) => (
                        <StoryControlField
                            key={name}
                            name={name}
                            control={definition.controls[name]!}
                            value={args[name]}
                            onChange={(value) => setArgs((current) => ({ ...current, [name]: value }))}
                        />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
};
