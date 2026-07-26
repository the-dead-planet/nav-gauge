import { FC } from "react";
import classNames from "classnames";
import { useMachineWard } from "@apparatus";
import { useObservableState } from "@tinker-chest";
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
    const { toolsStation } = useMachineWard();
    const toolIcons = useObservableState(toolsStation.toolIconsByPlacement$, []);
    const toolIconsByPlacement = toolsStation.getToolIconsByPlacement(toolIcons);
    const len = toolIconsByPlacement[placement].length;
    const Component = placement === 'left' ? ToolIconLeft : ToolIconRight;

    {/* TODO: Bind right icons with right panel? */ }
    {/* TODO: Rename right/left panels according to their use */ }
    {/* TODO: Add option to swap left/right */ }
    return (
        <div className={classNames(styles['icons'], styles[placement])}>
            {(placement === 'right' && len === 1) || (placement === 'left' && len > 1)
                ? <div />
                : null}
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
