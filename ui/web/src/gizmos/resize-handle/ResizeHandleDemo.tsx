import { useRef, useState } from "react";
import { ResizeHandleProps } from "@ui";
import { ResizeHandle } from "./ResizeHandle";
import styles from "./resize-handle.stories.module.css";

export const ResizeHandleDemo = (props: ResizeHandleProps) => {
    const [extent, setExtent] = useState(120);
    const requestedExtent = useRef(extent);
    return (
        <section className={styles.demo}>
            <p>
                {props.direction}, {props.side ?? "default side"}, {props.color}
                : {Math.round(extent)}px
            </p>
            <div className={styles.stage}>
                <div
                    className={
                        props.direction === "horizontal"
                            ? styles.panel
                            : styles["panel-vertical"]
                    }
                    style={
                        props.direction === "horizontal"
                            ? { width: extent }
                            : { height: extent }
                    }
                >
                    <div
                        className={
                            props.direction === "horizontal"
                                ? styles["handle-container"]
                                : styles["handle-container-vertical"]
                        }
                    >
                        <ResizeHandle
                            {...props}
                            onDragStart={(position) => {
                                requestedExtent.current = extent;
                                props.onDragStart?.(position);
                            }}
                            onDrag={(delta) => {
                                requestedExtent.current += delta;
                                setExtent(
                                    Math.max(
                                        40,
                                        Math.min(200, requestedExtent.current),
                                    ),
                                );
                                props.onDrag(delta);
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};
