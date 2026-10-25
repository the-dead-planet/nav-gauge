import { useEffect, useRef, useState } from "react";

export const usePanelDimensions = (hasHeader = false) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
        headerHeight: 0,
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        const update = () => {
            const next = {
                width: container.offsetWidth,
                height: container.offsetHeight,
                headerHeight: headerRef.current?.offsetHeight ?? 0,
            };
            setDimensions((previous) =>
                previous.width === next.width &&
                previous.height === next.height &&
                previous.headerHeight === next.headerHeight
                    ? previous
                    : next,
            );
        };
        const observer = new ResizeObserver(update);
        observer.observe(container);
        if (headerRef.current) {
            observer.observe(headerRef.current);
        }
        update();
        return () => observer.disconnect();
    }, [hasHeader]);

    return { containerRef, headerRef, ...dimensions };
};
