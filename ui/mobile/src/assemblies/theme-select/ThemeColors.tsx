import { FC, Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemeSelectColorPreview } from '@ui';
import { ColorBox } from '../../gizmos/color-box';
import { Divider } from '../../chassis/divider';

const styles = StyleSheet.create({
    colorRow: {
        flexDirection: 'row',
        gap: 2,
    },
    selectedColorRow: {
        flexDirection: 'row',
        gap: 4,
    },
});

export const ThemeColors: FC<{
    groups: ThemeSelectColorPreview[][];
    size?: number;
    selected?: boolean;
}> = ({ groups, size, selected }) => (
    <View
        style={selected ? styles.selectedColorRow : styles.colorRow}
        accessibilityElementsHidden
    >
        {groups.map((group, index) => (
            <Fragment key={index}>
                {index > 0 ? <Divider orientation="vertical" /> : null}
                {group.map(({ role, color, shade }) => (
                    <ColorBox
                        key={role}
                        color={color}
                        shade={shade}
                        size={size}
                    />
                ))}
            </Fragment>
        ))}
    </View>
);
