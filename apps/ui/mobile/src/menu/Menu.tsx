import { useState, useRef, ReactNode, createContext, useContext } from 'react';
import {
    View,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions,
    Pressable,
} from 'react-native';
import { useTheme } from '@ui';
import { Text } from '../typography';

const MenuContext = createContext<{ close: () => void }>({ close: () => { } });

export const useMenuClose = (): (() => void) => useContext(MenuContext).close;

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

export interface MenuPosition {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}

export type MenuAnchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface MenuProps {
    placement?: MenuAnchor;
    children?: ReactNode;
}

function placementPair(p: MenuAnchor): { icon: MenuAnchor; menu: MenuAnchor } {
    const vertical = p.startsWith('top') ? 'bottom' : 'top';
    const horizontal = p.endsWith('right') ? 'right' : 'left';
    return { icon: p, menu: `${vertical}-${horizontal}` as MenuAnchor };
}

export const Menu: React.FC<MenuProps> = ({
    placement = 'bottom-right',
    children,
}) => {
    const { icon: iconAnchor, menu: menuAnchor } = placementPair(placement);
    const theme = useTheme();
    const [visible, setVisible] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});

    const iconAnchorRef = useRef<View>(null);

    function iconAnchorPoint(anchor: MenuAnchor, x: number, y: number, w: number, h: number): { iconX: number; iconY: number } {
        switch (anchor) {
            case 'top-left': return { iconX: x, iconY: y };
            case 'top-right': return { iconX: x + w, iconY: y };
            case 'bottom-left': return { iconX: x, iconY: y + h };
            case 'bottom-right': return { iconX: x + w, iconY: y + h };
        }
    }

    function menuAnchorStyle(anchor: MenuAnchor, iconX: number, iconY: number, windowWidth: number, windowHeight: number): MenuPosition {
        switch (anchor) {
            case 'top-left': return { top: iconY, left: iconX };
            case 'top-right': return { top: iconY, right: windowWidth - iconX };
            case 'bottom-left': return { bottom: windowHeight - iconY, left: iconX };
            case 'bottom-right': return { bottom: windowHeight - iconY, right: windowWidth - iconX };
        }
    }

    const toggleMenu = (): void => {
        const ref = iconAnchorRef.current;
        if (!ref) { 
            return;
        }
        ref.measureInWindow((x, y, width, height) => {
            const window = Dimensions.get('window');
            const { iconX, iconY } = iconAnchorPoint(iconAnchor, x, y, width, height);
            const position = menuAnchorStyle(menuAnchor, iconX, iconY, window.width, window.height);
            setMenuPosition(position);
            setVisible(true);
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                ref={iconAnchorRef}
                onPress={toggleMenu}
                style={styles.iconButton}
                activeOpacity={0.7}
            >
                <Text style={{ fontSize: 18 }}>⋮</Text>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={visible}
                animationType="fade"
            >
                <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
                    <View
                        style={[
                            styles.menuList,
                            {
                                ...menuPosition,
                                backgroundColor: theme.componentColor('menu-background'),
                                shadowColor: theme.componentColor('box-shadow'),
                            }
                        ]}
                    >
                        <MenuContext.Provider value={{ close: () => setVisible(false) }}>
                            {children}
                        </MenuContext.Provider>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};
