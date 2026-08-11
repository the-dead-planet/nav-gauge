import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@mobile-ui";
import { ToolPanelPlacement, useToolPanelHeader } from "@apparatus";
import { useTheme, Icons } from "@ui";
import { ToolPanelHeaderButton } from "./ToolPanelHeaderButton";

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
    const theme = useTheme();

    const {
        effectivePanels,
        tooltipPlacement,
        getVariant,
        getColor,
        buttonSize,
        expandCollapseLabel,
        handleCollapseExpand,
        onSelect,
    } = useToolPanelHeader(placement, activeId, onActiveIdChange);

    const expandCollapseButton = (
        <Button
            size={buttonSize}
            variant='ghost'
            color={getColor(true)}
            icon={Icons.NounProject.ChevronDownDouble}
            iconRotateZ={((placement === 'left' ? 90 : placement === "right" ? -90 : 0) + (activeId === null ? 180 : 0) + 360) % 360}
            accessibilityLabel={expandCollapseLabel}
            tooltip={expandCollapseLabel}
            tooltipPlacement={tooltipPlacement}
            onPress={handleCollapseExpand}
        />
    );

    return (
        <View style={[styles.headerContainer, placement !== 'bottom' && styles.headerContainerSide]}>
            {effectivePanels.map((toolPanel) => {
                const isActive = toolPanel.id === activeId;

                return (
                    <ToolPanelHeaderButton
                        key={toolPanel.id}
                        toolPanel={toolPanel}
                        tooltipPlacement={tooltipPlacement}
                        buttonSize={buttonSize}
                        variant={getVariant(isActive)}
                        color={getColor(isActive)}
                        isActive={isActive}
                        onPress={onSelect(toolPanel)}
                    />
                )
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
