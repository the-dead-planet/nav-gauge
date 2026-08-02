import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@mobile-ui";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { useMachineWard } from "@apparatus";
import { Icons } from "@ui";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

interface Props {
    activeId: string | null;
    onActiveIdChange: (activeId: string | null) => void;
}

export const BottomToolPanelHeader: FC<Props> = ({
    activeId,
    onActiveIdChange,
}) => {
    const { namespace, translationKey, toolsStation, translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);
    const toolPanels = useObservableState(toolsStation.toolPanelsByPlacement$, []);
    const toolPanelsByPlacement = toolsStation.getToolPanelsByPlacement(toolPanels);
    const effectivePanels = toolPanelsByPlacement["bottom"];
    const tooltipPlacement = "top";
    const color = 'primary';
    const buttonSize = 'sm';

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                {effectivePanels.map(({ id, icon, title, }) => {
                    const tooltip = translatron.translate(settings.language, registry, title);
                    const isActive = activeId === id;

                    return (
                        <Button
                            key={id}
                            size={buttonSize}
                            variant='ghost'
                            color={color}
                            active={isActive}
                            icon={icon as never}
                            accessibilityLabel={tooltip}
                            tooltip={tooltip}
                            tooltipPlacement={tooltipPlacement}
                            showTooltipConnection
                            onPress={() => onActiveIdChange(activeId === id ? null : id)}
                        />
                    );
                })}
            </View>
            <View style={styles.rightSection}>
                <Button
                    size={buttonSize}
                    variant='ghost'
                    color={color}
                    icon={Icons.NounProject.ChevronDownDouble}
                    iconRotateZ={activeId === null ? 180 : 0}
                    accessibilityLabel={translatron.translate(settings.language, registry, { n: namespace, t: activeId === null ? translationKey.Expand : translationKey.Collapse })}
                    tooltip={translatron.translate(settings.language, registry, { n: namespace, t: activeId === null ? translationKey.Expand : translationKey.Collapse })}
                    tooltipPlacement={tooltipPlacement}
                    onPress={() => {
                        if (activeId !== null) {
                            onActiveIdChange(null);
                        } else {
                            onActiveIdChange(effectivePanels[0]?.id)
                        }
                    }}
                />
            </View>
        </View>
    );
};
