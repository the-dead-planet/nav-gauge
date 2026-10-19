import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, FontType, Icons } from "@ui";
import { Button, Text, ThemeModeToggle, topBarBackAction$ } from "@mobile-ui";
import { MachineWardTopBarProps, useMultipleTranslations } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { useMobileMachineWard } from "@mobile-apparatus";
import { RootStackParamList } from "../../navigation";
import { UnderConstructionChip } from "./UnderConstructionChip";
import { TOP_BAR_HEIGHT } from "../../machine-sizes";
import { LayoutMenu } from "./menu/LayoutMenu";

const styles = StyleSheet.create({
    container: {
        height: TOP_BAR_HEIGHT,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },
    leftSection: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    header: {
        fontSize: 16,
    },
    rightSection: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        justifyContent: "flex-end",
    },
});

export const TopBar: FC<MachineWardTopBarProps<keyof RootStackParamList>> = ({
    title,
    onNavigate,
    onNavigateBack,
}) => {
    const theme = useTheme();
    const { individuator, namespace, translationKey, toolsStation } =
        useMobileMachineWard();
    const [topBarTools] = useSubjectState(toolsStation.topBarTools$);
    const [topBarBackAction] = useSubjectState(topBarBackAction$);
    const [goBackTooltip, lightModeTooltip, darkModeTooltip] =
        useMultipleTranslations([
            { n: namespace, t: translationKey.GoBack },
            { n: namespace, t: translationKey.SwitchToLightMode },
            { n: namespace, t: translationKey.SwitchToDarkMode },
        ]);

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: theme.componentColor("background"),
                    borderBottomColor: theme.componentColor("border"),
                    shadowColor: theme.componentColor("box-shadow"),
                },
            ]}
        >
            <View style={styles.leftSection}>
                {topBarBackAction ? (
                    <Button
                        icon={Icons.NounProject.ChevronDownDouble}
                        iconRotateZ={90}
                        onPress={topBarBackAction.onBack ?? onNavigateBack}
                        tooltip={goBackTooltip}
                        tooltipPlacement="bottom"
                        accessibilityLabel={goBackTooltip}
                    />
                ) : null}
                <UnderConstructionChip />
            </View>
            <Text
                fontType={FontType.NeonHeader}
                color="primary"
                shade={500}
                nowrap
                style={styles.header}
            >
                {title}
            </Text>
            <View style={styles.rightSection}>
                {Array.from(topBarTools).map(([id, Component]) => (
                    <Component key={id} />
                ))}
                <ThemeModeToggle
                    lightModeTooltip={lightModeTooltip}
                    darkModeTooltip={darkModeTooltip}
                    onToggle={individuator.toggleMode}
                />
                <LayoutMenu onNavigate={onNavigate} />
            </View>
        </View>
    );
};
