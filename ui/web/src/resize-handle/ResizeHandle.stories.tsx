import { useRef, useState } from "react";
import type { Meta } from "storybook-react-rsbuild";
import { Text } from "../typography";
import { ResizeHandle } from "./ResizeHandle";
import styles from './resize-handle.stories.module.css';

const meta = {
    title: "ResizeHandle",
    component: ResizeHandle,
} satisfies Meta<typeof ResizeHandle>;

export default meta;

export const Horizontal = {
    render: () => {
        const [width, setWidth] = useState(300);
        const requestedWidth = useRef(width);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
                <Text style={{ fontWeight: 700 }}>Horizontal Resize Handle</Text>
                <Text>Drag the handle at the panel edge to resize.</Text>
                <div style={{ display: "flex", height: 400, border: "1px solid var(--color-neutral)", overflow: "hidden" }}>
                    <div className={styles['panel']} style={{ width }}>
                        <div style={{ padding: 16 }}>
                            <Text>Panel — {width}px</Text>
                            <Text>Drag the right edge to resize.</Text>
                        </div>
                        <div className={styles['handle-container']}>
                            <ResizeHandle
                                direction="horizontal"
                                side="right"
                                tooltip="Drag to resize"
                                onDrag={(delta) => {
                                    requestedWidth.current += delta;
                                    setWidth(Math.max(100, Math.min(600, requestedWidth.current)));
                                }}
                                onDragStart={() => { requestedWidth.current = width; }}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-neutral-700)" }}>
                        <Text>Map area</Text>
                    </div>
                </div>
            </div>
        );
    },
};

export const Vertical = {
    render: () => {
        const [height, setHeight] = useState(200);
        const requestedHeight = useRef(height);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
                <Text style={{ fontWeight: 700 }}>Vertical Resize Handle</Text>
                <Text>Drag the handle at the panel edge to resize vertically.</Text>
                <div style={{ height: 500, border: "1px solid var(--color-neutral)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-neutral-700)" }}>
                        <Text>Map area</Text>
                    </div>
                    <div className={styles['panel-vertical']} style={{ height }}>
                        <div style={{ padding: 16 }}>
                            <Text>Bottom panel — {height}px</Text>
                        </div>
                        <div className={styles['handle-container-vertical']}>
                            <ResizeHandle
                                direction="vertical"
                                side="top"
                                color="primary"
                                tooltip="Drag to resize"
                                onDrag={(delta) => {
                                    requestedHeight.current -= delta;
                                    setHeight(Math.max(80, Math.min(400, requestedHeight.current)));
                                }}
                                onDragStart={() => { requestedHeight.current = height; }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};

export const WithCallbacks = {
    render: () => {
        const [width, setWidth] = useState(300);
        const requestedWidth = useRef(width);
        const [events, setEvents] = useState<string[]>([]);

        const log = (msg: string) => setEvents((prev) => [...prev.slice(-8), msg]);

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: 24 }}>
                <Text style={{ fontWeight: 700 }}>With Drag Callbacks</Text>
                <div style={{ display: "flex", height: 300, border: "1px solid var(--color-neutral)", overflow: "hidden" }}>
                    <div className={styles['panel']} style={{ width }}>
                        <div style={{ padding: 16 }}>
                            <Text>Panel — {width}px</Text>
                        </div>
                        <div className={styles['handle-container']}>
                            <ResizeHandle
                                direction="horizontal"
                                side="right"
                                tooltip="Drag to resize"
                                onDrag={(delta) => {
                                    requestedWidth.current += delta;
                                    setWidth(Math.max(100, Math.min(600, requestedWidth.current)));
                                }}
                                onDragStart={() => {
                                    requestedWidth.current = width;
                                    log("dragStart");
                                }}

                                onDragEnd={() => log("dragEnd")}
                            />
                        </div>
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-neutral-700)" }}>
                        <Text>Map area</Text>
                    </div>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 12, color: "var(--color-secondary)" }}>
                    {events.map((e, i) => <div key={i}>{e}</div>)}
                </div>
            </div>
        );
    },
};
