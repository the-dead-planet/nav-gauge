import { useRef } from "react";
import { HostInstance, StyleSheet, View } from "react-native";
import { HudConnectorProps } from "@ui";
import { HudConnector } from "./HudConnector";
import { Panel } from "../panel";

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 140,
        padding: 24,
        gap: 32,
    },
    sample: {
        padding: 16,
    },
});

export const HudConnectorExample = (
    props: Omit<HudConnectorProps, "children">,
) => {
    const fromRef = useRef<HostInstance>(null);
    const toRef = useRef<HostInstance>(null);
    return (
        <HudConnector {...props} fromRef={fromRef} toRef={toRef}>
            <View style={styles.row}>
                <View ref={fromRef} collapsable={false}>
                    <Panel elevation="none" style={styles.sample}>
                        From
                    </Panel>
                </View>
                <View ref={toRef} collapsable={false}>
                    <Panel elevation="none" style={styles.sample}>
                        To
                    </Panel>
                </View>
            </View>
        </HudConnector>
    );
};
