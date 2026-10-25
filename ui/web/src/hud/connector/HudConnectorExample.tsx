import { useRef } from "react";
import { HudConnectorProps } from "@ui";
import { HudConnector } from "./HudConnector";
import { Panel } from "../panel";
import styles from "../hud.stories.module.css";

export const HudConnectorExample = (
    props: Omit<HudConnectorProps, "children">,
) => {
    const fromRef = useRef<HTMLDivElement>(null);
    const toRef = useRef<HTMLDivElement>(null);
    return (
        <HudConnector {...props} fromRef={fromRef} toRef={toRef}>
            <div className={styles["connector-sample"]}>
                <Panel ref={fromRef} elevation="none">
                    <div className={styles.sample}>From</div>
                </Panel>
                <Panel ref={toRef} elevation="none">
                    <div className={styles.sample}>To</div>
                </Panel>
            </div>
        </HudConnector>
    );
};
