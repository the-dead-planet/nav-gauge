import { FC } from "react";
import classNames from "classnames";
import { ResizeHandle } from "@web-ui";
import { useBottomSecondaryToolPanelResizeHandle } from "@apparatus";
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
            <ResizeHandle
                direction="vertical"
                onDrag={handleVerticalDrag}
                onDragStart={handleVerticalDragStart}
                onDragEnd={handleVerticalDragEnd}
            />
        </div>
    );
};
