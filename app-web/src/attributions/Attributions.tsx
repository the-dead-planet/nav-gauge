import { FC } from "react";
import { LAYOUT_DEFAULTS, useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { Icon, Span } from "@web-ui";
import { Icons } from "@ui";
import styles from './attributions.module.css';

export const Attributions: FC = () => {
    const { attributionVault, cartomancer } = useMachineWard();
    const [selectedStyle] = useSubjectState(cartomancer.selectedStyle$);
    const [attributions] = useSubjectState(attributionVault.attributions$);
    const entries = attributions.get(selectedStyle.id);

    if (!entries || entries.length === 0) {
        return null;
    }

    return (
        <div className={styles['container']} style={{
            right: `${-LAYOUT_DEFAULTS.icons.right}px`
        }}>
            <Icon src={Icons.NounProject.Attribution} width="16" height="16" />
            {entries.flatMap(({ text, href }) => (
                <a key={text} href={href} target='_blank'>
                    <Span>{text}</Span>
                </a>
            ))}
        </div>
    );
};
