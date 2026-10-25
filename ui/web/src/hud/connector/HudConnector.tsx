import { FC, RefObject } from "react";
import { DEFAULT_COLOR, getHudConnectorGeometry, HudConnectorProps } from "@ui";
import styles from "./hud-connector.module.css";
import { useConnectorPoints } from "./useConnectorPoints";

interface Props extends HudConnectorProps {
    fromRef: RefObject<Element | null>;
    toRef: RefObject<Element | null>;
}

export const HudConnector: FC<Props> = ({
    children,
    fromRef,
    toRef,
    color = DEFAULT_COLOR,
    activeGlow = "none",
    fromAnchor = "center",
    toAnchor = "center",
}) => {
    const { wrapperRef, points } = useConnectorPoints(
        fromRef,
        toRef,
        fromAnchor,
        toAnchor,
    );
    const geometry = points ? getHudConnectorGeometry(points) : null;
    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            {children}
            {geometry ? (
                <svg
                    className={styles.connector}
                    data-appearance-variant="default"
                    data-appearance-color={color}
                    data-appearance-highlight={color}
                    data-glow={activeGlow}
                    aria-hidden="true"
                >
                    {activeGlow !== "none" ? (
                        <polyline
                            points={geometry.path}
                            className={styles.glow}
                        />
                    ) : null}
                    <polyline points={geometry.path} />
                    <polygon points={geometry.marker} />
                </svg>
            ) : null}
        </div>
    );
};
