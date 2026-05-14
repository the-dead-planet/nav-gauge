import { createNavigationContainerRef } from "@react-navigation/native";

export type RootStackParamList = {
    Home: undefined;
    Stories: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
