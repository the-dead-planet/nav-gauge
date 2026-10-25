import { RefObject, useEffect, useRef, useState } from "react";
import { getHudAnchorPoint, HudConnectorAnchor, HudPoint } from "@ui";

export const useConnectorPoints = (
    fromRef: RefObject<Element | null>,
    toRef: RefObject<Element | null>,
    fromAnchor: HudConnectorAnchor,
    toAnchor: HudConnectorAnchor,
) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [points, setPoints] = useState<[HudPoint, HudPoint] | null>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) {
            return;
        }
        const update = () => {
            const from = fromRef.current;
            const to = toRef.current;
            if (!from || !to) {
                setPoints(null);
                return;
            }
            observer.observe(from);
            observer.observe(to);
            const rectangle = wrapper.getBoundingClientRect();
            const next: [HudPoint, HudPoint] = [
                getHudAnchorPoint(
                    from.getBoundingClientRect(),
                    fromAnchor,
                    rectangle,
                ),
                getHudAnchorPoint(
                    to.getBoundingClientRect(),
                    toAnchor,
                    rectangle,
                ),
            ];
            setPoints((previous) =>
                previous?.every(
                    (point, index) =>
                        point.x === next[index].x && point.y === next[index].y,
                )
                    ? previous
                    : next,
            );
        };
        const observer = new ResizeObserver(update);
        const mutationObserver = new MutationObserver(update);
        observer.observe(wrapper);
        mutationObserver.observe(wrapper, { childList: true, subtree: true });
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);
        update();
        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
        };
    }, [fromAnchor, fromRef, toAnchor, toRef]);

    return { wrapperRef, points };
};
