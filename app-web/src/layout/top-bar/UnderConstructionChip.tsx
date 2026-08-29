import { FC } from "react";
import { useMultipleTranslations } from "@apparatus";
import { useWebMachineWard } from "@web-apparatus";
import { Icons, useTheme } from "@ui";
import { Chip } from "@web-ui";
import { useSubjectState } from "@tinker-chest";

export const UnderConstructionChip: FC = () => {
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const { namespace, translationKey } = useWebMachineWard();
    const [
        underConstructionLabel,
    ] = useMultipleTranslations([
        { n: namespace, t: translationKey.UnderConstruction },
    ]);
    const showLabel = media.isMoreThanSm;

    return (
        <Chip
            icon={Icons.NounProject.UnderConstruction}
            tooltip={showLabel ? undefined : underConstructionLabel}
            tooltipPlacement="bottom"
            tooltipVariant="fill-inverse"
            color="warning"
        >
            {showLabel ? underConstructionLabel : null}
        </Chip>
    );
};
