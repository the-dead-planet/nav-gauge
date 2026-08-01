import { FC } from "react";
import { useMachineWard, useMultipleTranslations } from "@apparatus";
import { FontType, Icons, useTheme } from "@ui";
import { Span, Icon, Tooltip } from "@web-ui";
import { useSubjectState } from "@tinker-chest";
import styles from './under-construction.module.css';

export const UnderConstructionChip: FC = () => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const { namespace, translationKey } = useMachineWard();
    const [
        underConstructionLabel,
    ] = useMultipleTranslations([
        { n: namespace, t: translationKey.UnderConstruction },
    ]);
    const icon = <Icon src={Icons.NounProject.UnderConstruction} width={20} height={20} title={underConstructionLabel} />

    return (
        <div className={styles['badge']}>
            {media.isMoreThanSm ? (
                <>
                    {icon}
                    <Span fontType={FontType.SpecialMessaging}>
                        {underConstructionLabel}
                    </Span>
                </>
            ) : (
                <Tooltip variant="fill-inverse" placement="bottom" content={underConstructionLabel}>
                    <span>{icon}</span>
                </Tooltip>
            )}
        </div>
    );
};
