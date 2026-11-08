import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useMultipleTranslations, useTranslate } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { Button, FlexBox, Icon, Text } from "@mobile-ui";
import { Icons, useTheme, withColorOpacity } from "@ui";
import { GEARS_TOP_BAR_HEIGHT } from "../machine-sizes";

const styles = StyleSheet.create({
    container: {
        height: GEARS_TOP_BAR_HEIGHT,
        borderBottomWidth: 1,
        paddingHorizontal: 12,
    },
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        paddingRight: 16,
    },
    headingText: {
        lineHeight: 40,
        marginLeft: 8,
    },
    captionedContainer: {
        paddingTop: 1,
    },
});

export const GearsTopToolbar: FC = () => {
    const theme = useTheme();
    const appearance = theme.resolveAppearance();
    const [media] = useSubjectState(theme.media$);
    const { namespace, translationKey, engine, toolsStation } = useMobileMachineWard();
    const gears = useObservableState(engine.gearsWithEngaged$, []);
    const translate = useTranslate();
    const [gearLabel] = useMultipleTranslations([
        { n: namespace, t: translationKey.Gears },
    ]);

    return (
        <FlexBox
            ref={(instance) => {
                toolsStation.topToolbarSizeRef.current = instance;
            }}
            style={[styles.container, !media.isMoreThanSm && styles.captionedContainer, {
                backgroundColor: withColorOpacity(appearance.surface, 0.87),
                borderBottomColor: theme.color('secondary'),
            }]}
            direction="row"
            gap="md"
            alignItems={media.isMoreThanSm ? "center" : "flex-start"}
        >
            <View style={[styles.heading, { borderRightColor: appearance.border.color }]}>
                <Icon icon={Icons.NounProject.Gear} color={theme.color('secondary')} width={20} height={20} />
                {media.isMoreThanXs ? (
                    <Text
                        color="secondary"
                        shade={500}
                        uppercase
                        style={styles.headingText}
                    >
                        {gearLabel}
                    </Text>
                ) : null}
            </View>
            {gears.map(({ gear, isEngaged }) => {
                const gearName = translate({ n: gear.id, t: gear.translationKey.GearName });
                const gearShortName = translate({ n: gear.id, t: gear.translationKey.GearShortName });
                return (
                    <Button
                        key={gear.id}
                        variant="ghost"
                        highlightColor="secondary"
                        highlighted={isEngaged}
                        icon={gear.icon as never}
                        accessibilityLabel={gearName}
                        caption={media.isMoreThanSm ? undefined : gearShortName}
                        captionNowrap
                        onPress={() => {
                            if (isEngaged) {
                                engine.disengageGear(gear);
                            } else {
                                engine.engageGear(gear);
                            }
                        }}
                        tooltip={gearName}
                        tooltipPlacement="bottom"
                    >
                        {media.isMoreThanSm ? gearName : null}
                    </Button>
                );
            })}
        </FlexBox>
    );
};
