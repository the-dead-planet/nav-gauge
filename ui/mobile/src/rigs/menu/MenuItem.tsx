import { ComponentProps, FC } from 'react';
import { StyleSheet } from 'react-native';
import { MenuItemProps, useMenuContext } from '@ui';
import { Button } from '../../gizmos/button';

const styles = StyleSheet.create({
    menuItem: {
        justifyContent: 'flex-start',
    },
});

export const MenuItem: FC<
    MenuItemProps & Pick<ComponentProps<typeof Button>, 'onPress'>
> = ({
    color,
    highlightColor,
    variant = 'ghost',
    size,
    isFirst: _isFirst,
    closeOnPress = true,
    onPress,
    ...props
}) => {
    const context = useMenuContext();

    return (
        <Button
            {...props}
            variant={variant}
            size={size ?? context.size}
            color={color ?? context.color}
            highlightColor={
                highlightColor ??
                context.highlightColor ??
                color ??
                context.color
            }
            style={styles.menuItem}
            onPress={(event) => {
                event.stopPropagation();
                onPress?.(event);
                if (closeOnPress) {
                    context.onClose();
                }
            }}
        />
    );
};
