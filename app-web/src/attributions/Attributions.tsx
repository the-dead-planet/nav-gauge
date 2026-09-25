import { FC } from "react";
import { useWebMachineWard } from "@web-apparatus";
import { useEffectiveRightPanelWidth } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { Icon, LinkText } from "@web-ui";
import { Icons, useTheme } from "@ui";
import styles from './attributions.module.css';

export const Attributions: FC = () => {
    const theme = useTheme();
    const rightPanelWidth = useEffectiveRightPanelWidth();
    const { attributionVault, cartomancer } = useWebMachineWard();
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [attributions] = useSubjectState(attributionVault.attributions$);
    const entries = attributions.get(selectedStyle.id);

    if (!entries || entries.length === 0) {
        return null;
    }

    return (
        <div className={styles['anchor']} style={{ right: rightPanelWidth + 6 }}>
            <div className={styles['container']}>
                <Icon
                    src={Icons.NounProject.Attribution}
                    color={theme.color('neutral', 500)}
                    width="16"
                    height="16"
                />
                {entries.map(({ text, shortText, href }) => (
                    <LinkText key={text} href={href} color="neutral" shade={500} aria-label={text}>
                        <span className={styles['full-text']}>{text}</span>
                        <span className={styles['short-text']}>{shortText ?? text}</span>
                    </LinkText>
                ))}
            </div>
        </div>
    );
};
