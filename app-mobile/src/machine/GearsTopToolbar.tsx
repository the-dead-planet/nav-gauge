import { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { combineLatest, of, switchMap, map as rxjsMap } from "rxjs";
import { useMachineWard, useMultipleTranslations } from "@apparatus";
import { useObservableState, useSubjectState } from "@tinker-chest";
import { Button, FlexBox, Icon, Text } from "@mobile-ui";
import { Icons, useTheme } from "@ui";

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    content: {
        height: 40,
        justifyContent: 'center',
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
        <View
            ref={(instance) => {
                toolsStation.topToolbarSizeRef.current = instance;
            }}
            style={[styles.container, { backgroundColor: theme.componentColor('background', .87) }]}
        >
            <View style={[styles.content, { borderBottomColor: theme.color('secondary') }]}>
                <FlexBox direction="row" gap="md" alignItems="center">
                    <View style={[styles.heading, { borderRightColor: theme.componentColor('border') }]}>
                        <Icon icon={Icons.NounProject.Gear} color={theme.color('secondary')} width={20} height={20} />
                        <Text color="secondary" style={[styles.headingText, { lineHeight: 40 }]}>
                            {gearLabel}
                        </Text>
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
            </View>
        </View>
    );
};
