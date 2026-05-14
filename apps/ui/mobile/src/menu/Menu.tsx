import { useState, useRef, ReactNode, useEffect } from 'react';
import {
    View,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Pressable,
    Dimensions,
} from 'react-native';
import { useTheme } from '@ui';
import { Text } from '../text';

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
    iconAnchor?: MenuAnchor;
    menuAnchor?: MenuAnchor;
    children?: ReactNode;
}

export const Menu: React.FC<MenuProps> = ({
    iconAnchor = 'bottom-right',
    menuAnchor = 'top-right',
    children,
}) => {
    const theme = useTheme();
    const [visible, setVisible] = useState<boolean>(false);
    const [menuPosition, setMenuPosition] = useState<MenuPosition>({});

    const anchorRef = useRef<View>(null);

    const toggleMenu = (): void => {
        if (!anchorRef.current) {
            return;
        }
        anchorRef.current.measureInWindow((x, y, width, height) => {
            const window = Dimensions.get('window');
            const windowWidth = window.width;
            const windowHeight = window.height;

            setMenuPosition({
                right: windowWidth - (x + width),
                top: y + height,
            });
            setVisible(true);
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                ref={anchorRef}
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
                onRequestClose={() => setVisible(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setVisible(false)}
                >
                    <View
                        style={[
                            styles.menuList,
                            {
                                top: menuPosition.top,
                                right: menuPosition.right,
                                backgroundColor: theme.componentColor('menu-background'),
                                shadowColor: theme.componentColor('box-shadow'),
                            }
                        ]}
                    >
                        {children}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};
