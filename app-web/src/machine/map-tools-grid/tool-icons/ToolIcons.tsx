import type * as maplibregl from "maplibre-gl";
import { FC } from "react";
import classNames from "classnames";
import { useToolIcons } from "@apparatus";
import { ToolIconRight } from "./ToolIconRight";
import { ToolIconLeft } from "./ToolIconLeft";
import styles from '../../machine.module.css';

interface Props {
    map?: maplibregl.Map;
    placement: 'right' | 'left';
}

export const ToolIcons: FC<Props> = ({
    map,
    placement,
}) => {
    const { hasSpacer, toolIconsByPlacement } = useToolIcons(placement);
    const Component = placement === 'left' ? ToolIconLeft : ToolIconRight;

    return (
        <div
            className={classNames(styles['icons'], styles[placement], {
                [styles['has-spacer']]: hasSpacer,
            })}
        >
            {hasSpacer ? <div /> : null}
            {!map
                ? null
                : toolIconsByPlacement[placement].map((toolIcon) => (
                    <Component
                        key={toolIcon.id}
                        map={map}
                        className={classNames(styles['icon-button'], styles[placement])}
                        {...toolIcon}
                    />
                ))}
        </div>
    );
};
