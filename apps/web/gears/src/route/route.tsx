import { Gear, GearId } from "@apparatus";
import { RouteLayer } from "./RouteLayer";
import { ImagesLayer } from "./images/ImagesLayer";

// Move gears to packages and refactor type of component to be dependent on platform? 
export const routeGear: Gear<GearId> = {
    id: 'route',
    engage: (stateWarden) => {
        stateWarden.cartomancer.addOverlay({
            id: 'route',
            component: RouteLayer,
        });
        stateWarden.cartomancer.addOverlay({
            id: 'images',
            component: ImagesLayer,
        });
    },
    disengage: (stateWarden) => {
        stateWarden.cartomancer.removeOverlay('route');
        stateWarden.cartomancer.removeOverlay('images');
    },
}
