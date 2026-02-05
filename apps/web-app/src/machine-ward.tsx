import { MachineWard, MachineWardComponents, Orientation, OrientationSubscriptionDefinition } from "@apparatus";
import { WebRouteStoryGear } from "@the-dead-planet/nav-gauge-web-gears-route-story";
import { ErrorFallback } from "./ErrorFallback";
import { Footer, Layout, TopBar } from "./layout";
import { Machine } from "./machine/Machine";
import { Notices } from "./notices/Notices";

export class WebMachineWard extends MachineWard<maplibregl.Map> {
    public constructor() {
        const getOrientation = (): Orientation => {
            return window.innerWidth > window.innerHeight
                ? Orientation.Landscape
                : Orientation.Portait;
        };
        const orientationSubscription: OrientationSubscriptionDefinition = {
            initial: () => getOrientation(),
            subscribe: (onChange) => {
                const handler = () => {
                    onChange(getOrientation());
                };

                window.addEventListener('resize', handler);

                return {
                    unsubscribe: () => window.removeEventListener('resize', handler)
                }
            }
        };

        super(
            {
                navigate: null,
                'route-story': WebRouteStoryGear,
                "record-route": null,
                "submit-data": null,
            },
            localStorage,
            window.matchMedia("(prefers-color-scheme: light)").matches,
            orientationSubscription
        );
    }

    public components: MachineWardComponents = {
        errorFallbackComponent: ErrorFallback,
        layoutComponent: Layout,
        topBarComponent: TopBar,
        machineComponent: Machine,
        footerComponent: Footer,
        noticesComponent: Notices
    };
}
