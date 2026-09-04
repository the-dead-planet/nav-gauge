import { FC } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapSection } from "./MapSection";
import { Stories } from "@mobile-ui";
import { navigationRef, RootStackParamList } from "../navigation";
import { NotFoundScreen } from "./NotFoundScreen";
import { MachineWardMachineProps } from "@apparatus";
import { useMobileMachineWard } from "@mobile-apparatus";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Machine: FC<MachineWardMachineProps<keyof RootStackParamList>> = ({ onNavigateBack }) => {
    const { isDev } = useMobileMachineWard();

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
                {isDev ? (
                    <Stack.Screen
                        name="Stories"
                        component={Stories}
                    />
                ) : null}
                <Stack.Screen name="NotFound">
                    {(props) => <NotFoundScreen {...props} onNavigateBack={onNavigateBack} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
};
