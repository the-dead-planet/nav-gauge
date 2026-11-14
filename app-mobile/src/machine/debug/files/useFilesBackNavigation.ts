import { useEffect } from "react";
import { BackHandler } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { topBarBackAction$ } from "@mobile-ui";

export const useFilesBackNavigation = (onBack: (() => void) | undefined) => {
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) {
            return;
        }
        topBarBackAction$.next({ onBack });
        const subscription = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                if (!onBack) {
                    return false;
                }
                onBack();
                return true;
            },
        );
        return () => {
            topBarBackAction$.next(null);
            subscription.remove();
        };
    }, [isFocused, onBack]);
};
