import { FC } from "react";
import { MachineWardFooterProps, useStateWarden, useSubjectState } from "@apparatus";
import * as styles from './layout.module.css';

export const Footer: FC<MachineWardFooterProps> = () => {
    const stateWarden = useStateWarden();
    const [attrributions] = useSubjectState(stateWarden.attributionVault.attributions$);

    return (
        <footer className={styles["footer"]}>
            {[...attrributions.entries()].map(([id, { text, href }]) => (
                <a key={id} target="_blank" rel="noreferrer" href={href}>
                    © {text}
                </a>
            ))}
        </footer>
    );
}
