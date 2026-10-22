import { FC, useEffect, useRef } from "react";
import { Animated, Button, StyleSheet } from "react-native";
import { resolveElevationStyle, Text } from '@mobile-ui';
import { SignaliumNotice, useTranslate } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useTheme } from "@ui";

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderWidth: 1,
        rowGap: 10
    }
});

interface Props {
    notice: SignaliumNotice;
    onRemove: (id: string) => void;
}

export const Notice: FC<Props> = ({
    notice,
    onRemove
}) => {
    const theme = useTheme();
    const translateY = useRef(new Animated.Value(-80)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const { namespace, translationKey } = useMobileMachineWard();
    const translate = useTranslate();

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1.5,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start();
    }, [opacity, translateY]);

    return (
        <Animated.View style={[styles.container, {
            borderColor: theme.color(notice.type),
            backgroundColor: theme.resolveAppearance().surface,
            ...resolveElevationStyle(theme, 'floating'),
            opacity,
            transform: [{ translateY }]
        }]}>
            <Text>{notice.text} {notice.type === 'glitch' ? notice.error.message || '' : ''}</Text>
            <Button
                title={translate({ n: namespace, t: translationKey.Close })}
                onPress={() => onRemove(notice.id)}
            />
        </Animated.View>
    );
};
