import { FC } from "react";
import { useMachineWard, useMultipleTranslations } from "@apparatus";
import { FontType, Icons } from "@ui";
import { Span, Icon } from "@web-ui";
import styles from './under-construction.module.css';

export const UnderConstructionChip: FC = () => {
    const { namespace, translationKey } = useMachineWard();
    const [
        underConstructionLabel,
    ] = useMultipleTranslations([
        { n: namespace, t: translationKey.UnderConstruction },
    ]);

    return (
        <div className={styles['badge']}>
            <Icon src={Icons.NounProject.UnderConstruction} width={20} height={20} />
            <Span fontType={FontType.SpecialMessaging}>
                {underConstructionLabel}
            </Span>
        </div>
    );
};
