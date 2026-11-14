import { useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { topBarBackAction$ } from "../tinkers";
import { StoryEntry, StoryGroup } from "./model";

export const useStoryNavigation = (isFocused: boolean) => {
    const [selectedGroup, setSelectedGroup] = useState<StoryGroup | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<StoryEntry | null>(null);

    useEffect(() => {
        if (!isFocused) {
            return;
        }
        const onBack = selectedEntry
            ? () => setSelectedEntry(null)
            : selectedGroup
              ? () => setSelectedGroup(null)
              : undefined;
        topBarBackAction$.next({ onBack });
        const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
            if (!onBack) {
                return false;
            }
            onBack();
            return true;
        });
        return () => {
            topBarBackAction$.next(null);
            subscription.remove();
        };
    }, [isFocused, selectedEntry, selectedGroup]);

    return { selectedEntry, setSelectedEntry, selectedGroup, setSelectedGroup };
};
