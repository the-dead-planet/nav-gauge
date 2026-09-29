import { FC } from "react";
import { Cartomancer, useEffectiveRightPanelWidth, useTranslation } from "@apparatus";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { BevelPanel, Icon, LinkText, Tooltip } from "@mobile-ui";
import { useSubjectState } from "@tinker-chest";
import { Icons, useTheme } from "@ui";
import { useMobileMachineWard } from "@mobile-apparatus";

const styles = StyleSheet.create({
    anchor: {
        position: 'absolute',
        top: 0,
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
        fontSize: 8,
        lineHeight: 10,
    },
});

export const Attributions: FC = () => {
    const theme = useTheme();
    const { height } = useWindowDimensions();
    const [media] = useSubjectState(theme.media$);
    const rightPanelWidth = useEffectiveRightPanelWidth();
    const { attributionVault, cartomancer, namespace, translationKey } = useMobileMachineWard();
    const tooltip = useTranslation({ n: namespace, t: translationKey.Attributions });
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [attributions] = useSubjectState(attributionVault.attributions$);
    const entries = attributions.get(selectedStyle.id);
    const textShade = Cartomancer.styles[selectedStyle.id].mode === 'dark' ? 300 : 700;
    const textHighlightShade = Cartomancer.styles[selectedStyle.id].mode === 'dark' ? 400 : 600;

    if (!entries || entries.length === 0) {
        return null;
    }

    return (
        <View pointerEvents="box-none" style={[styles.anchor, { right: rightPanelWidth }]}>
            <BevelPanel bevel={6} color="neutral" variant="fill-translucent" style={styles.container}>
                <View style={styles.content}>
                    <Tooltip content={tooltip} placement="left">
                        <View>
                            <Icon
                                icon={Icons.NounProject.Attribution}
                                color={theme.color('neutral', textShade)}
                                width={10}
                                height={10}
                            />
                        </View>
                    </Tooltip>
                    {entries.map(({ text, shortText, href }) => (
                        <LinkText key={text} href={href} color="neutral" shade={textShade} highlightShade={textHighlightShade} style={styles.link} accessibilityLabel={text}>
                            {height < 600 || media.isLessThanMd ? shortText ?? text : text}
                        </LinkText>
                    ))}
                </View>
            </BevelPanel>
        </View>
    );
};
