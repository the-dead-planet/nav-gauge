import { FC, ReactNode, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Icons, useTheme } from "@ui";
import { Icon } from "../../icons";
import { Text } from "../../typography";

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        textTransform: 'uppercase',
        flex: 1,
    }
});

interface Props {
    fontSize: number;
    expandable?: boolean;
    isExpanded: boolean;
    prepend?: ReactNode;
    label: string;
    append?: ReactNode;
}

export const FieldsetHeaderContent: FC<Props> = ({
    fontSize,
    expandable,
    isExpanded,
    prepend,
    append,
    label,
}) => {
    const theme = useTheme();
    const chevronRotation = useRef(new Animated.Value(isExpanded ? 0 : -90)).current;

    useEffect(() => {
        Animated.timing(chevronRotation, {
            toValue: isExpanded ? 0 : -90,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isExpanded]);

    const labelColor = theme.isLight
        ? theme.color('grey', 800)
        : theme.color('grey', 200);

    return (
        <View style={styles.header}>
            {expandable ? (
                <Animated.View style={{
                    transform: [{
                        rotate: chevronRotation.interpolate({
                            inputRange: [-90, 0],
                            outputRange: ['-90deg', '0deg'],
                        })
                    }]
                }}>
                    <Icon icon={Icons.NounProject.ChevronDownDoubleTriangle} width={12} height={12} color={labelColor} />
                </Animated.View>
            ) : null}
            {prepend ? <View>{prepend}</View> : null}
            <Text
                style={[
                    styles.label,
                    { fontSize, color: labelColor }
                ]}
            >
                {label}
            </Text>
            {append ? <View>{append}</View> : null}
        </View>
    );
};
