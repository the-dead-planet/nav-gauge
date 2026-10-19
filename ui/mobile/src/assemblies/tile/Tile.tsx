import { ComponentProps, FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { TileProps } from '@ui';
import { Text } from '../../design-system/typography';
import { Panel } from '../../hud/panel';

const styles = StyleSheet.create({
    tile: {
        minWidth: 0,
    },
    body: {
        flexGrow: 1,
    },
    header: {
        gap: 8,
        paddingTop: 12,
        paddingHorizontal: 12,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    title: {
        flex: 1,
        fontSize: 16,
        lineHeight: 20,
    },
    description: {
        fontSize: 14,
        lineHeight: 18,
    },
    content: {
        flexGrow: 1,
        gap: 8,
        minWidth: 0,
        padding: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        paddingTop: 12,
        paddingLeft: 12,
    },
});

interface Props extends TileProps {
    panelProps?: ComponentProps<typeof Panel>;
}

export const Tile: FC<Props> = ({
    name,
    append,
    description,
    actions,
    children,
    panelProps = {},
}) => {
    const { style, ...restPanelProps } = panelProps;

    return (
        <Panel {...restPanelProps} style={[styles.tile, style]}>
            <View style={styles.body}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        <Text bold style={styles.title}>
                            {name}
                        </Text>
                        {append}
                    </View>
                </View>
                {description || children ? (
                    <View style={styles.content}>
                        {description ? (
                            <Text style={styles.description}>
                                {description}
                            </Text>
                        ) : null}
                        {children}
                    </View>
                ) : null}
            </View>
            {actions ? <View style={styles.actions}>{actions}</View> : null}
        </Panel>
    );
};
