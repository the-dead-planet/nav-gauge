import { useState, useRef, useCallback, FC, ComponentProps } from 'react';
import {
    View,
    Modal,
    StyleSheet,
    LayoutChangeEvent,
    Pressable,
} from 'react-native';
import {
    useTheme,
    MenuPosition,
    getIconAndMenuAnchors,
    MenuContext,
    getIconAnchorPoint,
    getMenuPosition,
    MenuProps,
    Icons,
} from '@ui';
import { Button } from '../button';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
    },
    menuList: {
        position: 'absolute',
        borderRadius: 12,
        paddingVertical: 8,
        minWidth: 160,
        elevation: 10,
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 0.6,
        shadowRadius: 1,
    }
});

export const Menu: FC<MenuProps> = ({
    icon = Icons.NounProject.KebabMenu,
    iconActiveColor,
    iconSize,
    placement = 'bottom-right',
    children,
}) => {
    const { icon: iconAnchor, menu: menuAnchor } = getIconAndMenuAnchors(placement);
    const theme = useTheme();
    const [visible, setVisible] = useState<boolean>(false);
    const [positionKey, setPositionKey] = useState<number>(0);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});

    const iconAnchorRef = useRef<View>(null);
    const anchorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const toggleMenu = (): void => {
        const ref = iconAnchorRef.current;
        if (!ref) {
            return;
        }
        ref.measureInWindow((x, y, width, height) => {
            anchorRef.current = getIconAnchorPoint(iconAnchor, x, y, width, height);
            setMenuPosition({});
            setPositionKey((k) => k + 1);
            setVisible(true);
        });
    };

    const onOverlayLayout = useCallback((e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;
        setMenuPosition(getMenuPosition(menuAnchor, anchorRef.current, width, height));
    }, [menuAnchor]);

    return (
        <View style={styles.container}>
            <Button
                forwardRef={iconAnchorRef}
                icon={icon as ComponentProps<typeof Button>['icon']}
                highlightColor={iconActiveColor}
                size={iconSize}
                active={visible}
                onPress={toggleMenu}
                style={styles.iconButton}
            />

            <Modal
                transparent={true}
                visible={visible}
                animationType="fade"
            >
                <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)} onLayout={onOverlayLayout}>
                    <View
                        key={positionKey}
                        style={[
                            styles.menuList,
                            {
                                ...menuPosition,
                                backgroundColor: theme.componentColor('menu-background'),
                                shadowColor: theme.componentColor('box-shadow'),
                            }
                        ]}
                    >
                        <MenuContext.Provider value={{ onClose: () => setVisible(false) }}>
                            {children}
                        </MenuContext.Provider>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};
