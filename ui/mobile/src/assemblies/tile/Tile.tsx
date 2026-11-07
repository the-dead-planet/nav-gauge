import {
    Children,
    ComponentProps,
    FC,
    Fragment,
    isValidElement,
    ReactNode,
} from "react";
import { StyleSheet, View } from "react-native";
import {
    actionButtonVariants,
    DEFAULT_FILL_VARIANT,
    DEFAULT_SIZE,
    Theme,
    TileProps,
} from "@ui";
import { Text } from "../../design-system/typography";
import { Panel } from "../../hud/panel";
import { HudContent } from "../../hud/HudContent";

const styles = StyleSheet.create({
    tile: {
        minWidth: 0,
    },
    layout: {
        flexGrow: 1,
    },
    body: {
        flexGrow: 1,
        gap: Number.parseInt(Theme.spacing.xs, 10),
    },
    header: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: Number.parseInt(Theme.spacing.xs, 10),
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
        minWidth: 0,
        gap: Number.parseInt(Theme.spacing.xs, 10),
    },
    actions: {
        flexDirection: "row",
        flexShrink: 0,
    },
    actionCell: {
        flex: 1,
    },
});

const renderActionCells = (actions: ReactNode): ReactNode =>
    Children.map(actions, (action) => {
        if (
            isValidElement<{ children?: ReactNode }>(action) &&
            action.type === Fragment
        ) {
            return renderActionCells(action.props.children);
        }
        return action === null ? null : (
            <View style={styles.actionCell}>{action}</View>
        );
    });

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
    const {
        style,
        elevation = "raised",
        elevationLayer,
        ...surfaceProps
    } = panelProps;
    const depth = elevationLayer ? { elevationLayer } : { elevation };
    const actionVariants =
        actionButtonVariants[panelProps.variant ?? DEFAULT_FILL_VARIANT];

    return (
        <Panel
            {...surfaceProps}
            {...depth}
            style={[styles.tile, style]}
            renderContent={(appearance) => (
                <View style={styles.layout}>
                    <View
                        style={[
                            styles.body,
                            {
                                padding: Number.parseInt(
                                    Theme.spacing[size],
                                    10,
                                ),
                            },
                        ]}
                    >
                        <View style={styles.header}>
                            <Text
                                usage="header"
                                style={[
                                    styles.title,
                                    { color: appearance.glyphs },
                                ]}
                            >
                                {name}
                            </Text>
                            {append}
                        </View>
                        {description || children ? (
                            <View style={styles.content}>
                                {description ? (
                                    <Text
                                        style={[
                                            styles.description,
                                            { color: appearance.glyphs },
                                        ]}
                                    >
                                        {description}
                                    </Text>
                                ) : null}
                                <HudContent appearance={appearance}>
                                    {children}
                                </HudContent>
                            </View>
                        ) : null}
                    </View>
                    {actions ? (
                        <View style={styles.actions}>
                            {renderActionCells(actions(size, actionVariants))}
                        </View>
                    ) : null}
                </View>
            )}
        />
    );
};
