import { FC } from "react";
import classNames from "classnames";
import { useSideToolPanelResizeHandle } from "@apparatus";
import { MachineResizeHandle } from "../MachineResizeHandle";
import styles from '../../machine.module.css';

interface Props {
    placement: "left" | "right";
    onDraggingChange: (isDragging: boolean) => void;
}

export const SideToolPanelResizeHandle: FC<Props> = ({
    placement,
    onDraggingChange,
}) => {
    const {
        handleDragStart,
        handleDrag,
        handleDragEnd,
    } = useSideToolPanelResizeHandle(placement, onDraggingChange);

    return (
        <div className={classNames(styles['resize-handle'], styles[`resize-handle-${placement}`])}>
            <MachineResizeHandle
                direction="horizontal"
                side={placement === 'left' ? 'right' : 'left'}
                onDrag={handleDrag}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            />
        </div>
    );
};
