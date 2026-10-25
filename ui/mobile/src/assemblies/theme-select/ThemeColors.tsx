import { FC, Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { ColorBoxProps, DEFAULT_SIZE, ThemeSelectColorPreview } from '@ui';
import { ColorBox } from '../../gizmos/color-box';
import { Divider } from '../../chassis/divider';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
});

export const ThemeColors: FC<{
    groups: ThemeSelectColorPreview[][];
    size?: ColorBoxProps['size'];
    selected?: boolean;
}> = ({
    groups,
    size = DEFAULT_SIZE,
    selected,
}) => (
        <View
            style={styles.row}
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
