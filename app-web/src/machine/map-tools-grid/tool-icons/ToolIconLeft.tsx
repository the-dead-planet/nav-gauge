import type * as maplibregl from "maplibre-gl";
import { FC, useRef } from "react";
import { ObservedToolIcon, useTranslation } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { useTheme } from "@ui";
import { Button, Transition } from "@web-ui";
import { T } from "@web-apparatus";

interface Props {
    map: maplibregl.Map;
    className?: string;
}

export const ToolIconLeft: FC<ObservedToolIcon<maplibregl.Map> & Props> = ({
    map,
    icon,
    value$,
    disabled$,
    active$,
    rotate$,
    pitch$,
    tooltip,
    onClick,
    className,
}) => {
    const theme = useTheme();
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [value] = useSubjectState(value$);
    const [disabled] = useSubjectState(disabled$);
    const [active] = useSubjectState(active$);
    const [rotate] = useSubjectState(rotate$);
    const [pitch] = useSubjectState(pitch$);
    const effectiveTooltip = typeof tooltip === 'function' ? tooltip(value) : tooltip;
    const ariaLabel = useTranslation(effectiveTooltip);

    return (
        <Transition fade render>
            <Button
                ref={anchorRef}
                aria-label={ariaLabel}
                icon={icon}
                iconRotateZ={pitch}
                iconRotateX={-rotate}
                tooltip={<T {...effectiveTooltip} />}
                tooltipPlacement="right"
                showTooltipConnection
                size="sm"
                variant="fill-inverse"
                corners="hexagon"
                glowStyle={theme.isDark ? "animate-borders-glow" : 'none'}
                highlightColor="secondary"
                active={active}
                onClick={() => onClick?.(map, anchorRef)}
                disabled={disabled}
                className={className}
            />
        </Transition>
    );
};
