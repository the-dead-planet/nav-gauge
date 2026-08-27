import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme, FontType, Icons } from "@ui";
import { Button, Text } from '@mobile-ui';
import { MachineWardTopBarProps, useMultipleTranslations } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { RootStackParamList } from "../../navigation";
import { UnderConstructionChip } from "./UnderConstructionChip";
import { TOP_BAR_HEIGHT } from "../../machine-sizes";
import { LayoutMenu } from "./menu/LayoutMenu";

const styles = StyleSheet.create({
    container: {
        height: TOP_BAR_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 4,
    },
    leftSection: {
        flex: 1,
    },
    header: {
        fontSize: 16,
    },
    rightSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        justifyContent: 'flex-end',
    },
});

export const TopBar: FC<MachineWardTopBarProps<keyof RootStackParamList>> = ({
    title,
    onNavigate,
}) => {
    const theme = useTheme();
    const { individuator, namespace, translationKey } = useMobileMachineWard();
    const [modeTooltip] = useMultipleTranslations([
        { n: namespace, t: translationKey.ToggleMode },
    ]);

    return (
        <View style={[styles.container, {
            backgroundColor: theme.componentColor('background'),
            borderBottomColor: theme.componentColor('border'),
            shadowColor: theme.componentColor('box-shadow'),
        }]}>
            <View style={styles.leftSection}>
                <UnderConstructionChip />
            </View>
            <Text fontType={FontType.NeonHeader} color="primary" nowrap style={styles.header}>
                {title}
            </Text>
            <View style={styles.rightSection}>
                <Button
                    aria-label={modeTooltip}
                    tooltip={modeTooltip}
                    tooltipPlacement="bottom"
                    icon={Icons.NounProject.LightBulbCogWheel}
                    onPress={individuator.toggleMode}
                    variant="inset"
                    size="md"
                    color={theme.isDark ? "secondary" : 'neutral'}
                    highlightColor={theme.isDark ? "neutral" : 'secondary'}
                />
                <LayoutMenu onNavigate={onNavigate} />
            </View>
        </View>
    );
};
