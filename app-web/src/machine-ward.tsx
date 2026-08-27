import type * as maplibregl from "maplibre-gl";
import { MachineGear, MachineWard, MachineWardComponents } from "@apparatus";
import { ErrorFallbackPage } from "./pages";
import { Layout, TopBar } from "./layout";
import { Machine } from "./machine/Machine";
import { Notices } from "./notices/Notices";
import { WebChronoLens } from "@web-apparatus";
import { Media, MediaSubscriptionDefinition, Orientation } from "@ui";

export class WebMachineWard extends MachineWard<maplibregl.Map, WebChronoLens> {
    public constructor(gears: MachineGear<maplibregl.Map, WebChronoLens>[]) {
        const getMedia = (): Media => {
            return {
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight,
                orientation: window.innerWidth > window.innerHeight
                    ? Orientation.Landscape
                    : Orientation.Portrait
            };
        };
        const mediaSubscription: MediaSubscriptionDefinition = {
            initial: () => getMedia(),
            subscribe: (onChange) => {
                const handler = () => {
                    onChange(getMedia());
                };
                window.addEventListener('resize', handler);

                return {
                    unsubscribe: () => window.removeEventListener('resize', handler)
                }
            }
        };

        super(
            gears,
            WebChronoLens,
            localStorage,
            window.matchMedia("(prefers-color-scheme: light)").matches,
            mediaSubscription
        );
    }

    public components: MachineWardComponents = {
        errorFallbackComponent: ErrorFallbackPage,
        layoutComponent: Layout,
        topBarComponent: TopBar,
        machineComponent: Machine,
        noticesComponent: Notices,
    };

    public navigate = (_path: string) => {
        // Not needed yet
    };

    public navigateBack = () => {
        // Not needed yet
    };
}
