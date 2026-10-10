import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import { ObservedToolIcon, useTranslation } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { useTheme } from "@ui";
import { Button, Span, Transition } from "@web-ui";
import { T } from "@web-apparatus";

interface Props {
    map: maplibregl.Map;
    className?: string;
}

export const ToolIconRight: FC<ObservedToolIcon<maplibregl.Map> & Props> = ({
    map,
    icon,
    anchorRef$,
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
                ref={(r) => {
                    anchorRef$.next({ current: r });
                }}
                aria-label={ariaLabel}
                icon={icon}
                iconRotateZ={pitch}
                iconRotateX={-rotate}
                tooltip={<T {...effectiveTooltip} />}
                tooltipPlacement="left"
                showTooltipConnection
                size="md"
                variant="fill-inverse"
                contentShade={500}
                highlightContentShade={theme.isDark ? 300 : 700}
                corners="hexagon"
                glowStyle={theme.isDark ? "animate-borders-glow" : 'none'}
                color="primary"
                active={active}
                onClick={() => onClick?.(map)}
                disabled={disabled}
                className={className}
            >
                {value ? <Span color="primary" shade={500}>{value}</Span> : null}
            </Button>
        </Transition>
    );
};
