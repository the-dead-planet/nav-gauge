import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@mobile-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { ToolPanelPlacement, useMachineWard } from "@apparatus";
import { useTheme } from "@ui";
import { Icons, TooltipPlacement } from "@ui";

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    headerContainerSide: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 5,
        gap: 5,
    },
    headerControlsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spacerLine: {
        flex: 1,
        width: 1,
    },
});

interface Props {
    placement: ToolPanelPlacement;
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
    headerControls?: ReactNode;
}

export const ToolPanelHeader: FC<Props> = ({
    placement,
    activeId,
    onActiveIdChange,
    headerControls,
}) => {
    const { namespace, translationKey, toolsStation, translatron, individuator } = useMachineWard();
    const theme = useTheme();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = placement === "bottom" ? toolPanelsByPlacement["left"].concat(toolPanelsByPlacement["right"]) : toolPanelsByPlacement[placement];
    const tooltipPlacement: Record<ToolPanelPlacement, TooltipPlacement> = {
        left: "right",
        right: "left",
        bottom: "top",
    };
    const color = placement === 'bottom' ? 'primary' : 'secondary';
    const buttonSize = placement === 'bottom' ? 'sm' : 'md';
    const expandCollapseLabel = translatron.translate(settings.language, registry, { n: namespace, t: activeId === null ? translationKey.Expand : translationKey.Collapse });

    const expandCollapseButton = (
        <Button
            size={buttonSize}
            variant='ghost'
            color={color}
            icon={Icons.NounProject.ChevronDownDouble}
            iconRotateZ={((placement === 'left' ? 90 : placement === "right" ? -90 : 0) + (activeId === null ? 180 : 0) + 360) % 360}
            accessibilityLabel={expandCollapseLabel}
            tooltip={expandCollapseLabel}
            tooltipPlacement={tooltipPlacement[placement]}
            onPress={() => {
                if (activeId !== null) {
                    onActiveIdChange(null);
                } else {
                    onActiveIdChange(effectivePanels[0]?.id)
                }
            }}
        />
    );

    const isSide = placement === 'left' || placement === 'right';

    return (
        <View style={[styles.headerContainer, isSide && styles.headerContainerSide]}>
            {effectivePanels.map(({ id, icon, title, }) => {
                const tooltip = translatron.translate(settings.language, registry, title);
                const isActive = activeId === id;

                return (
                    <Button
                        key={id}
                        size={buttonSize}
                        variant={isActive && placement !== 'left' ? 'outline' : 'ghost'}
                        color={isActive ? color : "neutral"}
                        highlightColor={color}
                        active={isActive}
                        icon={icon as never}
                        accessibilityLabel={tooltip}
                        tooltip={tooltip}
                        tooltipPlacement={tooltipPlacement[placement]}
                        showTooltipConnection
                        onPress={() => onActiveIdChange(activeId === id ? null : id)}
                    />
                );
            })}
            {placement === 'bottom' ? (
                <View style={styles.headerControlsContainer}>
                    {headerControls}
                    {expandCollapseButton}
                </View>
            ) : (
                <>
                    <View style={[styles.spacerLine, { backgroundColor: theme.color('neutral', 700) }]} />
                    {expandCollapseButton}
                </>
            )}
        </View>
    );
};
