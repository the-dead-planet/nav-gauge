import { RefObject, useEffect, useState } from "react";

export const useMarkerContainerWidth = (
    containerRef: RefObject<HTMLDivElement | null>,
) => {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const update = () => setWidth(container.getBoundingClientRect().width);
        const observer = new ResizeObserver(update);
        observer.observe(container);
        update();
        return () => observer.disconnect();
    }, [containerRef]);
    return width;
};
