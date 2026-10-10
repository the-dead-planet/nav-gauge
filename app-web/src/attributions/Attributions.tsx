import { FC } from "react";
import classNames from "classnames";
import { useWebMachineWard } from "@web-apparatus";
import { Cartomancer, useEffectiveRightPanelWidth, useTranslation } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { BevelPanel, Icon, LinkText, Tooltip } from "@web-ui";
import { Icons, useTheme } from "@ui";
import styles from './attributions.module.css';

export const Attributions: FC = () => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const rightPanelWidth = useEffectiveRightPanelWidth();
    const { attributionVault, cartomancer, namespace, translationKey } = useWebMachineWard();
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
        <div className={styles['anchor']} style={{ right: rightPanelWidth }}>
            <div className={styles['container']}>
                <BevelPanel
                    size="xs"
                    color="neutral"
                    variant="fill-translucent"
                    className={classNames(styles['rail'], { [styles['compact']]: media.isLessThanMd })}
                    contentClassName={styles['content']}
                    clipContent={false}
                >
                    <Tooltip content={tooltip} placement="left">
                        <span>
                            <Icon
                                src={Icons.NounProject.Attribution}
                                color={theme.color('neutral', textShade)}
                                width="10"
                                height="10"
                            />
                        </span>
                    </Tooltip>
                    {entries.map(({ text, shortText, href }) => (
                        <LinkText key={text} href={href} color="neutral" shade={textShade} highlightShade={textHighlightShade} aria-label={text}>
                            <span className={styles['full-text']}>{text}</span>
                            <span className={styles['short-text']}>{shortText ?? text}</span>
                        </LinkText>
                    ))}
                </BevelPanel>
            </div>
        </div>
    );
};
