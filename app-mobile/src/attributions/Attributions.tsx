import { FC } from "react";
import { useEffectiveRightPanelWidth, useTranslation } from "@apparatus";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Icon, LinkText, Tooltip } from "@mobile-ui";
import { useSubjectState } from "@tinker-chest";
import { Icons, useTheme } from "@ui";
import { useMobileMachineWard } from "@mobile-apparatus";

const styles = StyleSheet.create({
    anchor: {
        position: 'absolute',
        top: 6,
        zIndex: 3,
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 4,
        transform: [{ rotate: '90deg' }],
        transformOrigin: [0, 0, 0],
    },
    link: {
        fontSize: 10,
        lineHeight: 12,
    },
});

export const Attributions: FC = () => {
    const theme = useTheme();
    const { height } = useWindowDimensions();
    const rightPanelWidth = useEffectiveRightPanelWidth();
    const { attributionVault, cartomancer, namespace, translationKey } = useMobileMachineWard();
    const tooltip = useTranslation({ n: namespace, t: translationKey.Attributions });
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [attributions] = useSubjectState(attributionVault.attributions$);
    const entries = attributions.get(selectedStyle.id);

    if (!entries || entries.length === 0) {
        return null;
    }

    return (
        <View pointerEvents="box-none" style={[styles.anchor, { right: rightPanelWidth + 6 }]}>
            <View style={[styles.container, {
                backgroundColor: theme.componentColor('background', .87),
                borderColor: theme.color('neutral'),
            }]}>
                <Tooltip content={tooltip} placement="left">
                    <View>
                        <Icon
                            icon={Icons.NounProject.Attribution}
                            color={theme.color('neutral', 500)}
                            width={16}
                            height={16}
                        />
                    </View>
                </Tooltip>
                {entries.map(({ text, shortText, href }) => (
                    <LinkText key={text} href={href} color="neutral" shade={500} style={styles.link} accessibilityLabel={text}>
                        {height < 500 ? shortText ?? text : text}
                    </LinkText>
                ))}
            </View>
        </View>
    );
};
