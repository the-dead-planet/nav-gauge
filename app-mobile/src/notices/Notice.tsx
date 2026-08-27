import { FC, useEffect, useRef } from "react";
import { Animated, Button, StyleSheet } from "react-native";
import { Text } from '@mobile-ui';
import { SignaliumNotice } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";
import { useTheme } from "@ui";
import { useSubjectState } from "@tinker-chest";

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderWidth: 1,
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
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
    const { namespace, translationKey, individuator, translatron } = useMobileMachineWard();
    const [registry] = useSubjectState(translatron.registry$);
    const [settings] = useSubjectState(individuator.settings$);

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
            borderColor: theme.componentColor(notice.type),
            backgroundColor: theme.componentColor('background'),
            shadowColor: theme.componentColor('box-shadow'),
            opacity,
            transform: [{ translateY }]
        }]}>
            <Text>{notice.text} {notice.type === 'error' ? notice.error.message || '' : ''}</Text>
            <Button
                title={translatron.translate(settings.language, registry, { n: namespace, t: translationKey.Close })}
                onPress={() => onRemove(notice.id)}
            />
        </Animated.View>
    );
};
