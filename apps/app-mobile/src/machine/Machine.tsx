import { FC } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapSection } from "./MapSection";
import { Stories } from "@mobile-ui";
import { navigationRef, RootStackParamList } from "../navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Machine: FC = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: 'transparent'
                    },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={MapSection}
                />
                <Stack.Screen
                    name="Stories"
                    component={Stories}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
