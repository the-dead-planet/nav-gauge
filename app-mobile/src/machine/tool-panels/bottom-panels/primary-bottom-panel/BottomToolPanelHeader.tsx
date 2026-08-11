import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Button, MobileButtonProps } from "@mobile-ui";
import { useSubjectState } from "@tinker-chest";
import { useBottomToolPanelHeader, useMachineWard } from "@apparatus";

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
    const { translatron, individuator } = useMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);

    const {
        effectivePanels,
        buttonProps,
        collapseExpandButtonProps: { icon: collapseExpandIcon, ...colExpProps },
        onSelect,
        onCollapseExpand,
    } = useBottomToolPanelHeader(activeId, onActiveIdChange);

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                {effectivePanels.map((toolPanel) => {
                    const tooltip = translatron.translate(settings.language, registry, toolPanel.title);
                    const isActive = activeId === toolPanel.id;

                    return (
                        <Button
                            key={toolPanel.id}
                            active={isActive}
                            icon={toolPanel.icon as unknown as MobileButtonProps['icon']}
                            accessibilityLabel={tooltip}
                            tooltip={tooltip}
                            onPress={onSelect(toolPanel)}
                            {...buttonProps}
                        />
                    );
                })}
            </View>
            <View style={styles.rightSection}>
                <Button
                    icon={collapseExpandIcon as unknown as MobileButtonProps['icon']}
                    onPress={onCollapseExpand}
                    {...colExpProps}
                />
            </View>
        </View>
    );
};
