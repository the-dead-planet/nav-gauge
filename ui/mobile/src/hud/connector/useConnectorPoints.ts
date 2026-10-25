import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { HostInstance, useWindowDimensions } from "react-native";
import {
    getHudAnchorPoint,
    HudConnectorAnchor,
    HudPoint,
    HudRectangle,
} from "@ui";

const measure = (view: HostInstance): Promise<HudRectangle> =>
    new Promise((resolve) => {
        view.measureInWindow((x, y, width, height) =>
            resolve({ x, y, width, height }),
        );
    });

export const useConnectorPoints = (
    fromRef: RefObject<HostInstance | null>,
    toRef: RefObject<HostInstance | null>,
    fromAnchor: HudConnectorAnchor,
    toAnchor: HudConnectorAnchor,
    children: ReactNode,
) => {
    const wrapperRef = useRef<HostInstance>(null);
    const [points, setPoints] = useState<[HudPoint, HudPoint] | null>(null);
    const [layoutVersion, setLayoutVersion] = useState(0);
    const { width, height } = useWindowDimensions();

    useEffect(() => {
        let cancelled = false;
        const update = async () => {
            const wrapper = wrapperRef.current;
            const from = fromRef.current;
            const to = toRef.current;
            if (!wrapper || !from || !to) {
                setPoints(null);
                return;
            }
            const [wrapperRectangle, fromRectangle, toRectangle] =
                await Promise.all([
                    measure(wrapper),
                    measure(from),
                    measure(to),
                ]);
            if (cancelled) {
                return;
            }
            const next: [HudPoint, HudPoint] = [
                getHudAnchorPoint(fromRectangle, fromAnchor, wrapperRectangle),
                getHudAnchorPoint(toRectangle, toAnchor, wrapperRectangle),
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
        const frame = requestAnimationFrame(update);
        return () => {
            cancelled = true;
            cancelAnimationFrame(frame);
        };
    }, [
        children,
        fromAnchor,
        fromRef,
        toAnchor,
        toRef,
        layoutVersion,
        width,
        height,
    ]);

    const onLayout = () => setLayoutVersion((previous) => previous + 1);
    return { wrapperRef, points, onLayout };
};
