import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useMachineWard, useMultipleTranslations } from "@apparatus";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { Button, FlexBox, Icon, Text } from "@mobile-ui";
import { Icons, useTheme } from "@ui";
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
        textTransform: 'uppercase',
        lineHeight: 40,
        marginLeft: 8,
    },
});

export const GearsTopToolbar: FC = () => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const { namespace, translationKey, engine, toolsStation, translatron, individuator } = useMachineWard();
    const gears = useObservableState(engine.gearsWithEngaged$, []);
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);
    const [gearLabel] = useMultipleTranslations([
        { n: namespace, t: translationKey.Gears },
    ]);

    return (
        <FlexBox
            ref={(instance) => {
                toolsStation.topToolbarSizeRef.current = instance;
            }}
            style={[styles.container, {
                backgroundColor: theme.componentColor('background', .87),
                borderBottomColor: theme.color('secondary'),
            }]}
            direction="row"
            gap="md"
            alignItems="center"
        >
            <View style={[styles.heading, { borderRightColor: theme.componentColor('divider') }]}>
                <Icon icon={Icons.NounProject.Gear} color={theme.color('secondary')} width={20} height={20} />
                {media.isMoreThanXs ? (
                    <Text color="secondary" style={[styles.headingText, { lineHeight: 40 }]}>
                        {gearLabel}
                    </Text>
                ) : null}
            </View>
            {gears.map(({ gear, isEngaged }) => (
                <Button
                    key={gear.id}
                    variant="ghost"
                    highlightColor="secondary"
                    active={isEngaged}
                    icon={gear.icon as never}
                    onPress={() => {
                        if (isEngaged) {
                            engine.disengageGear(gear);
                        } else {
                            engine.engageGear(gear);
                        }
                    }}
                    tooltip={translatron.translate(settings.language, registry, { n: gear.id, t: gear.translationKey.GearDescription })}
                    tooltipPlacement="bottom"
                >
                    {media.isMoreThanSm
                        ? translatron.translate(settings.language, registry, { n: gear.id, t: gear.translationKey.GearName })
                        : null}
                </Button>
            ))}
        </FlexBox>
    );
};
