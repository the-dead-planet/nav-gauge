import { ComponentProps, FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { actionButtonVariants, DEFAULT_FILL_VARIANT, DEFAULT_SIZE, SizeVariant, TileProps } from '@ui';
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
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        paddingTop: 12,
        paddingLeft: 12,
    },
});

const paddingBySize: Record<SizeVariant, number> = {
    xs: 6,
    sm: 12,
    md: 16,
    lg: 24,
};

interface Props extends TileProps {
    panelProps?: ComponentProps<typeof Panel>;
}

export const Tile: FC<Props> = ({
    name,
    size = DEFAULT_SIZE,
    append,
    description,
    actions,
    children,
    panelProps = {},
}) => {
    const { style, ...restPanelProps } = panelProps;
    const actionVariants = actionButtonVariants[panelProps.variant ?? DEFAULT_FILL_VARIANT];

    return (
        <Panel {...restPanelProps} style={[styles.tile, style]}>
            <View style={styles.body}>
                <View
                    style={[
                        styles.header,
                        {
                            paddingTop: paddingBySize[size],
                            paddingHorizontal: paddingBySize[size],
                        },
                    ]}
                >
                    <View style={styles.titleRow}>
                        <Text bold style={styles.title}>
                            {name}
                        </Text>
                        {append}
                    </View>
                </View>
                {description || children ? (
                    <View style={[styles.content, { padding: paddingBySize[size] }]}>
                        {description ? (
                            <Text style={styles.description}>
                                {description}
                            </Text>
                        ) : null}
                        {children}
                    </View>
                ) : null}
            </View>
            {actions ? <View style={styles.actions}>{actions(size, actionVariants)}</View> : null}
        </Panel>
    );
};
