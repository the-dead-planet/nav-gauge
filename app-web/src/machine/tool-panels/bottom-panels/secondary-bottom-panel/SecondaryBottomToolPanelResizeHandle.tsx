import { FC } from "react";
import classNames from "classnames";
import { useBottomSecondaryToolPanelResizeHandle } from "@apparatus";
import { MachineResizeHandle } from "../../MachineResizeHandle";
import styles from '../../../machine.module.css';

interface Props {
    onDraggingChange?: (isDragging: boolean) => void;
}

export const BottomSecondaryToolPanelResizeHandle: FC<Props> = ({
    onDraggingChange,
}) => {
    const {
        handleVerticalDragStart,
        handleVerticalDrag,
        handleVerticalDragEnd,
    } = useBottomSecondaryToolPanelResizeHandle(onDraggingChange);

    return (
        <div className={classNames(styles['resize-handle'], styles['resize-handle-bottom-secondary'])}>
            <MachineResizeHandle
                direction="vertical"
                side="top"
                color="primary"
                onDrag={handleVerticalDrag}
                onDragStart={handleVerticalDragStart}
                onDragEnd={handleVerticalDragEnd}
            />
        </div>
    );
};
