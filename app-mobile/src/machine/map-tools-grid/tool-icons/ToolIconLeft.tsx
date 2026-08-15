import { FC } from "react";
import { ObservedToolIcon, useMachineWard, useTranslation } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { useTheme } from "@ui";
import { Button } from "@mobile-ui";
import { MobileMap } from "@mobile-ui";

interface Props {
    map: MobileMap;
    className?: string;
}

export const ToolIconLeft: FC<ObservedToolIcon<MobileMap> & Props> = ({
    map,
    icon,
    value$,
    disabled$,
    active$,
    tooltip,
    onClick,
}) => {
    const { translatron, individuator } = useMachineWard();
    const theme = useTheme();
    const [value] = useSubjectState(value$);
    const [disabled] = useSubjectState(disabled$);
    const [active] = useSubjectState(active$);
    const [settings] = useSubjectState(individuator.settings$);
    const [registry] = useSubjectState(translatron.registry$);
    const effectiveTooltip = typeof tooltip === 'function' ? tooltip(value) : tooltip;
    const ariaLabel = useTranslation(effectiveTooltip);
    const resolvedTooltip = typeof effectiveTooltip === 'object' && effectiveTooltip !== null
        ? translatron.translate(settings.language, registry, effectiveTooltip)
        : (effectiveTooltip ?? '');

    return (
        <Button
            accessibilityLabel={ariaLabel}
            icon={icon as never}
            tooltip={resolvedTooltip}
            tooltipPlacement="right"
            showTooltipConnection
            size="sm"
            variant="fill-inverse"
            corners="hexagon"
            glowStyle={theme.isDark ? "animate-borders-glow" : 'none'}
            highlightColor="secondary"
            active={active}
            onPress={() => onClick?.(map)}
            disabled={disabled}
        />
    );
};
