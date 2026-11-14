import { createNavigationContainerRef } from "@react-navigation/native";

export type RootStackParamList = {
    Home: undefined;
    Stories: undefined;
    Files: undefined;
    NotFound: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
