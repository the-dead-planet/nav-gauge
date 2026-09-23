import { FC, useEffect, useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, Modal, StyleProp, View, ViewStyle } from "react-native";
import { DialogProps, FontType, TransitionProps, useTheme } from "@ui";
import { useSubjectState } from "@tinker-chest";
import { Panel } from "../hud";
import { Button } from "../button";
import { Text } from "../typography";
import { Transition } from "../transition";

const slideMap: Record<string, TransitionProps['slide']> = {
    middle: 'to-bottom',
    'left-drawer': 'to-right',
    'right-drawer': 'to-left',
};

const placementStyles: Record<string, ViewStyle> = {
    middle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    'left-drawer': {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
    },
    'right-drawer': {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
    },
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    fullWidth: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    panel: {
        rowGap: 10,
        maxHeight: '100%',
    },
    panelFullWidth: {
        width: '100%',
    },
    header: {
        paddingTop: 15,
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 19,
        lineHeight: 22,
    },
    content: {
        paddingHorizontal: 20,
        flexShrink: 1,
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
    color = 'neutral',
    variant = 'fill-translucent',
    placement = 'middle',
    closeText,
    onClose,
    save,
    style,
    children,
}) => {
    const [render, setRender] = useState(true);
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const theme = useTheme();
    const [media] = useSubjectState(theme.media$);
    const isWide = !media.isLessThanSm;
    const drawerTop = media.windowHeight <= 500 ? 0 : Math.min(media.windowHeight * 0.06, 64);
    const handleClose = () => setRender(false);
    const addShadow = variant === 'fill-translucent';

    useEffect(() => {
        Animated.timing(overlayOpacity, {
            toValue: render ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [overlayOpacity, render]);

    return (
        <Modal visible transparent animationType="none" onRequestClose={handleClose}>
            <Animated.View style={[styles.overlay, { backgroundColor: overlayOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, .6)'],
            }) }]}>
                <Transition
                    render={render}
                    slide={slideMap[placement]}
                    fade
                    onUnmount={onClose}
                    style={isWide ? [placementStyles[placement], placement !== 'middle' && { top: drawerTop }] : styles.fullWidth}
                >
                    <Panel variant={variant} color={color} style={[styles.panel, !isWide && styles.panelFullWidth, style]}>
                        <View style={styles.header}>
                            <Text
                                color={color}
                                fontType={FontType.NeonText}
                                shadow={addShadow}
                                style={[styles.headerText, { color: theme.color(color, 100) }]}
                            >
                                {header.toUpperCase()}
                            </Text>
                        </View>
                        <ScrollView style={styles.content}>
                            {children}
                        </ScrollView>
                        <View style={styles.footer}>
                            <View style={styles.buttonCell}>
                                <Button variant="fill-inverse" color={color} onPress={handleClose}>
                                    {closeText}
                                </Button>
                            </View>
                            {save ? (
                                <View style={styles.buttonCell}>
                                    <Button
                                        variant="fill"
                                        color={color}
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
            </Animated.View>
        </Modal>
    );
};
