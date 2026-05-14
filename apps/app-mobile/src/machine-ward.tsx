import { Appearance, Dimensions, ScaledSize } from "react-native";
import { createAsyncStorage } from "@react-native-async-storage/async-storage";
import { MachineGear, MachineWard, MachineWardComponents, Orientation, OrientationSubscriptionDefinition } from "@apparatus";
import { Footer, Layout, TopBar } from "./layout";
import { Machine } from "./machine/Machine";
import { ErrorFallback } from "./ErrorFallback";
import { NoticesList } from "./notices/NoticesList";
import { MobileMap } from "@mobile-ui";
import { MobileChronoLens } from "./chrono-lens";
import { navigationRef, RootStackParamList } from "./navigation";

const AsyncStorage = createAsyncStorage('nav-gauge');

export class MobileMachineWard extends MachineWard<MobileMap, keyof RootStackParamList> {
    public constructor(gears: MachineGear<MobileMap>[]) {
        const getOrientation = (window: ScaledSize): Orientation => {
            return window.width > Dimensions.get('window').height
                ? Orientation.Landscape
                : Orientation.Portait;
        };

        const orientationSubscription: OrientationSubscriptionDefinition = {
            initial: () => getOrientation(Dimensions.get('window')),
            subscribe: (onChange) => {
                const handler = ({ window }: { window: ScaledSize }) => {
                    onChange(getOrientation(window));
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
            orientationSubscription
        );
    }

    public components: MachineWardComponents<keyof RootStackParamList> = {
        errorFallbackComponent: ErrorFallback,
        layoutComponent: Layout,
        topBarComponent: TopBar,
        machineComponent: Machine,
        footerComponent: Footer,
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
