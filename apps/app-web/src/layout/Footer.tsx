import { FC } from "react";
import { useMachineWard } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import styles from './layout.module.css';

export const Footer: FC = () => {
    const { attributionVault } = useMachineWard();
    const [attrributions] = useSubjectState(attributionVault.attributions$);

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
