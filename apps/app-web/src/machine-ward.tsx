import { MachineWard, MachineWardComponents, Orientation, OrientationSubscriptionDefinition } from "@apparatus";
import { WebRouteStoryGear } from "@the-dead-planet/nav-gauge-gears-route-story-web";
import { ErrorFallback } from "./ErrorFallback";
import { Footer, Layout, TopBar } from "./layout";
import { Machine } from "./machine/Machine";
import { Notices } from "./notices/Notices";
import { WebChronoLens } from "@the-dead-planet/nav-gauge-gears-route-story-web/src/chrono-lens/chrono-lens";

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
            WebChronoLens,
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
