import { FC } from "react";
import classNames from "classnames";
import { ObservedToolIcon } from "@apparatus";
import { useSubjectState } from "@tinker-chest";
import { useTheme } from "@ui";
import { Button, Transition } from "@web-ui";
import { T } from "@web-apparatus";

interface Props {
    map: maplibregl.Map;
    className?: string;
}

export const ToolIconRight: FC<ObservedToolIcon<maplibregl.Map> & Props> = ({
    map,
    active$,
    icon,
    rotate$,
    pitch$,
    tooltip,
    onClick,
    className,
}) => {
    const theme = useTheme();
    const [active] = useSubjectState(active$);
    const [rotate] = useSubjectState(rotate$);
    const [pitch] = useSubjectState(pitch$);

    return (
        <Transition fade render>
            <Button
                icon={icon}
                iconRotateX={pitch}
                iconRotateZ={-rotate}
                tooltip={<T {...tooltip} />}
                size="xs"
                variant="fill-inverse"
                corners="hexagon"
                glowStyle={theme.mode === 'dark' ? "animate-borders-glow" : 'none'}
                color="primary"
                active={active}
                onClick={() => onClick?.(map)}
                className={className}
            />
        </Transition>
    );
};
