import { FC } from "react";
import classNames from "classnames";
import { useWebMachineWard } from "@web-apparatus";
import { useEffectiveRightPanelWidth, useTranslation } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { BevelPanel, Icon, LinkText, Tooltip } from "@web-ui";
import { Icons, useTheme } from "@ui";
import styles from './attributions.module.css';

export const Attributions: FC = () => {
    const theme = useTheme();
    const rightPanelWidth = useEffectiveRightPanelWidth();
    const { attributionVault, cartomancer, namespace, translationKey } = useWebMachineWard();
    const tooltip = useTranslation({ n: namespace, t: translationKey.Attributions });
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [attributions] = useSubjectState(attributionVault.attributions$);
    const entries = attributions.get(selectedStyle.id);

    if (!entries || entries.length === 0) {
        return null;
    }

    return (
        <div className={styles['anchor']} style={{ right: rightPanelWidth + 6 }}>
            <div className={styles['container']}>
                <BevelPanel
                    bevel={6}
                    color="neutral"
                    variant="fill-inverse"
                    className={styles['rail']}
                    contentClassName={styles['content']}
                    clipContent={false}
                >
                    <Tooltip content={tooltip} placement="left">
                        <span>
                            <Icon
                                src={Icons.NounProject.Attribution}
                                color={theme.color('neutral', 500)}
                                width="12"
                                height="12"
                            />
                        </span>
                    </Tooltip>
                    {entries.map(({ text, shortText, href }) => (
                        <LinkText key={text} href={href} color="neutral" shade={500} aria-label={text} className={classNames(styles['link'], styles[`mode-${theme.mode}`])}>
                            <span className={styles['full-text']}>{text}</span>
                            <span className={styles['short-text']}>{shortText ?? text}</span>
                        </LinkText>
                    ))}
                </BevelPanel>
            </div>
        </div>
    );
};
