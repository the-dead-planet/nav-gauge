import { FC } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Modal,
    StyleProp,
    View,
    ViewStyle,
} from 'react-native';
import {
    DEFAULT_COLOR,
    actionButtonVariants,
    DEFAULT_FILL_VARIANT,
    DialogProps,
    FontType,
    TransitionProps,
    useTheme,
} from '@ui';
import { useSubjectState } from '@tinker-chest';
import { Panel } from '../../hud';
import { Button } from '../../gizmos/button';
import { Text } from '../../design-system/typography';
import { Transition } from '../../motion/transition';
import { resolveLayerStyle } from '../../design-system/theme';
import { useDialogTransition } from './useDialogTransition';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HudContent } from '../../hud/HudContent';

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
        flex: 1,
    },
    panel: {
        rowGap: 10,
        maxHeight: '100%',
    },
    panelFullWidth: {
        width: '100%',
        flex: 1,
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
    color = DEFAULT_COLOR,
    variant = DEFAULT_FILL_VARIANT,
    placement = 'middle',
    closeText,
    onClose,
    save,
    style,
    children,
}) => {
    const {
        render,
        close: handleClose,
        overlayOpacity,
    } = useDialogTransition();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [media] = useSubjectState(theme.media$);
    const isWide = !media.isLessThanSm;
    const drawerTop =
        media.windowHeight <= 500 ? 0 : Math.min(media.windowHeight * 0.06, 64);
    const appearance = theme.resolveAppearance(variant, color);
    const actionVariants = actionButtonVariants[variant];

    return (
        <Modal
            visible
            transparent
            statusBarTranslucent
            navigationBarTranslucent
            animationType="none"
            onRequestClose={handleClose}
        >
            <Animated.View
                style={[
                    styles.overlay,
                    !isWide && {
                        paddingTop: insets.top,
                        paddingRight: insets.right,
                        paddingBottom: insets.bottom,
                        paddingLeft: insets.left,
                    },
                    {
                        backgroundColor: overlayOpacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [
                                'rgba(0, 0, 0, 0)',
                                'rgba(0, 0, 0, .6)',
                            ],
                        }),
                    },
                ]}
            >
                <Transition
                    render={render}
                    slide={slideMap[placement]}
                    fade
                    onUnmount={onClose}
                    style={
                        isWide
                            ? [
                                  placementStyles[placement],
                                  placement !== 'middle' && { top: drawerTop },
                              ]
                            : styles.fullWidth
                    }
                >
                    <Panel
                        variant={variant}
                        color={color}
                        accessibilityViewIsModal
                        accessibilityLabel={header}
                        style={[
                            styles.panel,
                            resolveLayerStyle(
                                theme,
                                'dialog',
                                placement === 'left-drawer' && isWide
                                    ? 'right'
                                    : placement === 'right-drawer' && isWide
                                      ? 'left'
                                      : 'down',
                            ),
                            !isWide && styles.panelFullWidth,
                            style,
                        ]}
                    >
                        <View style={styles.header}>
                            <Text
                                fontType={FontType.NeonText}
                                uppercase
                                accessibilityRole="header"
                                style={[
                                    styles.headerText,
                                    { color: appearance.glyphs },
                                ]}
                            >
                                {header}
                            </Text>
                        </View>
                        <ScrollView style={styles.content}>
                            <HudContent appearance={appearance}>
                                {children}
                            </HudContent>
                        </ScrollView>
                        <View style={styles.footer}>
                            <View style={styles.buttonCell}>
                                <Button
                                    variant={actionVariants.inactive}
                                    color={color}
                                    onPress={handleClose}
                                >
                                    {closeText}
                                </Button>
                            </View>
                            {save ? (
                                <View style={styles.buttonCell}>
                                    <Button
                                        variant={actionVariants.active}
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
