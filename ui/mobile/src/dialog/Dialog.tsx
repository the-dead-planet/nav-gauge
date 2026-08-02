import { FC, useState } from "react";
import { View, StyleSheet, Modal, StyleProp, ViewStyle } from "react-native";
import { DialogProps, TransitionProps } from "@ui";
import { Panel } from "../hud";
import { Button } from "../button";
import { Text } from "../typography";
import { Transition } from "../transition";

const slideMap: Record<string, TransitionProps['slide']> = {
    middle: 'to-bottom',
    'left-drawer': 'to-right',
    'right-drawer': 'to-left',
};

const styles = StyleSheet.create({
    middle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    drawerLeft: {
        position: 'absolute',
        left: 0,
        top: 80,
    },
    drawerRight: {
        position: 'absolute',
        right: 0,
        top: 80,
    },
    panel: {
        rowGap: 10,
    },
    header: {
        paddingTop: 15,
        paddingHorizontal: 20,
    },
    content: {
        paddingHorizontal: 20,
    },
    footer: {
        flexDirection: 'row',
    },
    buttonCell: {
        flex: 1,
    },
});

interface Props extends DialogProps {
    style?: StyleProp<ViewStyle>;
}

export const Dialog: FC<Props> = ({
    header,
    variant = 'fill-translucent',
    placement = 'middle',
    closeText,
    onClose,
    save,
    style,
    children,
}) => {
    const [render, setRender] = useState(true);
    const handleClose = () => setRender(false);
    const addShadow = variant === 'fill-translucent';

    return (
        <Modal visible transparent animationType="none" onRequestClose={handleClose}>
            <Transition
                render={render}
                slide={slideMap[placement]}
                fade
                onUnmount={onClose}
                style={{
                    'middle': styles.middle,
                    'left-drawer': styles.drawerLeft,
                    'right-drawer': styles.drawerRight
                }[placement]}
            >
                <Panel variant={variant} color="primary" style={[styles.panel, style]}>
                    <View style={styles.header}>
                        <Text color="primary" shadow={addShadow}>
                            {header.toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.content}>
                        {children}
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.buttonCell}>
                            <Button variant="fill-translucent" color="primary" onPress={handleClose}>
                                {closeText}
                            </Button>
                        </View>
                        {save ? (
                            <View style={styles.buttonCell}>
                                <Button
                                    variant="fill"
                                    color="primary"
                                    onPress={() => {
                                        save.onSave();
                                        handleClose();
                                    }}
                                >
                                    {save.saveText}
                                </Button>
                            </View>
                        ) : null}
                    </View>
                </Panel>
            </Transition>
        </Modal>
    );
};
