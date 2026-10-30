import { useEffect, useState } from "react";

export const usePanelDimensions = <
    Element extends HTMLElement = HTMLDivElement,
>(
    hasHeader = false,
) => {
    const [container, containerRef] = useState<Element | null>(null);
    const [header, headerRef] = useState<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
        headerHeight: 0,
    });

    useEffect(() => {
        if (!container) {
            return;
        }
        const update = () => {
            const next = {
                width: container.offsetWidth,
                height: container.offsetHeight,
                headerHeight: header?.offsetHeight ?? 0,
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
        observer.observe(container, { box: "border-box" });
        if (header) {
            observer.observe(header, { box: "border-box" });
        }
        update();
        return () => observer.disconnect();
    }, [container, header, hasHeader]);

    return { containerRef, headerRef, ...dimensions };
};
