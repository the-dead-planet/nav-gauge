import { FC } from "react";
import { useMachineWard, useMultipleTranslations } from "@apparatus";
import { Icons, useTheme } from "@ui";
import { Chip } from "@mobile-ui";
import { useSubjectState } from "@tinker-chest";

export const UnderConstructionChip: FC = () => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const { namespace, translationKey } = useMachineWard();
    const [
        underConstructionLabel,
    ] = useMultipleTranslations([
        { n: namespace, t: translationKey.UnderConstruction },
    ]);
    const showLabel = media.isMoreThanSm;

    return (
        <Chip
            icon={Icons.NounProject.UnderConstruction}
            size="md"
            tooltip={showLabel ? undefined : underConstructionLabel}
            tooltipPlacement="bottom"
            tooltipVariant="fill-inverse"
            color="warning"
        >
            {showLabel ? underConstructionLabel : null}
        </Chip>
    );
};
