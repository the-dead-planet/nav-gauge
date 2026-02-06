import { Appearance, Dimensions, ScaledSize } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MachineWard, MachineWardComponents, Orientation, OrientationSubscriptionDefinition } from "@apparatus";
import { Footer, Layout, TopBar } from "./layout";
import { Machine } from "./machine/Machine";
import { ErrorFallback } from "./ErrorFallback";
import { NoticesList } from "./notices/NoticesList";
import { MobileRouteStoryGear } from "@the-dead-planet/nav-gauge-mobile-gears-route-story";
import { MobileMap } from "@the-dead-planet/nav-gauge-mobile-ui/src/model";

export class MobileMachineWard extends MachineWard<MobileMap> {
    public constructor() {
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
            {
                "navigate": null,
                'route-story': MobileRouteStoryGear,
                "record-route": null,
                "submit-data": null
            },
            AsyncStorage,
            Appearance.getColorScheme() === 'light',
            orientationSubscription
        );
    }

    public components: MachineWardComponents = {
        errorFallbackComponent: ErrorFallback,
        layoutComponent: Layout,
        topBarComponent: TopBar,
        machineComponent: Machine,
        footerComponent: Footer,
        noticesComponent: NoticesList,
    };
}
