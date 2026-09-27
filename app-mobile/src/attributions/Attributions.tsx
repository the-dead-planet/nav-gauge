import { FC } from "react";
import { useEffectiveRightPanelWidth, useTranslation } from "@apparatus";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { BevelPanel, Icon, LinkText, Tooltip } from "@mobile-ui";
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
        transform: [{ rotate: '90deg' }],
        transformOrigin: [0, 0, 0],
        height: 16,
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
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
            <BevelPanel bevel={6} color="neutral" variant="fill-inverse" style={styles.container}>
                <View style={styles.content}>
                    <Tooltip content={tooltip} placement="left">
                        <View>
                            <Icon
                                icon={Icons.NounProject.Attribution}
                                color={theme.color('neutral', 500)}
                                width={12}
                                height={12}
                            />
                        </View>
                    </Tooltip>
                    {entries.map(({ text, shortText, href }) => (
                        <LinkText key={text} href={href} color="neutral" shade={500} style={styles.link} accessibilityLabel={text}>
                            {height < 500 ? shortText ?? text : text}
                        </LinkText>
                    ))}
                </View>
            </BevelPanel>
        </View>
    );
};
