import { FC } from "react";
import { Chip } from "@web-ui";
import { useMultipleTranslations } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { useSubjectState } from "@tinker-chest";
import { WebRouteStoryProps } from "../model";
import styles from './top-bar.module.css';

export const RecChip: FC<WebRouteStoryProps> = ({
    gearId,
    translationKey,
    playerOperator
}) => {
    const { chronoLens } = useWebMachineWard();
    const [surveillanceState] = useSubjectState(chronoLens.surveillanceState$);
    const [
        stopRecordingLabel,
    ] = useMultipleTranslations([
        { n: gearId, t: translationKey.StopRecording },
    ]);

    return (
        <span
            role="button"
            tabIndex={0}
            aria-label={stopRecordingLabel}
            onClick={() => playerOperator.onStop()}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    playerOperator.onStop();
                }
            }}
            className={styles['clickable']}
        >
            <Chip
                variant="fill"
                size="md"
                color={playerOperator.getBlinkingColor(surveillanceState)}
                tooltip={stopRecordingLabel}
                className={styles["blinking"]}
            >
                REC
            </Chip>
        </span>
    );
};
