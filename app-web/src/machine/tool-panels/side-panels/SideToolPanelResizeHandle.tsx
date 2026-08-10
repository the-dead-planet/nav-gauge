import { FC } from "react";
import classNames from "classnames";
import { ResizeHandle } from "@web-ui";
import { useSideToolPanelResizeHandle } from "@apparatus";
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
            <ResizeHandle
                direction="horizontal"
                onDrag={handleDrag}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            />
        </div>
    );
};
