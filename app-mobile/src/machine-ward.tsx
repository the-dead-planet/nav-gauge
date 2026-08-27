import { Appearance, Dimensions, ScaledSize } from "react-native";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { MachineGear, MachineWard, MachineWardComponents } from "@apparatus";
import { Layout, TopBar } from "./layout";
import { Machine } from "./machine/Machine";
import { ErrorFallback } from "./ErrorFallback";
import { NoticesList } from "./notices/NoticesList";
import { MobileMap } from "@mobile-apparatus";
import { MobileChronoLens } from "@mobile-apparatus";
import { navigationRef, RootStackParamList } from "./navigation";
import { Media, MediaSubscriptionDefinition, Orientation } from "@ui";

const AsyncStorage = createAsyncStorage('nav-gauge');

export class MobileMachineWard extends MachineWard<MobileMap, MobileChronoLens, keyof RootStackParamList> {
    public constructor(gears: MachineGear<MobileMap, MobileChronoLens>[]) {
        const getMedia = (window: ScaledSize): Media => {
            const { width, height } = Dimensions.get('window');

            return {
                windowWidth: width,
                windowHeight: height,
                orientation: window.width > height
                    ? Orientation.Landscape
                    : Orientation.Portrait
            };
        };

        const mediaSubscription: MediaSubscriptionDefinition = {
            initial: () => getMedia(Dimensions.get('window')),
            subscribe: (onChange) => {
                const handler = ({ window }: { window: ScaledSize }) => {
                    onChange(getMedia(window));
                };

                const subscription = Dimensions.addEventListener('change', handler);

                return {
                    unsubscribe: () => {
                        subscription.remove();
                    }
                }
            }
        };

        super(
            gears,
            MobileChronoLens,
            AsyncStorage,
            Appearance.getColorScheme() === 'light',
            mediaSubscription
        );
    }

    public components: MachineWardComponents<keyof RootStackParamList> = {
        errorFallbackComponent: ErrorFallback,
        layoutComponent: Layout,
        topBarComponent: TopBar,
        machineComponent: Machine,
        noticesComponent: NoticesList,
    };

    public navigate = (path: keyof RootStackParamList) => {
        const routeExists = navigationRef.getRootState().routeNames.includes(path);

        if (routeExists) {
            navigationRef.navigate(path);
        } else {
            navigationRef.navigate('NotFound');
        }
    };

    public navigateBack = () => {
        if (navigationRef.isReady() && navigationRef.canGoBack()) {
            navigationRef.goBack();
        }
    };
}
